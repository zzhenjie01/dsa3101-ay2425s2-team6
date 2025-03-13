import { useContext } from "react";
import { UserContext } from "@/context/context";

export default function WelcomeMsg() {
  const { user } = useContext(UserContext);

  return (
    <p
      className="absolute top-6
      right-[calc(6rem+8px)] 
      text-gray-800 
      font-medium"
    >
      Hello, {user.name}
    </p>
  );
}
