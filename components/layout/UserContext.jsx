"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded } = useUser();
  const [role, setRole] = useState(null);
  const [normalTokens, setNormalTokens] = useState(null);
  const [specialTokens, setSpecialTokens] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const fetchUserTokens = async () => {
    if (!clerkUser) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${clerkUser.id}`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.normalTokens !== undefined) setNormalTokens(data.normalTokens);
      if (data.specialTokens !== undefined)
        setSpecialTokens(data.specialTokens);
      setRole(data.role?.toLowerCase() || "user");
    } catch (e) {
      console.error("Failed to refresh tokens", e);
    }
  };

  useEffect(() => {
    const saveAndFetchUser = async () => {
      if (!isLoaded || !clerkUser) {
        if (isLoaded) setRoleLoading(false);
        return;
      }
      setRoleLoading(true);

      try {
        const email =
          clerkUser.primaryEmailAddress?.emailAddress ||
          clerkUser.emailAddresses[0]?.emailAddress;

        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: clerkUser.id, email }),
        });

        const roleResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${clerkUser.id}`
        );
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          setRole(roleData.role?.toLowerCase() || "user");
          setNormalTokens(
            roleData.normalTokens !== undefined ? roleData.normalTokens : 3
          );
          setSpecialTokens(
            roleData.specialTokens !== undefined ? roleData.specialTokens : 3
          );
        } else {
          setRole("user");
          setNormalTokens(3);
          setSpecialTokens(3);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setRoleLoading(false);
      }
    };

    saveAndFetchUser();
  }, [clerkUser, isLoaded]);

  return (
    <UserContext.Provider
      value={{
        role,
        normalTokens,
        specialTokens,
        roleLoading,
        fetchUserTokens,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
