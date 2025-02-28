import Routes from "./Routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatbotDiv from "./components/ChatbotToggle";
import { BrowserRouter } from "react-router-dom";

/*
This folder provides the Outlet component for the react router.
*/

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes />
      <ChatbotDiv />
      <Footer />
    </BrowserRouter>
  );
}
