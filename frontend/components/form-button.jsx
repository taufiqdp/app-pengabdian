"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function FormButton({ title }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={`bg-lblue hover:bg-blue-500 ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={pending}
    >
      {pending ? "Loading..." : title}
    </Button>
  );
}
