export function normalizeCui(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/^RO/, "")
    .replace(/\s+/g, "");
}

export function isValidCui(value: string) {
  const cui = normalizeCui(value);

  if (!/^\d{2,10}$/.test(cui)) {
    return false;
  }

  const control = "753217532";
  const digits = cui.split("").map(Number);
  const checkDigit = digits.pop();

  if (checkDigit === undefined) {
    return false;
  }

  const padded = digits.join("").padStart(9, "0");
  const sum = padded
    .split("")
    .reduce((acc, digit, index) => acc + Number(digit) * Number(control[index]), 0);
  const calculated = (sum * 10) % 11;

  return (calculated === 10 ? 0 : calculated) === checkDigit;
}
