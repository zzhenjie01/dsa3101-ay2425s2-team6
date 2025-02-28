import { useForm } from "react-hook-form";
import "./registerPage.css";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    if (data.email === "superadmin@nus") {
      navigate("/home");
    }
  };

  const handleBack = () => {
    // Example: Navigate to a guest-access page or set a guest user state
    console.log("Guest login triggered");
    navigate("/login-page"); // Use React Router's navigate function
  };

  return (
    <>
      <div className="background"></div>

      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Label + Error message */}
          <div className="input-container">
            <label className="field-label" htmlFor="email">
              Email
            </label>
            {errors.email && (
              <span style={{ color: "red" }}> *Email* is mandatory </span>
            )}
          </div>
          <input
            className="input-field"
            type="email"
            {...register("email", { required: true })}
          />

          {/* Label + (To do) Error message */}
          <div className="input-container">
            <label className="field-label" htmlFor="password">
              Password
            </label>
            {errors.password && (
              <span style={{ color: "red" }}> *Password* is mandatory </span>
            )}
          </div>
          <input
            className="input-field"
            type="password"
            {...register("password", { required: true })}
          />

          <div className="input-container">
            <label className="field-label" htmlFor="password">
              Retype Password
            </label>
            {errors.password && (
              <span style={{ color: "red" }}> *Password* is mandatory </span>
            )}
          </div>
          <input
            className="input-field"
            type="password"
            {...register("password", { required: true })}
          />

          <input
            className="form-button-reg"
            type={"submit"}
            value="Create Account"
          />

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
