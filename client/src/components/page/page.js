import React from "react";
import { useAuth } from "../hooks/auth.hook";

const Page = () => {
  const { login, logout, token, userId } = useAuth();
  return (
    <div>
      You are in the system <button onClick={logout}>Exit</button>
    </div>
  );
};

export default Page;
