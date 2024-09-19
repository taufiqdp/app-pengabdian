"use client";

import React, { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { redirect } from "next/navigation";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import pmLogo from "@/assets/pm-logo.png";
import logoGkidul from "@/assets/logo-gkidul.jpg";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full mt-6 bg-lblue text-white hover:bg-blue-500"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Memproses...
        </>
      ) : (
        "Masuk"
      )}
    </Button>
  );
}

export function Login({ loginAction }) {
  const [state, formAction] = useFormState(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  if (state.success) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-around h-screen">
      <div className="text-center">
        <h1 className="hidden font-bold text-4xl text-lblue">Sistem Laporan</h1>
        {/* <h2 className="text-4xl font-bold text-gray-800">Desa Semanu</h2> */}
      </div>

      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Masuk</CardTitle>
          <CardDescription>
            Masukkan nama pengguna dan kata sandi Anda untuk mengakses dashboard
            admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Nama Pengguna</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="Masukkan nama pengguna"
                    name="username"
                    className="pl-8"
                  />
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    name="password"
                    className="pl-8 pr-10"
                  />
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {state.errors && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{state.errors.message}</AlertDescription>
              </Alert>
            )}
            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Butuh bantuan? Hubungi{" "}
            <a href="https://wa.me/62895370855594" className="underline">
              dukungan IT
            </a>
          </p>
        </CardFooter>
      </Card>
      <div className="flex gap-8 text-center">
        {/* <Image
          src={pmLogo}
          alt="Pemdes Semanu"
          width={40}
          height={40}
          style={{ borderRadius: "0%" }}
        /> */}
        <Image
          src={logoGkidul}
          alt="Pemdes Semanu"
          width={40}
          height={40}
          priority
          className="rounded-full hidden"
          style={{ borderRadius: "0%" }} // Changed to make the image rectangular
        />
      </div>
    </div>
  );
}
