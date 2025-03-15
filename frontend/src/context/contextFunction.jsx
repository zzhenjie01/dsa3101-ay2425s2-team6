import { UserContext } from "./context.js";
import { useState, useEffect } from "react";
import axios from "axios";
import guestProfile from "../../../backend/auth/guestProfile.js";

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(guestProfile);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/auth/profile");
        if (response.data === "Request Cookie not found") {
          // Handle the case where no token is found
          setUser(guestProfile);
        } else {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If an error occurs, keep the user as the guest profile
      }
    };
    fetchUserProfile();

    // if (!user) {
    //   axios.get("/auth/profile").then(({ data }) => {
    //     setUser(data);
    //   });
    // }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default {
  UserContextProvider,
};
