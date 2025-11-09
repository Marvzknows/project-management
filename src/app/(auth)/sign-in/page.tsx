"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (payload: LoginFormValues) => {
    const { error } = await signIn.email({
      email: payload.email,
      password: payload.password,
      // callbackURL: "/dashboard", //  A URL to redirect to after the user verifies their email (optional)
      // rememberMe: false (default is true)
    });

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    }
  };

  const handleSocialSignIn = async (socialProvider: "google" | "github") => {
    setLoading(true);
    const { error } = await signIn.social({
      provider: socialProvider,
      callbackURL: "/dashboard",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Something wen wrong", {
        description: "Unable to sign-in, please try again",
      });
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Attach handleSubmit to form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <h1 className="text-xl font-bold">Welcome to Kanboink</h1>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                disabled={isSubmitting || loading}
                type="submit"
                className="w-full"
              >
                {isSubmitting ? "Logging in.." : "Login"}
              </Button>
            </div>

            {/* Divider */}
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>

            {/* OAuth buttons */}
            {/* OAuth buttons */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Google Button */}
              <Button
                disabled={loading}
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialSignIn("google")}
              >
                {/* Google icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.46c-.22 1.4-.9 2.6-1.93 3.4l3.12 2.4c1.83-1.7 2.89-4.2 2.89-7.2 0-.7-.07-1.37-.19-2H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M5.33 14.48a5.88 5.88 0 0 1 0-4.96L2.05 7.1a9.94 9.94 0 0 0 0 9.8l3.28-2.42z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 4.75c1.04 0 1.97.36 2.71 1.07l2.02-2.02A9.55 9.55 0 0 0 12 2a9.94 9.94 0 0 0-9.95 9.1l3.28 2.42A5.9 5.9 0 0 1 12 4.75z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 22c2.6 0 4.78-.85 6.38-2.3l-3.12-2.4a5.9 5.9 0 0 1-9.1-3.1L2.05 16.9A9.94 9.94 0 0 0 12 22z"
                  />
                </svg>
                <span>Continue with Google</span>
              </Button>

              {/* GitHub Button */}
              <Button
                disabled={loading}
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleSocialSignIn("github")}
              >
                {/* GitHub icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.43 7.86 10.96.57.1.78-.25.78-.56v-2.18c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.26-1.67-1.26-1.67-1.03-.7.08-.68.08-.68 1.14.08 1.74 1.18 1.74 1.18 1.01 1.74 2.65 1.24 3.3.95.1-.74.4-1.25.72-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a10.84 10.84 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.28 5.68.41.36.78 1.07.78 2.16v3.19c0 .31.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Continue with GitHub</span>
              </Button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-4">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
