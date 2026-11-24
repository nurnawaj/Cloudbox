import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import AuthShell from "@/components/AuthShell";
import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Log in | CloudBox" };

export default function LoginPage() {
  if (getUserId()) redirect("/dashboard"); // already logged in
  return (
    <AuthShell>
      <AuthForm mode="login" />
    </AuthShell>
  );
}
