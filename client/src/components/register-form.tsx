"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    if (!email) return toast.error("Email is required");

    const name = formData.get("username") as string;
    if (!name) return toast.error("Username is required");

    const password = formData.get("password") as string;
    if (!password) return toast.error("Password is required");

    const confirmPassword = formData.get("confirmPassword") as string;
    if (!confirmPassword) return toast.error("Please confirm your password");

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    const { data, error } = await authClient.signUp.email(
      {
        name: name,
        email: email,
        password: password,
      },
      {
        onRequest: () => {},
        onSuccess: () => {},
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      }
    );
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign up for an account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@locked.in"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="username">Username</Label>
                </div>
                <Input id="username" name="username" />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
              />
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <Button variant="outline" className="w-full text-black">
                  Sign up with Discord
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
