import { useForm } from "react-hook-form";
import { useState, useContext } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "@/context/context.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/*
Div centered on the login page
*/
export default function LoginCredentialsDiv() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useContext(UserContext);

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
    console.log("LoginSubmit called");
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post("/auth/login", {
        email,
        password,
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
        toast.success(`Successfully logged in. Welcome ${data.name}!`);
        setUser(data);
        setData({});
        navigate("/home");
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

  const inputFieldClass =
    "bg-[rgba(210,210,210,0.5)] w-full max-h-12 min-h-12 flex-2 rounded px-1 text-[16px]";
  const labelClass =
    "block text-[18px] font-['Century Gothic'] text-[rgba(0,0,0,0.7)] mb-0.5 w-full pt-1 flex-1";
  const errorClass =
    "bg-[rgba(210,210,210,0.6)] border-solid border-2 border-red-400 w-full max-h-12 min-h-12 flex-2 rounded px-1 text-[16px]";

  return (
    <>
      <div
        className="absolute top-0 left-0 h-[calc(100vh-40px)] 
                            w-screen bg-[url(../assets/loginbackground.jpg)]
                            bg-cover bg-center bg-no-repeat z-[-1]"
      />

      <div
        className="absolute top-1/2 left-25 
                            transform -translate-y-1/2 w-[min(30%,320px)]
                            h-[max(50%,350px)] flex justify-center items-center
                            bg-cover bg-center border-2 border-[rgba(39,170,81,0.8)]
                            border-t-[20px] border-t-[rgba(39,170,81,0.8)]"
      >
        <form
          className="flex flex-col items-stretch w-full h-full 
                                bg-[rgba(256,256,256,0.85)] p-8 pt-4"
          onSubmit={onSubmit}
        >
          {/* Email Header */}
          <div className="flex flex-row justify-between">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
          </div>

          {/* Email Input */}
          <input
            className={`${inputErrors.email ? errorClass : inputFieldClass}`}
            placeholder="Enter Email"
            type="email"
            autoComplete="off"
            name="email"
            value={data.email}
            onChange={onChange}
          />

          {/* Password Header */}
          <div className="flex flex-row justify-between">
            <label className={labelClass} htmlFor="password">
              Password
            </label>
          </div>

          {/* Password Input */}
          <div className="relative w-full flex items-center">
            <input
              id="password"
              className={`${
                inputErrors.password ? errorClass : inputFieldClass
              }`}
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="off"
              value={data.password}
              onChange={onChange}
            />
            <button
              type="button"
              className="absolute right-2 align-middle hover:cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <input
            className="bg-[rgb(0,140,0,0.5)] text-white font-bold text-[22px] 
                                    py-2 rounded-md mb-5 mt-5 cursor-pointer
                                    hover:bg-[rgb(0,140,0,0.8)]"
            type={"submit"}
            value="Log In"
          />

          <button
            type="button"
            className="bg-[rgba(256,256,256,0.5)] font-semibold border-2 
                                    border-gray-400 text-gray-500 rounded-md py-2 
                                    cursor-pointer hover:border-gray-600 
                                    hover:text-gray-800 hover:bg-[rgba(256,256,256,0.8)]"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </button>

          <div className="mt-auto">
            <a
              href="/register-page"
              className="text-gray-600 hover:text-black hover:underline"
            >
              New? Register HERE
            </a>
          </div>
        </form>

        <Outlet />
      </div>
    </>
  );
}
