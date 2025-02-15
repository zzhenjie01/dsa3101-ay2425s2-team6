import { useForm } from "react-hook-form";
import "./loginPage.css";
import { Outlet } from "react-router";

/*
Div centered on the login page
*/
export default function LoginCredentialsDiv()
{
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data    => console.log(data);
    return (
        <div className="
            absolute top-1/2 left-1/2 -translate-1/2
            border-gray-200 border-2
            h-2/5 w-3/10
            flex justify-center items-center">
            <form className="flex flex-col justify-evenly items-center
                            w-full h-full border-2 border-black"
                            onSubmit={handleSubmit(onSubmit)}>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <span style={{ color: "red" }}>
                    *Email* is mandatory </span>}
                <input type="password" {...register("password")} />
                <input type={"submit"} style={{ backgroundColor: "#a1eafb" }} />
            </form>
            <Outlet/ >
        </div>
    )
};