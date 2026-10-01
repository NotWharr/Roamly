/**
 * Checkout input rules and money maths.
 *
 * Pure functions, no React. The page owns the state; this owns the rules, so
 * the same check cannot be written two slightly different ways in two places.
 */

export const DEPARTURE_TIME = "8:00 AM";
export const TAX_RATE = 0.2;

export interface Money {
  base: number;
  taxes: number;
  total: number;
}

/** Half price for anyone under 12. */
export function quote(
  pricePerAdult: number,
  adults: number,
  children: number,
): Money {
  const base = pricePerAdult * adults + pricePerAdult * 0.5 * children;
  const taxes = Number((base * TAX_RATE).toFixed(2));
  return { base, taxes, total: Number((base + taxes).toFixed(2)) };
}

/** The standard card checksum, so a mistyped digit is caught before submit. */
function luhn(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

/**
 * Field rules.
 *
 * `type="email"` rejects a typo with no message and `required` lets an obviously
 * short phone number through, so each rule says what is wrong in plain terms and
 * returns an empty string when the value is fine.
 */
export const RULES = {
  name: (v: string) =>
    v.trim().length < 2 ? "Enter the name on the booking." : "",

  phone: (v: string) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length < 7) return "Enter a number we can reach you on.";
    return "";
  },

  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ""
      : "Enter an email we can send the confirmation to.",

  card: (v: string) => {
    const digits = v.replace(/[\s-]/g, "");
    if (digits.length < 13 || digits.length > 19)
      return "Enter the card number in full.";
    if (!luhn(digits)) return "That card number does not look right.";
    return "";
  },

  expiry: (v: string) => {
    const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.trim());
    if (!match) return "Use MM / YY.";

    const month = Number(match[1]);
    if (month < 1 || month > 12) return "Month must be 01 to 12.";

    // Last instant of that month, so a card expiring this month still works.
    const expires = new Date(2000 + Number(match[2]), month, 0, 23, 59, 59);
    if (expires < new Date()) return "That card has expired.";
    return "";
  },

  cvc: (v: string) => (/^\d{3,4}$/.test(v.trim()) ? "" : "Three or four digits."),
};

/** Groups a card number as it is typed, so it reads as a card. */
export function formatCard(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}
