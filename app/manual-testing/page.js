"use client";

import ManualTesting from "@/components/special/ManualTesting";
import { useUserContext } from "@/components/layout/UserContext";

export default function ManualTestingPage() {
  const { role, normalTokens, specialTokens } = useUserContext();

  return (
    <div className="container">
      <ManualTesting
        role={role}
        normalTokens={normalTokens}
        specialTokens={specialTokens}
      />
    </div>
  );
}
