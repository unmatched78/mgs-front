// src/pages/LoginPage.tsx
import { LoginForm } from "@/components/login-form";
import LanguageSelector from "@/components/LanguageSelector";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LanguageSelector className="mb-2" />
        <LoginForm />
      </div>
    </div>
  );
}