const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.1000-1-articole.com";

// Also served at /.well-known/security.txt via a rewrite in next.config.ts
export function GET() {
  // RFC 9116 requires an expiry date; roll it forward so the file never goes stale
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  const body = `# security.txt — RFC 9116
# 1000&1 Articole SRL — https://www.1000-1-articole.com

Contact: mailto:1001articole@gmail.com
Expires: ${expires}
Preferred-Languages: ro, en
Canonical: ${BASE}/.well-known/security.txt

# Daca ati descoperit o vulnerabilitate de securitate pe acest site,
# va rugam sa ne contactati la adresa de mai sus. Includeti pasii de
# reproducere si impactul estimat. Va raspundem in cel mult 5 zile
# lucratoare si va rugam sa nu faceti publica problema pana cand
# aceasta nu a fost remediata.
#
# If you have found a security vulnerability on this site, please
# report it to the contact address above. Include reproduction steps
# and estimated impact. We reply within 5 business days and ask that
# you do not disclose the issue publicly until it has been fixed.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
