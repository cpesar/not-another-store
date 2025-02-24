import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

import { ShoppingBagIcon } from "@/public/images/shopping-bags";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
    error?: string;
  }>;
}) => {
  const { callbackUrl, error } = await props.searchParams;

  if (error) {
    console.error("Auth error:", error);
  }

  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <ShoppingBagIcon width={100} height={100} />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>

          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
          {error && (
            <div className="text-red-500 text-center">
              Authentication error: {error}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
