import { useContext } from "react";
import { UserContext } from "@/context/context";

export default function HomePage() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex-grow pt-20 text-center">
      <h1>Welcome to our Website! </h1>
      {!!user && <h2>Hi {user.email}!</h2>}
      <p>Keep an eye out for updates in the future! :D</p>
    </div>
  );
}
