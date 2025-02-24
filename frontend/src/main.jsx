import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";

/*
Entering the root path / from host brings user to the Outlet
which will then redirect the user to <LoginCredentialsDiv/>.

/home redirects users to <DashboardPage/>
*/

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
