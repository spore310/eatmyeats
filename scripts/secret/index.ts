import { JWK, exportJWK, generateKeyPair, generateSecret } from "jose";

async function main() {
  const options = { extractable: true };
  const { privateKey, publicKey } = await generateKeyPair("RS256", options);
  const privateJWK = await exportJWK(privateKey);
  const publicJWK = await exportJWK(publicKey);

  const encKey = await generateSecret("A256GCM", options);
  const encJWK = await exportJWK(encKey);

  const base64Public = getBuffer(publicJWK);
  const base64Private = getBuffer(privateJWK);
  const base64Enc = getBuffer(encJWK);

  console.log(`SIGNING_KEY_BASE64=${base64Private}`, "\n");
  console.log(`PUBLIC_JWK_BASE64=${base64Public}`, "\n");
  console.log(`ENCRYPTION_KEY_BASE64=${base64Enc}`, "\n");
}

const getBuffer = (data: any) =>
  Buffer.from(JSON.stringify(data)).toString("base64");

main();
