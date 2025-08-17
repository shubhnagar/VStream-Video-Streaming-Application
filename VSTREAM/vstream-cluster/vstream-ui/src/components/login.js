import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoginUrl, getRegisterUrl, getUsernameUrl } from "../http/UserServiceUrls"; 

function LoginSignup() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    dob: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      username: "",
      password: "",
      name: "",
      dob: "",
      email: "",
    });
    setErrors({});
  }, [isLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (isLogin) {
      if (!formData.username.trim())
        newErrors.username = "Username is required";
      if (!formData.password) newErrors.password = "Password is required";
    } else {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.dob) newErrors.dob = "Date of Birth is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.email.includes("@"))
        newErrors.email = "Invalid email format";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      if (isLogin) {
        // Login API call
        try {
          const response = await fetch(getLoginUrl(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Login failed");
          }
  
          const data = await response.json();
          console.log("Login successful:", data);
          alert("Login successful!");
          // Optionally store the token in localStorage/sessionStorage
          localStorage.setItem("authToken", data.access_token);
          console.log("Login form submitted:", {
            username: formData.username,
            password: formData.password,
          });
          navigate("/user");
        } catch (error) {
          console.error("Login error:", error.message);
          alert("Login failed: " + error.message);
        }
      } else {
        // Register API call
        try {
          const response = await fetch(getRegisterUrl(), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              dob: formData.dob, // Use the formatted DOB
              email: formData.email,
              password: formData.password,
            }),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Registration failed");
          }
  
          const data = await response.json();
          console.log("Registration successful:", data);
          alert("Registration successful! Please login.");
          setIsLogin(true); // Switch to login mode after successful signup
        } catch (error) {
          console.error("Registration error:", error.message);
          alert("Registration failed: " + error.message);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} autoComplete="off">
          {!isLogin && (
            <>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  autoComplete="new-name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="dob"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  placeholder="1990-01-01"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  autoComplete="new-dob"
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="johndoe@gmail.com"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  autoComplete="new-email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </>
          )}
          {isLogin && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="johndoe"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                autoComplete="new-username"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
          )}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="*******"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline ml-1"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;