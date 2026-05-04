/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates if the string is a valid email format
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates if the phone number is fully entered (12 digits total)
 */
export const isPhoneComplete = (value: string): boolean => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 12; // Country code (3) + number (9)
};

/**
 * Masks an email address (e.g., "example@mail.com" -> "ex****le@mail.com")
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return email;
  const parts = email.split("@");
  const localPart = parts[0];
  const domain = parts[1];

  if (!localPart || !domain) return email;

  if (localPart.length <= 2) return `${localPart[0]}*@${domain}`;
  const first = localPart.substring(0, 2);
  const last = localPart.substring(localPart.length - 2);
  const masked = "*".repeat(Math.max(4, localPart.length - 4));
  return `${first}${masked}${last}@${domain}`;
};

/**
 * Masks a phone number (e.g., "+994 50 123 45 67" -> "+994 50 *** ** 67")
 */
export const maskPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 12) return phone;
  // Format: +994 50 123 45 67
  // Mask middle digits
  const country = digits.substring(0, 3);
  const prefix = digits.substring(3, 5);
  const last = digits.substring(digits.length - 2);
  return `+${country} ${prefix} *** ** ${last}`;
};

/**
 * Validates if the username is entered
 */
export const isValidUsername = (username: string): boolean => {
  return username.trim().length > 0;
};
