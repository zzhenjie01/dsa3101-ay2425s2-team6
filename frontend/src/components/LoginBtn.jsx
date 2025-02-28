import { Link } from "react-router-dom";

export default function LoginBtn() {
  return (
    <Link
      key="login-page"
      to="/login-page"
      className="
        absolute top-4 right-4
        px-4 py-2
        bg-blue-500 hover:bg-blue-600
        text-white font-semibold
        rounded-lg shadow-md
        transition duration-300 ease-in-out
        transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      "
    >
      Login
    </Link>
  );
}
