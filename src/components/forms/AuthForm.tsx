"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/common/ToastProvider";
import { ROUTES } from "@/constants/routes";
import { login, signup } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

interface AuthFormProps {
  mode: "login" | "signup";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "customer@technova.dev" : "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const payload = { email, name };

    if (mode === "login") {
      dispatch(login(payload));
      showToast("Welcome back to TechNova");
    } else {
      dispatch(signup(payload));
      showToast("Account created");
    }

    const redirect = params.get("redirect");
    router.push(redirect || ROUTES.profile);
  };

  return (
    <form className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900" onSubmit={handleSubmit}>
      <p className="text-sm font-black uppercase text-brand-600">{mode === "login" ? "Secure login" : "Create account"}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{mode === "login" ? "Welcome back" : "Join TechNova"}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {mode === "login" ? "Use any email to enter your customer account. Orders are stored locally for that email." : "Create a local mock customer account stored in your browser."}
      </p>
      <div className="mt-6 grid gap-4">
        {mode === "signup" ? <Input icon={FiUser} label="Name" onChange={(event) => setName(event.target.value)} placeholder="Your name" required value={name} /> : null}
        <Input icon={FiMail} label="Email" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} />
        <Input icon={FiLock} label="Password" placeholder="Any mock password" required type="password" />
      </div>
      <Button className="mt-6 w-full" type="submit">{mode === "login" ? "Login" : "Create account"}</Button>
      <p className="mt-5 text-center text-sm text-slate-500">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <Link className="font-bold text-brand-600" href={mode === "login" ? ROUTES.signup : ROUTES.login}>
          {mode === "login" ? "Create account" : "Login"}
        </Link>
      </p>
    </form>
  );
};
