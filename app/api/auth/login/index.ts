import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import isPhoneNumber from "validator/es/lib/isMobilePhone";
const bodySchema = z.object({
  username: z.string().min(3).max(25),
  password: z.string().min(3).max(25),
  phoneNumber: z.string().refine((val) => isPhoneNumber(val), {
    message: "Phone number must be of the proper format",
  }),
});
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json();
  const safeParse = bodySchema.safeParse(body);

  if (safeParse.error) {
    return NextResponse.json({ error: safeParse.error }, { status: 400 });
  }
  return NextResponse.json({}, { status: 200 });
};
