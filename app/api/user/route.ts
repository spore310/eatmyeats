import { getUserByName } from "@/utils/server/api/user/getUser";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const username = req.nextUrl.searchParams.get("username");
  const res = await getUserByName(username);

  return NextResponse.json<GETUserAPIResponseBody>(
    { user: res.user, timeStamp: res.timeStamp, message: res.statusText },
    { status: res.statusCode, statusText: res.statusText }
  );
};
