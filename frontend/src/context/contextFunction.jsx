import { UserContext } from "./context.js";
import { useState, useEffect } from "react";
import axios from "axios";
import guestProfile from "../../../backend/auth/guestProfile.js";

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(guestProfile);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/auth/getProfile", {
          signal: abortController.signal,
        });

        if (response.data === "Request Cookie not found") {
          // Handle the case where no token is found
          setUser(guestProfile);
        } else {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(guestProfile);
        // If an error occurs, keep the user as the guest profile
      }
    };

    fetchUserProfile();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
