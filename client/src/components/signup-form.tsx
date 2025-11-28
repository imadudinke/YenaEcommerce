import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { createUser } from "@/api/auth";
import { useToast } from "@/components/ui/toast";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirect = useNavigate();
  const { show } = useToast();

  const validateClient = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName.trim()) {
      return "Please enter your full name.";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (password !== password2) {
      return "Passwords do not match.";
    }
    return null;
  };
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      show({
        title: "Invalid input",
        description: clientError,
        variant: "error",
      });
      return;
    }
    setIsLoading(true);
    const data = {
      email: email,
      password: password,
      password2: password2,
      full_name: fullName,
    };
    try {
      await createUser(data);
      show({
        title: "Account created",
        description: "You can now sign in.",
        variant: "success",
      });
      redirect("/login");
    } catch (err: any) {
      const apiMessage =
        err?.message || "Signup failed. Please review your details.";
      setError(apiMessage);
      show({
        title: "Signup failed",
        description: apiMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSignup}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="John Doe"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="m@example.com"
            required
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            id="confirm-password"
            type="password"
            required
          />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <Link to="/login">Sign in</Link>
          </FieldDescription>
          {error && (
            <p className="text-red-600 text-xs mt-2 text-center">{error}</p>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
