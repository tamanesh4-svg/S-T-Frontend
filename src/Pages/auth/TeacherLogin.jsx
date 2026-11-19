import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const TeacherLogin = () => {
  const navigate = useNavigate();

  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://school-management-node-backend.onrender.com/api/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ teacherId, password })
      });

      const data = await res.json();

      console.log("TEACHER LOGIN RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Clear student session
      sessionStorage.removeItem("student");
      sessionStorage.removeItem("token");

      // Save teacher session
      sessionStorage.setItem("teacherToken", data.token);
      sessionStorage.setItem("teacher", JSON.stringify(data.teacher));
      sessionStorage.setItem("activeRole", "teacher");

      // Route after login
      navigate("/teacher/home");

    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF3FF] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Teacher Login
        </h2>

        <input
          type="text"
          placeholder="Teacher ID"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/teacher/register" className="text-blue-700 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default TeacherLogin;