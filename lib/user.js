import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export default async function getAllUser() {
  const bearer = await verifyToken();

  try {
    const response = await fetch(`${process.env.BASE_API_URL}admin/users`, {
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    });

    if (response.status === 401) {
      cookies().delete("access_token");
      return {
        error: 401,
      };
    }

    const user = await response.json();

    revalidatePath("/user", "layout");
    revalidatePath("/dashboard");

    return { user };
  } catch (error) {
    return { error: error.message };
  }
}
