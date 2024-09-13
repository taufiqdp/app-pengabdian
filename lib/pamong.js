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

export async function inputPamong(formData) {
  try {
    const response = await fetch(`${process.env.BASE_API_URL}pamong/`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}. Error: ${errorText}`
      );
    }

    revalidatePath("/pamong", "layout");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error in InputPamong:", error);
    return { error: error.message };
  }
}

export default async function editPamong(formData, idPamong) {
  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/pamong/${idPamong}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}. Error: ${errorText}`
      );
    }

    revalidatePath("/pamong", "layout");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error in EditPamong:", error);
    return { error: error.message };
  }
}
