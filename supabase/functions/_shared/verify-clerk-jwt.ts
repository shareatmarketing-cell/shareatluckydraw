// Shared Clerk JWT verification for all edge functions
import { createRemoteJWKSet, jwtVerify } from "https://esm.sh/jose@5.9.6";

export interface VerifiedUser {
  userId: string;
}

export async function verifyClerkJwt(token: string): Promise<VerifiedUser> {
  // Check token format
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  // Decode payload (without verification) only to read issuer for JWKS
  const payloadJson = JSON.parse(
    atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
  );

  const issuer = payloadJson?.iss;
  if (!issuer || typeof issuer !== "string") {
    throw new Error("Token missing issuer");
  }

  // Verify JWT signature using Clerk's JWKS
  const jwksUrl = new URL("/.well-known/jwks.json", issuer);
  const JWKS = createRemoteJWKSet(jwksUrl);

  const { payload } = await jwtVerify(token, JWKS, {
    issuer,
  });

  const userId = payload?.sub;
  if (!userId || typeof userId !== "string") {
    throw new Error("Token missing subject");
  }

  return { userId };
}

export function extractToken(authHeader: string | null): string {
  if (!authHeader) {
    throw new Error("No authorization header");
  }
  return authHeader.replace("Bearer ", "");
}
