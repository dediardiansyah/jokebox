import { NextResponse } from "next/server";

//  // exact login page
// const protectedRoutes = ["/dashboard", "/settings", "/profile"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(request) {
  const authToken = request.cookies.get("authToken")?.value;
  const path = request.nextUrl.pathname;

//   if (path.startsWith("/dashboard")) {
//     if (!authToken) {
//       const loginUrl = new URL("/login", request.url);
//       loginUrl.searchParams.set("callbackUrl", path);
//       return NextResponse.redirect(loginUrl);
//     }
//     return NextResponse.next();
//   }

  //  // exact login page
  //  if (protectedRoutes.includes(path)) {
  //    if (!authToken) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  //    }
  //  }

  if (authRoutes.includes(path)) {
    if (authToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
