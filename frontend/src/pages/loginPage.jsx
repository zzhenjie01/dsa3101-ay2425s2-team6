import { useForm } from "react-hook-form";
import "./loginPage.css";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";

/*
Div centered on the login page
*/
export default function LoginCredentialsDiv() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();


  // Placeholder check
  const onSubmit = (data) => {
    console.log(data);
    if (data.email === "superadmin@nus") {
      navigate("/home");
    }
    };

    const handleGuestLogin = () => {
        // Example: Navigate to a guest-access page or set a guest user state
        console.log("Guest login triggered");
        navigate("/dashboard"); // Use React Router's navigate function
    };


    return (
        <>
        
            <div className="background"></div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit(onSubmit)}>

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

                    <input className="form-button" type={"submit"} value="Log In" />

                    <button type="button" className="guest-button" onClick={handleGuestLogin}>Continue as Guest</button>

                    <div className="register-link">
                        <a href="/register-page">New? Register HERE</a>
                    </div>
                    
                </form>
                
                <Outlet />

                
            </div>
        
        </>
        
    
    
  );
}
