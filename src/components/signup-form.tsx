"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";

type SignUpValues = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
};

// Zod validation schema
const signupSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: SignUpValues) => {
    if (data.password.trim() !== data.confirmPassword.trim()) {
      toast.error("Invalid confirm password");
      return;
    }

    const res = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (res.error) {
      toast.error(res.error.message || "Something went wrong");
    } else {
      toast.success("Account successfully created");
      reset();
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            <FieldGroup>
              <Field>
                <Button disabled={isSubmitting} type="submit">
                  Create Account
                </Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? {""}
                  <Link href={"/sign-in"}>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
