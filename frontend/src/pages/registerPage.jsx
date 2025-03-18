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

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
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
          setNameError(false);
          setEmailError(false);
          setPasswordError(false);
        for (e in data.error) {
          toast.error(data.error[e]);
          if (data.error[e].includes("Name"))  setNameError(true) ;
          if (data.error[e].includes("Email")) setEmailError(true);
          if (data.error[e].includes("Password")) setPasswordError(true);
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





    // Tailwind declarations
    const inputFieldClass = "bg-[rgba(210,210,210,0.6)] mb-2 w-full max-h-12 min-h-10 flex-2 rounded px-1";
    const labelClass = "block text-[17px] font-[\'Century Gothic\'] text-[rgba(0,0,0,0.7)] mb-0.5 w-full flex-1";
    const errorClass = "bg-[rgba(220,120,120,0.4)] mb-2 w-full max-h-12 min-h-10 flex-2 rounded px-1";

  return (
      <>
          <div className="absolute top-0 left-0 h-[calc(100vh-40px)] 
                            w-screen bg-[url(../assets/loginbackground.jpg)]
                            bg-cover bg-center bg-no-repeat z-[-1]"/>

          <div className="absolute top-1/2 left-25 
                            transform -translate-y-1/2 w-[min(30%,320px)]
                            h-[max(60%,350px)] flex justify-center items-center
                            bg-cover bg-center border-2 border-[rgba(105,29,4,0.5)]
                            border-t-[20px] border-t-[rgba(105,29,4,0.5)]">
              <form className="flex flex-col items-stretch w-full h-full 
                                bg-[rgba(256,256,256,0.8)] p-8 pt-4"
                  onSubmit={onSubmit}>
                  <div className="flex justify-between relative">
                      <label className={labelClass} htmlFor="name">
                          Name
                      </label>
                      {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                  </div>
                  <input className={`${nameError ? errorClass : inputFieldClass}`} placeholder="Enter Name" type="name" name="name" autoComplete="off" value={data.name} onChange={onChange} />

                  <div className="flex justify-between relative">
                      <label className={labelClass} htmlFor="email">
                          Email
                      </label>
                      {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                  </div>
                  <input className={`${emailError ? errorClass : inputFieldClass}`} placeholder="Enter Email" type="email" name="email" autoComplete="off" value={data.email} onChange={onChange} />

                  <div className="flex justify-between relative">
                      <label className={labelClass} htmlFor="password">
                          Password
                      </label>
                      {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                  </div>
                  <div className="relative w-full flex items-center">
                      <input className={`${passwordError ? errorClass : inputFieldClass}`} placeholder="Enter Password" type={showPassword ? "text" : "password"} name="password" autoComplete="off" value={data.password} onChange={onChange} />
                      <button type="button" className="absolute right-2" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                  </div>

                  <div className="flex justify-between relative">
                      <label className={labelClass} htmlFor="cpassword">
                          Confirm Password
                      </label>
                      {errors.cpassword && <span className="text-red-500 text-xs">{errors.cpassword.message}</span>}
                  </div>
                  <div className="relative w-full flex items-center">
                      <input className={`${passwordError ? errorClass : inputFieldClass}`} placeholder="Re-enter Password" type={showConfirmPassword ? "text" : "password"} name="cpassword" autoComplete="off" value={data.cpassword} onChange={onChange} />
                      <button type="button" className="absolute right-2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                      </button>
                  </div>

                  <input className="bg-[rgba(105,29,4,0.3)] h-[15%] text-[20px] 
                                        font-semibold text-black text-opacity-60 rounded
                                        mb-5 mt-5 cursor-pointer hover:bg-[rgba(105,29,4,0.4)]"
                      type="submit" value="Create Account" />

                  <button type="button" className="bg-white bg-opacity-60 border 
                                                    border-[rgba(0,0,0,0.3)] rounded
                                                    text-[rgba(0,0,0,0.5)] font-semibold cursor-pointer
                                                    hover:border-[rgba(0,0,0,0.8)] hover:text-[rgba(0,0,0,0.9)]"
                      onClick={handleBack}>
                      Back to Login
                  </button>
              </form>
              <Outlet />
          </div>
      </>
  );
}
