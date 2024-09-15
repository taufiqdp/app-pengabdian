"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

function getAccessToken() {
  const token = cookies().get("access_token").value;
  return token;
}

export async function getAllPamong() {
  const bearer = getAccessToken();

  try {
    const response = await fetch(`${process.env.BASE_API_URL}admin/pamong`, {
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    });
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
  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/pamong/${id}`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      }
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
  const bearer = getAccessToken();

  try {
    const response = await fetch(`${process.env.BASE_API_URL}pamong/`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${bearer}`,
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

export async function deletePamong(id) {
  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/pamong/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
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
    console.error("Error in DeletePamong:", error);
    return { error: error.message };
  }
}

export default async function editPamong(formData, idPamong) {
  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/pamong/${idPamong}`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${bearer}`,
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
