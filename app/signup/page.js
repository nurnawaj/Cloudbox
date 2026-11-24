import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Create account | CloudBox" };

export default function SignupPage() {
  if (getUserId()) redirect("/dashboard"); // already logged in
  return (
    <AuthShell>
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
