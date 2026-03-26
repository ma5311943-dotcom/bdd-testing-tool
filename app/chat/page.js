"use client";

import ChatPage from "@/components/special/ChatPage";
import { useUserContext } from "@/components/layout/UserContext";

export default function ChatMainPage() {
  const { role } = useUserContext();

  return (
    <div className="container">
      <ChatPage role={role} />
    </div>
  );
}
