import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const schema = z.object({
  userID: z.string().nonempty("UserID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const [cookie, setCookie, removeCookie] = useCookies();

  const navigate = useNavigate();

  const onSubmitForm = async (data) => {
    const userID = data.userID.trim();
    const password = data.password;

    console.log(userID, password);

    const loginResponse = await axios.post(
      "http://localhost:5001/users/signin",
      {
        userID,
        password,
      },
      {
        withCredentials: true,
      }
    );
    const loginResult = loginResponse.data;
    setCookie("id", loginResult.data.user.userID, {
      path: "/",
      domain: "localhost",
    });
    console.log(loginResult.data.user._id);
    console.log(loginResult.message);

    if (loginResult.message === "success") {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div>
      <form
        className="py-6 px-4 md:px-8 font-typo max-w-md mx-auto bg-yellow-100 shadow-md rounded-md"
        noValidate
        onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">
            UserID
          </label>
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            id="userID"
            type="text"
            {...register("userID")}
            autoComplete="off"
          />

          {errors.userID && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.userID.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-500 text-sm font-semibold">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="mb-6">
          <button
            className="bg-yellow-500 text-white hover:bg-yellow-600 font-bold py-2 px-4 rounded-md text-lg md:text-xl transition duration-300"
            type="submit"
          >
            Login
          </button>
        </div>

        <div>
          <p className="text-gray-800 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => {
                navigate("/signup", { replace: true });
              }}
              className="text-blue-500 underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
