import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
import { z } from "zod";
import {
  HASH_SEPERATOR,
  ITERATIONS,
  KEY_LENGTH,
  SALT_LENGTH,
  DIGEST,
} from "./constants";
const generatedPasswordSchema = z
  .string()
  .min(10)
  .refine((val) => val.includes(HASH_SEPERATOR), {
    message: "Generated password must have seperator",
  });
export async function hashPassword(
  password: string,
  providedSalt?: Buffer
): Promise<string> {
  const hashedPassword = await new Promise((resolve, reject) => {
    const salt = providedSalt ?? randomBytes(SALT_LENGTH);
    pbkdf2(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      DIGEST,
      (error, derivedKey) => {
        /**
         * TODO:
         * []: Add logger or custom error class
         */
        if (error) return reject(error);
        const result = `${derivedKey.toString(
          "hex"
        )}${HASH_SEPERATOR}${salt.toString("hex")}`;
        return resolve(result);
      }
    );
  });
  const safeParse = generatedPasswordSchema.parse(hashedPassword);

  return safeParse;
}
/**
 *
 * @param {string} userPassword Sanitized user password input from form
 * @param {string} dbPassword Serilized hashed password stored in db fetched from users username
 * @returns {boolean} returns the time safe compare from both hashed derivedKey
 */
export async function checkPassword(
  userPassword: string,
  dbPassword: string
): Promise<boolean> {
  try {
    const [dbDerivedKey, salt] = dbPassword.split(HASH_SEPERATOR);
    const hexSalt = Buffer.from(salt, "hex");
    const hashedPassword = await hashPassword(userPassword, hexSalt);
    const [userDerivedKey, _] = hashedPassword.split(HASH_SEPERATOR);
    const user = Buffer.from(userDerivedKey, "hex");
    const db = Buffer.from(dbDerivedKey, "hex");
    const result = timingSafeEqual(user, db);
    if (!result) {
      return false;
    }
    return result;
  } catch (e: unknown) {
    /**
     * TODO:
     * []: Add logger or custom error class
     */
    throw e;
  }
}
