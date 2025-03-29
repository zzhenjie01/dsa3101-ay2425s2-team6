import { UserContext } from "./context.js";
import { useState, useEffect } from "react";
import axios from "axios";
import guestProfile from "./guestProfile.js";
import { LoadingSpinner } from "@/components/ui/loading-spinner.jsx";

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(guestProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/auth/getProfile", {
          signal: abortController.signal,
        });

        // set user as the response's data
        setUser(response.data.profile);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled.");
        } else {
          // If user profile cannot be fetched, we will just set user as guestprofile
          console.error("Error fetching user profile:", error);
          setUser(guestProfile);
        }
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000); // loading screen will be fetch data time + 1s
      }
    };

    fetchUserProfile();

    return () => {
      abortController.abort();
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
