import { NextRequest, NextResponse } from "next/server";
import seedData from "@/scripts/seed/seed.json";
import db from "@/utils/server/db/singleton";
import {
  deCrypt,
  signAndEncrypt,
  verifyJWT,
} from "@/utils/server/api/auth/jwt";
import { jwtVerify } from "jose";
import { checkPassword, hashPassword } from "@/utils/server/api/auth/password";

export const GET = async (_req: NextRequest): Promise<NextResponse> => {
  try {
    const userFormPassWordInput: string = "abcd123";
    const hashedPasswordFromDb: string = await hashPassword(
      userFormPassWordInput
    );
    const passCheck = await checkPassword(
      userFormPassWordInput,
      hashedPasswordFromDb
    );
    if (!passCheck) {
      return NextResponse.json(
        { message: `Password did not match` },
        { status: 400 }
      );
    }
    return NextResponse.json({ isValid: passCheck }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { message: `error: ${(e as Error).message}` },
      { status: 400 }
    );
  }
};
