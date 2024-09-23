"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

function getAccessToken() {
  const token = cookies().get("access_token").value;
  return token;
}

export async function inputAgenda(formData) {
  const bearer = getAccessToken();

  try {
    const response = await fetch(`${process.env.BASE_API_URL}agenda/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      return {
        error: `Network response was not ok: ${response.status} ${response.statusText}`,
      };
    }

    const agenda = await response.json();
    revalidatePath("/agenda", "layout");
    return { agenda };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getAgendaThisMonth() {
  // const utc7Now = new Date();
  // const today = formatDate(utc7Now);

  const bearer = getAccessToken();

  try {
    const response = await fetch(`${process.env.BASE_API_URL}agenda`, {
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    });

    if (!response.ok) {
      return {
        error: `Network response was not ok: ${response.status} ${response.statusText}`,
      };
    }

    const agenda = await response.json();
    // console.log(new Date(agenda[0].tanggal_mulai).getMonth());
    return { agenda };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getUpcomingAgenda() {
  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/agenda/upcoming`,
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

    const agenda = await response.json();
    return { agenda };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteAgendaById(idAgenda) {
  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}agenda/${idAgenda}`,
      {
        method: "DELETE",
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

    revalidatePath("/agenda", "layout");
    // console.log(response);
    return {};
  } catch (error) {
    return { error: error.message };
  }
}
