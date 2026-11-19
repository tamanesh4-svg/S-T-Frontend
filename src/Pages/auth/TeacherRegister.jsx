import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const TeacherRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    teacherId: "",
    phone: "",
    password: "",
    subject: "",        // optional but useful
    qualification: ""   // optional
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://school-management-node-backend.onrender.com/api/teacher/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Teacher registration successful. Please login.");
      navigate("/teacher/login");

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
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Teacher Register
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          name="teacherId"
          placeholder="Teacher ID"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          name="subject"
          placeholder="Subject (Optional)"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          name="qualification"
          placeholder="Qualification (Optional)"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/teacher/login" className="text-blue-700 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default TeacherRegister;