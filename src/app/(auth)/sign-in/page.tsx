"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInFormData } from "@/lib/schemas";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "demo@voiceagent.ai",
      password: "password123",
    },
  });

  const onSubmit = async (_data: SignInFormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-5">
          <Image
            src="/image/Logo.svg"
            alt="Calls4u.ai logo"
            width={40}
            height={40}
            className="h-auto w-auto"
          />
          <Image
            src="/image/calls4u.svg"
            alt="Calls4u.ai"
            width={40}
            height={40}
            className="h-auto w-auto"
          />
        </div>

        <div className="border-border shadow-primary/30 rounded-2xl border p-6 shadow-lg backdrop-blur-lg sm:p-10">
          <div className="mb-6 text-center">
            <h2 className="font-display text-2xl font-bold">Welcome back</h2>
            <p className="font-body text-muted-foreground mt-2 text-sm">
              Sign in to your VoiceAgent account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && (
                <p role="alert" className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p role="alert" className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 h-10 w-full rounded-lg text-base text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="font-body text-muted-foreground mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
