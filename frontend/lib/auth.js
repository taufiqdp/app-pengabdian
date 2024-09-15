import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function verifyToken() {
  const token = cookies().get("access_token").value;

  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTimestamp) {
      cookies().delete("access_token");
    }

    return token;
  } catch (error) {
    cookies().delete("access_token");

    return null;
  }
}
