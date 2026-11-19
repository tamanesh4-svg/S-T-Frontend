import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://school-management-node-backend.onrender.com";

const AddClass = () => {
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("teacherToken");

    if (!token) {
      navigate("/teacher/login");
      return;
    }

    setLoading(true);
    setClassCode("");

    try {
      const response = await fetch(
        `${API_URL}/api/teacher/create-class`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ className }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("teacherToken");
        sessionStorage.removeItem("teacher");
        navigate("/teacher/login");
        return;
      }

      if (!response.ok) {
        alert(data.message || "Failed to create class");
        return;
      }

      setClassCode(data.classCode);
      setClassName("");
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Create Class
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Class Name
          </label>

          <input
            type="text"
            placeholder="e.g. CSE-A"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Class"}
        </button>
      </form>

      {classCode && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="text-green-700 font-semibold">
            Class Created Successfully 🎉
          </p>

          <p className="mt-2">
            Share this code with students:
          </p>

          <div className="mt-2 text-xl font-bold text-blue-700">
            {classCode}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClass;