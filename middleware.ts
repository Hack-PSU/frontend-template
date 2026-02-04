import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const registrationOpen =
    process.env.NEXT_PUBLIC_REGISTRATION_OPEN === "true";

  if (!registrationOpen && req.nextUrl.pathname === "/register") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/register"],
};