import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Lightweight auth check for middleware that doesn't import mongoose
 * This works in Edge Runtime
 */
export async function getAuthSession(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  return token ? { user: token } : null;
}

