import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [logIn, setLogIn] = useState(false);

  useEffect(() => {
    if (cookies.id) {
      setLogIn(true);
    }


   
  }, []);

  function mobMenu() {
    setIsOpen((prev) => !prev);
  }

  return (
    <nav className="bg-white py-4 flex justify-between px-12 h-[11vh] lg:h-[12vh] border-b border z-[100000]">
      <div>
        <a href="/">
          <img src="RAC_logo.png" alt="Logo" width="100" height="100" />
        </a>
      </div>
      <div
        className="absolute gap-12 items-center bg-yellow-100 flex flex-col top-0 w-full h-full justify-center text-4xl duration-500 lg:duration-0 lg:static lg:flex lg:flex-row lg:bg-transparent lg:text-xl lg:justify-end z-[100000]"
        style={{
          right: isOpen ? "0px" : "-100%",
        }}
      >
        <Link to="/" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>
          About
        </Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>
          Contact
        </Link>
        {logIn ? (
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
            Dashboard
          </Link>
        ) : (
          <Link to="/signup" onClick={() => setIsOpen(false)}>
            Signup
          </Link>
        )}
      </div>

      <button
        className="absolute lg:hidden top-5 right-8 z-[1000000000]"
        onClick={mobMenu}
      >
        <img src="/mobMenu.svg" alt="" className="w-8" />
      </button>
    </nav>
  );
};

export default Navbar;
