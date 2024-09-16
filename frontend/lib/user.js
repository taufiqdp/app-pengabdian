"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

function getAccessToken() {
  const token = cookies().get("access_token").value;
  return token;
}

export default async function getAllUser() {
  const bearer = getAccessToken();

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
