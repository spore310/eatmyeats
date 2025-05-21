import { z } from "zod";
const envSchema = z.object({
  ENCRYPTION_KEY_BASE64: z.string().min(1),
  PUBLIC_JWK_BASE64: z.string().min(1),
  SIGNING_KEY_BASE64: z.string().min(1),
  PBKDF2_ITERATIONS: z.coerce.number().min(70000),
  PBKDF2_KEYLEN: z.coerce.number().min(32),
  PBKDF2_SALT_LENGTH: z.coerce.number().min(32),
  PBKDF2_DIGEST: z.enum(["sha256", "sha512", "sha384"]),
  PBKDF2_SEPERATOR: z.string().min(1).max(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Error loading env variables: ",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}
export const env = parsed.data;
