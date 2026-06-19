import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isValidCui, normalizeCui } from "@/lib/cui";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const COOKIE_NAME = "customer-session";

export type PublicCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  isBusiness: boolean;
  company: string;
  cui: string;
  phone: string;
  county: string;
  city: string;
  address: string;
};

function toPublicCustomer(customer: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  isBusiness: boolean;
  company: string;
  cui: string;
  phone: string;
  county: string;
  city: string;
  address: string;
}): PublicCustomer {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    emailVerified: customer.emailVerified,
    isBusiness: customer.isBusiness,
    company: customer.company,
    cui: customer.cui,
    phone: customer.phone,
    county: customer.county,
    city: customer.city,
    address: customer.address,
  };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const candidate = scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(hash, "hex");
  return storedBuffer.length === candidate.length && timingSafeEqual(storedBuffer, candidate);
}

export async function setCustomerSession(customerId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, customerId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  if (!id) return null;

  const customer = await prisma.customer.findUnique({ where: { id } });
  return customer ? toPublicCustomer(customer) : null;
}

export async function registerCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isBusiness: boolean;
}) {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim().toLowerCase();

  if (!firstName || !lastName || !email || input.password.length < 6) {
    throw new Error("Completeaza numele, prenumele, emailul si o parola de minim 6 caractere.");
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Exista deja un cont cu acest email.");
  }

  const verificationToken = randomBytes(32).toString("hex");

  const customer = await prisma.customer.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: hashPassword(input.password),
      isBusiness: input.isBusiness,
      emailVerified: false,
      verificationToken,
    },
  });

  await sendVerificationEmail(email, verificationToken).catch(() => {
    // Don't block registration if email fails
  });

  await setCustomerSession(customer.id);
  return toPublicCustomer(customer);
}

export async function loginCustomer(email: string, password: string) {
  const customer = await prisma.customer.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!customer || !verifyPassword(password, customer.passwordHash)) {
    throw new Error("Email sau parola gresita.");
  }

  await setCustomerSession(customer.id);
  return toPublicCustomer(customer);
}

export async function verifyCustomerEmail(token: string) {
  const customer = await prisma.customer.findUnique({ where: { verificationToken: token } });
  if (!customer) throw new Error("Link invalid sau expirat.");

  await prisma.customer.update({
    where: { id: customer.id },
    data: { emailVerified: true, verificationToken: null },
  });
}

export async function resendVerificationEmail() {
  const current = await getCurrentCustomer();
  if (!current) throw new Error("Trebuie sa fii autentificat.");
  if (current.emailVerified) throw new Error("Email-ul este deja verificat.");

  const token = randomBytes(32).toString("hex");
  await prisma.customer.update({
    where: { id: current.id },
    data: { verificationToken: token },
  });
  await sendVerificationEmail(current.email, token);
}

export async function updateCustomerProfile(input: {
  firstName: string;
  lastName: string;
  isBusiness: boolean;
  company: string;
  cui: string;
  phone: string;
  county: string;
  city: string;
  address: string;
}) {
  const current = await getCurrentCustomer();
  if (!current) {
    throw new Error("Trebuie sa fii autentificat.");
  }

  const cui = normalizeCui(input.cui);
  if (input.isBusiness && !isValidCui(cui)) {
    throw new Error("CUI invalid. Verifica datele firmei.");
  }

  const customer = await prisma.customer.update({
    where: { id: current.id },
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      isBusiness: input.isBusiness,
      company: input.company.trim(),
      cui: input.isBusiness ? cui : "",
      phone: input.phone.trim(),
      county: input.county.trim(),
      city: input.city.trim(),
      address: input.address.trim(),
    },
  });

  return toPublicCustomer(customer);
}
