export const PHONE_MASK = "+994 (__) ___ __ __";
export const MASK_CHAR = "_";


export const formatPhoneNumber = (digits: string): string => {
  const pattern = "___ (__) ___ __ __";
  let digitIndex = 0;
  let patternResult = "";

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    if (char === MASK_CHAR) {
      if (digitIndex < digits.length) {
        patternResult += digits[digitIndex];
        digitIndex++;
      } else {
        patternResult += MASK_CHAR;
      }
    } else {
      patternResult += char;  
    }
  }

  return "+" + patternResult;
};


export const handlePhoneChange = (
  newValue: string,
  oldValue: string,
  setter: (val: string) => void
) => {
  // Always ensure '+' at the start
  if (!newValue.startsWith("+")) {
    newValue = "+" + newValue.replace(/\+/g, "");
  }

  // Extract all digits after '+'
  let digits = newValue.slice(1).replace(/\D/g, "");

  // Ensure '994' is always at the beginning and cannot be deleted
  if (digits.length < 3 || !digits.startsWith("994")) {
    digits = "994" + digits.replace(/^9?9?4?/, "");
  }

  // Limit to maximum digits for the pattern
  digits = digits.slice(0, 12);

  const formatted = formatPhoneNumber(digits);

  // If deleting a non-digit character, remove the previous digit instead
  // but only if we are beyond the fixed '994' prefix
  if (newValue.length < oldValue.length && formatted === oldValue && digits.length > 3) {
    digits = digits.slice(0, -1);
    setter(formatPhoneNumber(digits));
  } else {
    setter(formatted);
  }
};
