import { useForm } from "react-hook-form";
import { useState } from "react";
import "./registerPage.css";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  const navigate = useNavigate();

  // const onSubmit = (data) => {
  //   console.log(data);
  //   if (data.email === "superadmin@nus") {
  //     navigate("/home");
  //   }
  // };

  const onSubmit = async (e) => {
    console.log("RegisterSubmit called");
    e.preventDefault();
    const { email, password, cpassword } = data;
    try {
      const { data } = await axios.post("/auth/register", {
        email,
        password,
        cpassword,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("User Registered Successfully!");
        toast.success("Redirecting to Login Page");
        navigate("/login-page");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unknown Error Occurred. Please try again.");
    }
  };

  const handleBack = () => {
    // Example: Navigate to a guest-access page or set a guest user state
    console.log("Back to Login triggered");
    navigate("/login-page"); // Use React Router's navigate function
  };

  // For validating password and confirm password
  // const validatePasswordMatch = (value) => {
  //   const password = watch("password");
  //   return password === value ? "" : "Passwords do not match";
  // };

  return (
    <>
      <div className="background" />

      <div className="register-container">
        <form className="register-form" onSubmit={onSubmit}>
          {/* Email text*/}
          <div className="input-container">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            {errors.email && (
              <span style={{ color: "red" }}> {errors.email.message} </span>
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
              <span style={{ color: "red" }}> {errors.password.message} </span>
            )}
          </div>

          {/* Password input */}
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

          {/* Confirm Password text */}
          <div className="input-container">
            <label className="field-label" htmlFor="cpassword">
              Confirm Password
            </label>
            {errors.cpassword && (
              <span style={{ color: "red" }}>{errors.cpassword.message}</span>
            )}
          </div>

          {/* Confirm Password input */}
          <input
            id="cpassword"
            className="input-field"
            placeholder="Re-enter Password"
            type="password"
            autoComplete="off"
            data={data.cpassword}
            onChange={(e) => setData({ ...data, cpassword: e.target.value })}
            // {...register("cpassword", {
            //   required: "*Confirm Password* is required",
            //   validate: validatePasswordMatch,
            // })}
          />

          {/*Submit button*/}
          <input
            className="form-button-reg"
            type={"submit"}
            value="Create Account"
          />
          {/* <button type="submit" className="form-button-reg">
            {" "}
            Create Account{" "}
          </button> */}

          <button type="button" className="guest-button" onClick={handleBack}>
            {" "}
            Back to Login{" "}
          </button>
        </form>

        <Outlet />
      </div>
    </>
  );
}
