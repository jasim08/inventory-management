import * as bcrypt from 'bcrypt';
const saltRounds = 10;

export const encryptPassword = async (
  plainPassword: string,
): Promise<string> => {
  // Generate a salt
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password using the generated salt
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  return hashedPassword;
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  // Compare the plain password with the hashed password
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

  return isMatch;
};
