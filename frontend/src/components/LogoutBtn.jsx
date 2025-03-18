import { useContext } from "react";
import { UserContext } from "@/context/context.js";
import { toast } from "react-hot-toast";
import guestProfile from "../../../backend/src/api/models/guestProfile.js";
import axios from "axios";

export default function LogoutBtn() {
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");
      setUser(guestProfile);
      toast.success("User Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      className="
        absolute top-4 right-4
        px-4 py-2
        bg-blue-500 hover:bg-blue-600
        text-white font-semibold
        rounded-lg shadow-md
        transition duration-300 ease-in-out
        transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        cursor-pointer
      "
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
