"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

function formatDate(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function getAccessToken() {
  const token = cookies().get("access_token").value;
  return token;
}

export async function getKegiatanByDate(startDate, endDate) {
  const utc7Now = new Date();
  const today = formatDate(utc7Now);

  startDate = startDate || today;
  endDate = endDate || today;

  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan?start_date=${startDate}&end_date=${endDate}`,
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

    const kegiatan = await response.json();
    return { kegiatan, startDate, endDate };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getKegiatanToday() {
  const utc7Now = new Date();
  const today = formatDate(utc7Now);

  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan?start_date=${today}&end_date=${today}`,
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

    const kegiatan = await response.json();
    revalidatePath("/", "layout");
    return { kegiatan, startDate: today, endDate: today };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getKegiatanThisMonth() {
  const utc7Now = new Date();
  const firstDay = new Date(utc7Now.getFullYear(), utc7Now.getMonth(), 1);
  const lastDay = new Date(utc7Now.getFullYear(), utc7Now.getMonth() + 1, 0);

  const formattedStartDate = formatDate(firstDay);
  const formattedEndDate = formatDate(lastDay);

  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan?start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
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

    const kegiatan = await response.json();
    revalidatePath("/kegiatan", "layout");
    return {
      kegiatan,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getKegiatanById(idKegiatan) {
  const bearer = getAccessToken();

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan/${idKegiatan}`,
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

    const kegiatan = await response.json();
    revalidatePath("/kegiatan", "layout");

    return { kegiatan };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getKegiatanByPamongId(idPamong) {
  const bearer = getAccessToken(); // Added bearer token

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/pamong/${idPamong}/kegiatan`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`, // Added Authorization header
        },
      }
    );

    if (!response.ok) {
      return {
        error: `Network response was not ok: ${response.status} ${response.statusText}`,
      };
    }

    const kegiatan = await response.json();
    revalidatePath(`/pamong/${idPamong}`);
    return { kegiatan };
  } catch (error) {
    return { error: error.message };
  }
}
