// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const instance = axios.create({
//   baseURL: "http://localhost:3000/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /*
// submits user and password path to backend
// and redirects user to home page if credentials are correct
// */
// const login = async (username, password, serverPaths) => {
//   const response = await instance.post(serverPaths.LOGIN_PATH, {
//     username,
//     password,
//   });
//   switch (response.status) {
//     // login successful
//     case 200:
//     //
//     case 400:
//   }
//   if (response.status === 200) {
//     navigate("home/:userId");
//   } else {
//     console.log("");
//   }
// };

// /*
// submits user and password to the register path on backend
// and redirects user to home page if credentials are correct
// */
// const register = async (username, password, serverPaths) => {
//   const response = await instance.post(serverPaths.REGISTER_PATH, {
//     username,
//     password,
//   });
//   if (response.status === 200) {
//     navigate("/home/:userId");
//   }
// };

// const handleLogin = (clientPaths) => {};

import axios from "axios";
import clientPaths from "./path.js"; // Assuming you still need the paths

const baseURL = "http://localhost:5000/api";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Registration service
const doRegister = async (email, password) => {
  try {
    const response = await instance.post(clientPaths.REGISTER_PATH, {
      email,
      password,
    });

    if (response.status === 201) {
      // Use 201 for successful registration
      return { success: true, message: "User registered successfully" };
    } else {
      // Handle other success status codes if needed
      console.warn("Unexpected status code:", response.status);
      return {
        success: false,
        message: "Registration failed",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Registration error:", error.response || error); // Log the full error
    return {
      success: false,
      message: "Registration failed",
      details:
        error.response?.data?.details || error.message || "Unknown error", // Extract error details
    };
  }
};

// Login service
const doLogin = async (email, password) => {
  try {
    const response = await instance.post(clientPaths.LOGIN_PATH, {
      email,
      password,
    });

    if (response.status === 200) {
      return { success: true, token: response.data.token }; // Return the token on success
    } else {
      // Handle other success status codes if needed
      console.warn("Unexpected status code:", response.status);
      return {
        success: false,
        message: "Login failed",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Login error:", error.response || error);
    return {
      success: false,
      message: "Login failed",
      details: error.response?.data?.error || error.message || "Unknown error", // Extract error details
    };
  }
};

export { doRegister, doLogin }; // Export the functions
