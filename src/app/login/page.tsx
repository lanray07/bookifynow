import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { createSupabaseAuthServerClient } from "@/lib/supabase-auth-server";

export default async function LoginPage() {
  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f5efe7] px-6 py-12">
      <AuthForm />
    </main>
  );
}
