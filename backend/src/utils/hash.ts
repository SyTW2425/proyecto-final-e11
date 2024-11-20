import bcrypt from 'bcrypt';

/**
 * Cifra una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Contraseña cifrada
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Número de rondas de generación de salt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/**
 * Compara una contraseña en texto plano con una cifrada
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Contraseña cifrada
 * @returns `true` si coinciden, `false` si no
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};