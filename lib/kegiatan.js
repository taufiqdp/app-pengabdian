"use server";

import { revalidatePath } from "next/cache";

function getUTC7Date(date = new Date()) {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000);
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export async function getKegiatanByDate(startDate, endDate) {
  const utc7Now = getUTC7Date();
  const today = formatDate(utc7Now);

  startDate = startDate || today;
  endDate = endDate || today;

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan?start_date=${startDate}&end_date=${endDate}`
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
  const utc7Now = getUTC7Date();
  const today = formatDate(utc7Now);

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan?start_date=${today}&end_date=${today}`
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
  const utc7Now = getUTC7Date();
  const firstDay = new Date(utc7Now.getFullYear(), utc7Now.getMonth(), 1 + 1);
  const lastDay = new Date(
    utc7Now.getFullYear(),
    utc7Now.getMonth() + 1,
    0 + 1
  );

  const formattedStartDate = formatDate(firstDay);
  const formattedEndDate = formatDate(lastDay);

  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
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
  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/kegiatan/${idKegiatan}`
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
  try {
    const response = await fetch(
      `${process.env.BASE_API_URL}admin/pamong/${idPamong}/kegiatan`
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
