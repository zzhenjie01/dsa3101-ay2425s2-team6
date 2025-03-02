import { useForm } from "react-hook-form";
import "./registerPage.css";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import { doRegister } from "../auth/authService.js"; // Import the register service

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  // const onSubmit = (data) => {
  //   console.log(data);
  //   if (data.email === "superadmin@nus") {
  //     navigate("/home");
  //   }
  // };

  // const onSubmit = async (data, e) => {
  //   // e.preventDefault();
  //   try {
  //     console.log(data);
  //     await axios.post("http://localhost:5000/api/register", data);
  //     alert("User registered successfully");
  //     navigate("/login-page");
  //   } catch (error) {
  //     console.error("Registration error:", error.response); // Log the error response
  //     alert(
  //       `Error registering user: ${
  //         error.response?.data?.details || "Unknown error"
  //       }`
  //     ); // Show specific error
  //   }
  // };

  const onSubmit = async (data, e) => {
    console.log(data);
    try {
      const result = await doRegister(data.email, data.password); // Call the register service
      if (result.success) {
        alert("User registered successfully");
        navigate("/login-page");
      } else {
        console.error("Registration error:", result);
        alert(`Error registering user: ${result.details || result.message}`);
      }
    } catch (error) {
      console.error("Frontend registration error:", error);
      alert("An unexpected error occurred");
    }
  };

  const handleBack = () => {
    // Example: Navigate to a guest-access page or set a guest user state
    console.log("Back to Login triggered");
    navigate("/login-page"); // Use React Router's navigate function
  };

  // For validating password and confirm password
  const validatePasswordMatch = (value) => {
    const password = watch("password");
    return password === value ? "" : "Passwords do not match";
  };

  return (
    <>
      <div className="background" />

      <div className="register-container">
        <form
          className="register-form"
          onSubmit={(e) => {
            console.log("handleSubmit called");
            handleSubmit(onSubmit)(e);
          }}
        >
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
            type="email"
            {...register("email", { required: "*Email* is required" })}
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
            type="password"
            {...register("password", { required: "*Password* is required" })}
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
            type="password"
            {...register("cpassword", {
              required: "*Confirm Password* is required",
              validate: validatePasswordMatch,
            })}
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
