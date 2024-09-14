"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";

export function Login({ loginAction }) {
  const [state, formAction] = useFormState(loginAction, {});

  if (state.success) {
    redirect("/dashboard");
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Masuk</CardTitle>
        <CardDescription>
          Masukkan nama pengguna dan kata sandi Anda untuk masuk ke akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input
                id="username"
                placeholder="Masukkan nama pengguna"
                name="username"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan kata sandi"
                name="password"
              />
            </div>
          </div>
          {state.errors && (
            <div className="text-sm text-red-500">{state.errors.message}</div>
          )}
          <Button className="w-full mt-10">Masuk</Button>
        </form>
      </CardContent>
    </Card>
  );
}
