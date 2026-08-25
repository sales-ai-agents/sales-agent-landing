"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema, type SignUpFormData } from "@/lib/schemas";
import { useRegister } from "@/lib/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage, AUTH_ERROR_MESSAGES } from "@/lib/error-messages";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";

export default function SignUpPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUpFormData): void => {
    registerMutation.mutate(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onSuccess: () => {
          toast.success("Акаунт створено");
          router.replace("/dashboard");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code, AUTH_ERROR_MESSAGES));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      }
    );
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
            <h2 className="font-display text-2xl font-bold">Створити акаунт</h2>
            <p className="font-body text-muted-foreground mt-2 text-sm">
              Почніть працювати з Calls4U
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Ім&apos;я</Label>
              <Input id="name" placeholder="Іван Петренко" {...register("name")} />
              {errors.name && (
                <p role="alert" className="text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Електронна пошта</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && (
                <p role="alert" className="text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Мін. 8 символів"
                {...register("password")}
              />
              {errors.password && (
                <p role="alert" className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Підтвердити пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p role="alert" className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 h-10 w-full rounded-lg text-base text-white"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Створення акаунту..." : "Створити акаунт"}
            </Button>
          </form>

          <div className="mt-6">
            <SocialLoginButtons />
          </div>

          <p className="font-body text-muted-foreground mt-4 text-center text-sm">
            Вже є акаунт?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
