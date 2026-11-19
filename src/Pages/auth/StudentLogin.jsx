import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const StudentLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://school-management-node-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Clear teacher session
      sessionStorage.removeItem("teacher");
      sessionStorage.removeItem("teacherToken");

      // Save student session
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("student", JSON.stringify(data.student));
      sessionStorage.setItem("activeRole", "student");

      navigate("/student/home");

    } catch (err) {
      console.log("ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF3FF] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Student Login
        </h2>

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/student/register" className="text-green-700 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default StudentLogin;