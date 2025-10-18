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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [isValidToken, setIsValidToken] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if we have a valid reset token in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const type = urlParams.get("type");

        if (token && type === "recovery") {
            setIsValidToken(true);
        }
        setIsLoading(false);
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const password = formData.get("password") as string;
        if (!password) return toast.error("Password is required");

        const confirmPassword = formData.get("confirmPassword") as string;
        if (!confirmPassword)
            return toast.error("Please confirm your password");

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        await authClient.resetPassword(
            {
                newPassword: password,
            },
            {
                onRequest: () => {
                    toast.loading("Updating password...");
                },
                onSuccess: () => {
                    toast.dismiss();
                    toast.success("Password updated successfully!");
                    router.push("/auth/login");
                },
                onError: (ctx) => {
                    toast.dismiss();
                    toast.error(ctx.error.message);
                },
            },
        );
    }

    if (isLoading) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">Loading...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader>
                        <CardTitle>Invalid Reset Link</CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 text-center text-sm">
                            <Link
                                href="/auth/forgot-password"
                                className="underline underline-offset-4"
                            >
                                Request a new password reset
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>
                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Update Password
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
