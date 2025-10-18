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
import Link from "next/link";

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const email = formData.get("email") as string;
        if (!email) return toast.error("Email is required");

        const { error } = await authClient.forgetPassword(
            {
                email: email,
                redirectTo: `${window.location.origin}/auth/reset-password`,
            },
            {
                onRequest: () => {
                    toast.loading("Sending reset email...");
                },
                onSuccess: () => {
                    toast.dismiss();
                    toast.success(
                        "Password reset email sent! Check your inbox.",
                    );
                },
                onError: (ctx) => {
                    toast.dismiss();
                    toast.error(ctx.error.message);
                },
            },
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to
                        reset your password
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
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Send Reset Email
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Remember your password?{" "}
                            <Link
                                href="/auth/login"
                                className="underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
