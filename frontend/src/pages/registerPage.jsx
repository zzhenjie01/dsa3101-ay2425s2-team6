import { useForm } from "react-hook-form";
import { useState } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegistrationPage() {
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [inputErrors, setInputErrors] = useState({
    name: false,
    email: false,
    password: false,
    cpassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setInputErrors({
      ...inputErrors,
      [e.target.name]: false,
    });

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("RegisterSubmit called");

    const { name, email, password, cpassword } = data;
    try {
      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
        cpassword,
      });

      if (data.error) {
        // Change input errors
        const newInputErrors = {};
        for (const e of data.errorFields) {
          newInputErrors[e] = true;
        }
        setInputErrors((prevErrors) => ({ ...prevErrors, ...newInputErrors }));

        // Toast notifications for errors
        for (e of data.error) {
          toast.error(e);
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

  // Tailwind declarations
  const inputFieldClass =
    "bg-[rgba(210,210,210,0.6)] w-full flex-2 rounded px-1 text-[16px]";
  const labelClass =
    "block text-[18px] font-['Century Gothic'] text-[rgba(0,0,0,0.7)] mb-0.5 w-full pt-1 flex-1";
  const errorClass =
    "bg-[rgba(210,210,210,0.6)] border-solid border-2 border-red-400 w-full flex-2 rounded px-1 text-[16px]";

  return (
    <>
      <div
        className="absolute top-0 left-0 h-[calc(100vh-40px)] 
                            w-screen bg-[url(@/assets/loginbackground.jpg)]
                            bg-cover bg-center bg-no-repeat z-[-1]"
      />

      <div
        className="absolute top-1/2 left-25 
                            transform -translate-y-1/2 w-[min(30%,320px)]
                            h-[max(65%,410px)] flex justify-center items-center
                            bg-cover bg-center border-2 border-[rgba(105,29,4,0.5)]
                            border-t-[20px] border-t-[rgba(105,29,4,0.5)]"
      >
        <form
          className="items-stretch w-full h-full 
                                bg-[rgba(256,256,256,0.85)] p-8 pt-2"
          onSubmit={onSubmit}
        >
          {/* Name Label */}
          <div className="flex justify-between relative">
            <label className={labelClass} htmlFor="name">
              Name
            </label>
          </div>
          {/* Name Input */}
          <input
            className={`h-[10%] ${
              inputErrors.name ? errorClass : inputFieldClass
            }`}
            placeholder="Enter Name"
            type="name"
            name="name"
            autoComplete="off"
            value={data.name}
            onChange={onChange}
          />

          {/* Email Label */}
          <div className="flex justify-between relative">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            {/* {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )} */}
          </div>

          {/* Email Input */}
          <input
            className={`h-[10%] ${
              inputErrors.email ? errorClass : inputFieldClass
            }`}
            placeholder="Enter Email"
            type="email"
            name="email"
            autoComplete="off"
            value={data.email}
            onChange={onChange}
          />

          {/* Password Label */}
          <div className="h-[10%]justify-between relative">
            <label className={labelClass} htmlFor="password">
              Password
            </label>
          </div>

          {/* Password Input Box */}
          <div className="relative h-[10%] w-full flex items-center">
            {/* Password Input */}
            <input
              className={`h-full ${
                inputErrors.password ? errorClass : inputFieldClass
              }`}
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="off"
              value={data.password}
              onChange={onChange}
            />
            {/* Password Show Toggle */}
            <button
              type="button"
              className="absolute right-2 hover:cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          {/* Confirm Password Label */}
          <div className="flex justify-between relative">
            <label className={labelClass} htmlFor="cpassword">
              Confirm Password
            </label>
            {/* {errors.cpassword && (
              <span className="text-red-500 text-xs">
                {errors.cpassword.message}
              </span>
            )} */}
          </div>

          {/* Confirm Password Input Box */}
          <div className="relative h-[10%] w-full flex items-center">
            {/* Confirm Password Input */}
            <input
              className={`h-full ${
                inputErrors.cpassword ? errorClass : inputFieldClass
              }`}
              placeholder="Re-enter Password"
              type={showConfirmPassword ? "text" : "password"}
              name="cpassword"
              autoComplete="off"
              value={data.cpassword}
              onChange={onChange}
            />
            {/* Confirm Password Show Toggle */}
            <button
              type="button"
              className="absolute right-2 hover:cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <div className="h-[40%] flex flex-col items-center space-y-4 w-full mb-6">
            {/* Register Button */}
            <input
              className="w-full h-[30%] bg-[rgba(105,29,4,0.3)] h-[15%] text-[20px] 
                                        font-semibold text-black text-opacity-60 rounded
                                        mb-2 mt-5 cursor-pointer hover:bg-[rgba(105,29,4,0.4)]"
              type="submit"
              value="Create Account"
            />

            {/* Back to Login Button */}
            <button
              type="button"
              className="h-[20%] w-full bg-white bg-opacity-60 border 
                                                    border-[rgba(0,0,0,0.3)] rounded
                                                    text-[rgba(0,0,0,0.5)] font-semibold cursor-pointer
                                                    hover:border-[rgba(0,0,0,0.8)] hover:text-[rgba(0,0,0,0.9)]"
              onClick={handleBack}
            >
              Back to Login
            </button>
          </div>
        </form>
        <Outlet />
      </div>
    </>
  );
}
