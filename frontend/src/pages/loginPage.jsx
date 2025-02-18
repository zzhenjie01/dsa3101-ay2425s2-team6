import { useForm } from "react-hook-form";
import "./loginPage.css";
import { Outlet } from "react-router";
import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/*
Div centered on the login page
*/
export default function LoginCredentialsDiv()
{
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();


    // Placeholder check
    const onSubmit = data => {
        console.log(data);
        if (data.email === "superadmin@nus") {
            navigate("/home");
        }
    }


    // Check if login to display image at backgound
    useEffect(() => {
        // Check if at login
        if (location.pathname === '/') {
            document.body.classList.add('login-page');
        } else {
            document.body.classList.remove('login-page');
        }

        // Cleanup
        return () => {
            document.body.classList.remove('login-page');
        };
    }, [location.pathname]);

    return (
        <div className="login-container">

            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <label className="login-header">ESG Report</label>

                {/* Label + Error message */}
                <div className="input-container">
                    <label className="field-label" htmlFor="email">Email</label>
                    {errors.email && <span style={{ color: "red" }}> *Email* is mandatory </span>}
                </div>
                <input className="input-field" type="email" {...register("email", { required: true })} />


                {/* Label + (To do) Error message */}
                <div className="input-container">
                    <label className="field-label" htmlFor="password">Password</label>
                </div>
                <input className="input-field" type="password" {...register("password")} />
                <input className="form-button" type={"submit"} />
            </form>
            <Outlet />
        </div>
    )
};