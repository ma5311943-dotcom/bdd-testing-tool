"use client";

import AdminDashboard from "@/components/special/AdminDashboard";
import UserDashboard from "@/components/special/UserDashboard";
import { useUserContext } from "@/components/layout/UserContext";

export default function DashboardPage() {
  const { role, roleLoading } = useUserContext();

  if (roleLoading) {
    return (
      <div className="container">
        <div className="loading-state" style={{ marginTop: "4rem" }}>
          <div className="loader-orbit">
            <div className="loader-inner"></div>
          </div>
          <p>Syncing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      {role === "admin" ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}
