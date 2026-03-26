"use client";

import TestSenerio from "@/components/special/TestSenerio";
import { useUserContext } from "@/components/layout/UserContext";

export default function TestSenerioPage() {
  const { role, normalTokens, specialTokens } = useUserContext();

  return (
    <div className="container">
      <TestSenerio
        role={role}
        normalTokens={normalTokens}
        specialTokens={specialTokens}
      />
    </div>
  );
}
