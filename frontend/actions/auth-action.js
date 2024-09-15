"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState, formData) {
  const body = new URLSearchParams();
  body.append("username", formData.get("username"));
  body.append("password", formData.get("password"));

  let errors = {};

  const response = await fetch(`${process.env.BASE_API_URL}auth/admin/token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  if (!response.ok) {
    errors = {
      message: `Username atau password salah!`,
    };
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const { access_token } = await response.json();
  cookies().set("access_token", access_token, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    success: true,
  };
}

export async function logout() {
  cookies().delete("access_token");
  redirect("/login");
}
