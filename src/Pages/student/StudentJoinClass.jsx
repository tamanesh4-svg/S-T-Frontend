import { useState } from "react";

const StudentJoinClass = () => {
  const [classCode, setClassCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!classCode.trim()) {
      alert("Class code is required");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      const token = sessionStorage.getItem("token"); // ✅ add auth token
      const res = await fetch("https://school-management-node-backend.onrender.com/api/classes/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send token
        },
        body: JSON.stringify({ classCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join class");
      setMessage("Successfully joined the class ✅");
      setClassCode("");
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Join Class</h1>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Enter Class Code
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="e.g. ABC123"
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={handleJoin}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Join
          </button>
        </div>
      </div>
      {loading && <p className="text-center text-gray-600">Joining class...</p>}
      {message && (
        <div className="mt-4 text-center font-medium text-green-700">
          {message}
        </div>
      )}
    </div>
  );
};

export default StudentJoinClass; // ✅ THIS LINE — no curly braces