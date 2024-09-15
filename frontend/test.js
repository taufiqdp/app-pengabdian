import { jwtVerify } from "jose";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlkIjoxMSwiaXNfYWRtaW4iOnRydWUsImV4cCI6MTcyNjg5NTgyMn0.jdlVhEIrz-mGzTx8KofURAmID_i6QiTvirf_iduPdcc";
console.log(token);

try {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const { payload } = await jwtVerify(token, secret);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < currentTimestamp) {
    console.error("Token has expired");
  }
} catch (error) {
  console.error("Token verification failed:", error);
}
