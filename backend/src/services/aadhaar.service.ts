export const validateAadhaarFormat = (aadhaar: string): boolean => {
  return /^[1-9][0-9]{11}$/.test(aadhaar);
};
