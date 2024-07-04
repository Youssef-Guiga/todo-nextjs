"use client"; //client side not server side
import { useState } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const [message, setMessage] = useState(null);

  const login = async (event) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.target); //tcollecti e data mel form
    const jsonData = Object.fromEntries(formData); //trodha js object
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    };

    const req = await fetch(
      "https://bright-balance-9d6165fe4f.strapiapp.com/api/auth/local",
      reqOptions
    );
    const res = await req.json();

    if (res.error) {
      setMessage(res.error.message);
      return;
    }

    if (res.jwt && res.user) {
      //check ken fiha token e response welle le
      Cookies.set("token", res.jwt);
      setMessage("Login successful.");
      window.location.href = "/todos";
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          "url(https://cdn.dribbble.com/userupload/13624455/file/still-18c2554c70e71dc71b9619bb19387f4d.gif?resize=400x0)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg bg-opacity-90">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form onSubmit={login} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Username/Email
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-transparent"
                placeholder="Username/Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-transparent"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Register
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        {message && (
          <div className="mt-4 text-center text-red-500">{message}</div>
        )}
      </div>
    </div>
  );
}
