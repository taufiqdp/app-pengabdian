import { revalidatePath } from "next/cache";

export default async function getAllUser() {
  try {
    const response = await fetch(`${process.env.BASE_API_URL}admin/users`);
    if (!response.ok) {
      return {
        error: `Network response was not ok: ${response.status} ${response.statusText}`,
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
