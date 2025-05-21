import { env } from "@/utils/env";

export const SALT_LENGTH = env.PBKDF2_SALT_LENGTH;
export const KEY_LENGTH = env.PBKDF2_KEYLEN;
export const ITERATIONS = env.PBKDF2_ITERATIONS;
export const HASH_SEPERATOR = env.PBKDF2_SEPERATOR;
export const DIGEST = env.PBKDF2_DIGEST;
