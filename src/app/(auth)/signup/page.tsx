import { Suspense } from "react";
import { AuthForm } from "@/components/forms/AuthForm";
import { Spinner } from "@/components/ui/Spinner";
import { MotionSection } from "@/components/animations/MotionReveal";

export default function SignupPage() {
  return (
    <MotionSection className="container-shell grid min-h-[calc(100vh-160px)] place-items-center py-12">
      <Suspense fallback={<Spinner label="Preparing signup" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </MotionSection>
  );
}
