import Routes from "./Routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatbotState from "./components/chatbotState";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import UserContextProvider from "./context/contextFunction";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

/*
This folder provides the Outlet component for the react router.
*/

export default function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Header />
        <Routes />
        <Footer />
        <Toaster position="bottom-left" toastOptions={{ duration: 4000 }} />
        <ChatbotState />
      </UserContextProvider>
    </BrowserRouter>
  );
}
