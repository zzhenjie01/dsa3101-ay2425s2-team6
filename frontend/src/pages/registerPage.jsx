import { useForm } from "react-hook-form";
import { useState } from "react";
import "./registerPage.css";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    console.log("RegisterSubmit called");
    e.preventDefault();
    const { name, email, password, cpassword } = data;
    try {
      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
        cpassword,
      });
      if (data.error) {
        for (e in data.error) {
          toast.error(data.error[e]);
        }
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
          {/* Name text*/}
          <div className="input-container">
            <label className="field-label" htmlFor="name">
              Name
            </label>
            {errors.name && (
              <span style={{ color: "red" }}> {errors.name.message} </span>
            )}
          </div>
          {/* Name input */}
          <input
            className="input-field"
            placeholder="Enter Name"
            type="name"
            name="name"
            autoComplete="off"
            value={data.name}
            // {...register("data.name", { required: "*Name* is required" })}
            onChange={onChange}
          />
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
            name="email"
            autoComplete="off"
            value={data.email}
            // {...register("data.email", { required: "*Email* is required" })}
            onChange={onChange}
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
          <div className="input-field">
            <input
              id="password"
              className="input-field-text"
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="off"
              value={data.password}
              // {...register("data.password", {
              //   required: "*Password* is required",
              // })}
              onChange={onChange}
            />
            <button
              type="button"
              className="input-field-password-toggle"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

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
          <div className="input-field">
            <input
              id="cpassword"
              className="input-field-text"
              placeholder="Re-enter Password"
              type={showConfirmPassword ? "text" : "password"}
              name="cpassword"
              autoComplete="off"
              data={data.cpassword}
              onChange={onChange}
              // {...register("cpassword", {
              //   required: "*Confirm Password* is required",
              //   validate: validatePasswordMatch,
              // })}
            />
            <button
              type="button"
              className="input-field-password-toggle"
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

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
