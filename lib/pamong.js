"use server";

import { revalidatePath } from "next/cache";

export async function getAllPamong() {
  try {
    const response = await fetch(`${process.env.BASE_API_URL}admin/pamong`);
    if (!response.ok) {
      return {
        error: `Network response was not ok: ${response.status} ${response.statusText}`,
      };
    }

    const pamong = await response.json();
    revalidatePath("/pamong", "layout");
    revalidatePath("/dashboard");
    return { pamong };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getPamongById(id) {
  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/pamong/${id}`
    );
    if (!response.ok) {
      return {
        error: `Network response was not ok: ${response.status} ${response.statusText}`,
      };
    }

    const pamong = await response.json();
    return { pamong };
  } catch (error) {
    return { error: error.message };
  }
}
