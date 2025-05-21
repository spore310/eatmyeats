import { importJWK, JWK } from "jose";
import { env } from "@/utils/env";

function decodeJWKFromBase64<T extends JWK = JWK>(data: string): T {
  return JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
}

const encryptKey: JWK = decodeJWKFromBase64(env.ENCRYPTION_KEY_BASE64);
const privateKey: JWK = decodeJWKFromBase64(env.SIGNING_KEY_BASE64);
const publicKey: JWK = decodeJWKFromBase64(env.PUBLIC_JWK_BASE64);

export const encryptKeyJWK = await importJWK(encryptKey, "A256GCM");
export const privateKeyJWK = await importJWK(privateKey, "RS256");
export const publicKeyJWK = await importJWK(publicKey, "RS256");
