import { EncryptJWT, SignJWT, importJWK, jwtDecrypt, jwtVerify } from "jose";
import { encryptKeyJWK, privateKeyJWK, publicKeyJWK } from "./keys";
export async function encrypt(jwt: string): Promise<string> {
  return await new EncryptJWT({ jwt })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM", kid: "v1" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .encrypt(encryptKeyJWK);
}
export async function deCrypt(encoding: string): Promise<string> {
  const { payload } = await jwtDecrypt(encoding, encryptKeyJWK);
  return payload.jwt as string;
}

export async function signJWT(
  token: AccessToken | RefreshToken
): Promise<string> {
  return await new SignJWT({ token })
    .setProtectedHeader({ alg: "RS256", kid: "v1" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(privateKeyJWK);
}

export async function verifyJWT<T>(encoding: string): Promise<any> {
  return (await jwtVerify(encoding, publicKeyJWK)).payload;
}

export async function signAndEncrypt(token: RefreshToken): Promise<string> {
  const signedCookie = await signJWT(token);
  const encrypedCookie = await encrypt(signedCookie);
  return encrypedCookie;
}
