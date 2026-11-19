import { useState } from "react";

const AddClass = () => {
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://school-management-node-backend.onrender.com/api/teacher/create-class", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ className })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setClassCode(data.classCode); // backend sends code
      setClassName("");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md">

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Create Class
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Class Name */}
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
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Class
        </button>

      </form>

      {/* Show class code */}
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