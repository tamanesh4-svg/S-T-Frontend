// pages/StudentRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const StudentRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    roll: "",
    classId: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://school-management-node-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful. Please login.");
      navigate("/");

    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF3FF] px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Student Register
        </h2>

        <input name="name" placeholder="Full Name" onChange={handleChange}
          className="w-full mb-4 p-2 border rounded" required />

        <input name="roll" placeholder="Roll Number" onChange={handleChange}
          className="w-full mb-4 p-2 border rounded" required />

        <input name="classId" placeholder="Class ID" onChange={handleChange}
          className="w-full mb-4 p-2 border rounded" required />

        <input name="phone" placeholder="Phone Number" onChange={handleChange}
          className="w-full mb-4 p-2 border rounded" required />

        <input name="password" type="password" placeholder="Password" onChange={handleChange}
          className="w-full mb-6 p-2 border rounded" required />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-green-700 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default StudentRegister;