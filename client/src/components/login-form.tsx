"use client"; // If using Next.js App Router

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, type FormEvent } from "react";
import loginAuth, { forgotPassword } from "@/api/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import Dialog components for the success modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const redirect = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await loginAuth(email, password);
      console.log("Login successful! Redirecting...");
      redirect("/");
    } catch (err) {
      setError("Login failed. Check your credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsForgotLoading(true);
    setError(null);
    setApiMessage(null);

    if (!email.trim()) {
      toast.error("Please enter your email address in the field above first.");
      setIsForgotLoading(false);
      return;
    }

    try {
      const response = await forgotPassword(email);

      setApiMessage(response.message || "A password reset link has been sent.");
      setIsModalOpen(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again later.");
      toast.error("Failed to send reset link.");
      console.error(err);
    } finally {
      setIsForgotLoading(false);
      setEmail("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl px-4 sm:px-6 md:px-0 flex flex-col gap-6",
          className
        )}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-xl sm:text-2xl font-bold">
              Login to your account
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base text-balance">
              Enter your email below to login to your account
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isForgotLoading}
                className="ml-auto text-xs sm:text-sm text-blue-600 underline-offset-4 hover:underline disabled:opacity-50"
              >
                {isForgotLoading ? "Sending..." : "Forgot your password?"}
              </button>
            </div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              required
            />
          </Field>
          {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
          <Field>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </Field>
          <Field>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm sm:max-w-md p-4 sm:p-6">
          <DialogHeader className="flex flex-col items-center text-center">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mb-3 sm:mb-4" />

            <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-900">
              Password Reset Initiated
            </DialogTitle>

            <DialogDescription className="mt-2 text-sm sm:text-base text-gray-600">
              {apiMessage || "A link has been sent to your email address."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 sm:mt-6 flex justify-center">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
