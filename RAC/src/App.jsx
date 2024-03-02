import { Routes, Route, useLocation,  } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import SignUpForm from "./pages/Signup";
import SignInForm from "./pages/Inventory";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SeeInventory from "./pages/seeInventory";
import Error from "./pages/Error";
import Footer from "./components/Footer/Footer";

function App() {
  const location = useLocation();

  // List of routes where Footer should be hidden
  const routesWithoutFooter = ["/dashboard", "/see"];

  // Check if the current route matches any route from the list
  const shouldHideFooter = routesWithoutFooter.some((route) =>
  location.pathname.startsWith(route)
);

  return (
    <>
      {!shouldHideFooter && <Navbar />}
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/see" element={<SeeInventory />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
}

export default App;
