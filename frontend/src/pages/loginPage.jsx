import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import "./loginPage.css";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "@/context/context.js";

/*
Div centered on the login page
*/
export default function LoginCredentialsDiv() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    console.log("LoginSubmit called");
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("/auth/login", {
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Successfully logged in! Welcome!");
        setUser(data);
        setData({});
        navigate("/home");
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Unknown Error Occurred. Please try again.");
    }
  };

  const handleGuestLogin = () => {
    // Example: Navigate to a guest-access page or set a guest user state
    console.log("Guest login triggered");
    navigate("/home"); // Use React Router's navigate function
  };

  return (
    <>
      <div className="background"></div>
      <div className="login-container">
        <form className="login-form" onSubmit={onSubmit}>
          {/* Email text */}
          <div className="input-container">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            {errors.email && (
              <span style={{ color: "red" }}> *Email* is mandatory </span>
            )}
          </div>

          {/* Email input */}
          <input
            className="input-field"
            placeholder="Enter Email"
            type="email"
            autoComplete="off"
            value={data.email}
            // {...register("data.email", { required: "*Email* is required" })}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          {/* Password text */}
          <div className="input-container">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            {errors.password && (
              <span style={{ color: "red" }}> *Password* is mandatory </span>
            )}
          </div>

          {/* {Password input} */}
          <input
            id="password"
            className="input-field"
            placeholder="Enter Password"
            type="password"
            autoComplete="off"
            value={data.password}
            // {...register("data.password", {
            //   required: "*Password* is required",
            // })}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />

          <input className="form-button" type={"submit"} value="Log In" />

          <button
            type="button"
            className="guest-button"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </button>

          <div className="register-link">
            <a href="/register-page">New? Register HERE</a>
          </div>
        </form>

        <Outlet />
      </div>
    </>
  );
}
