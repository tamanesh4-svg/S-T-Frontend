import { useState } from "react";

const PublishNotice = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noticeData = { title, message };

    try {
      const response = await fetch("https://school-management-node-backend.onrender.com/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(noticeData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Notice Published Successfully ✅");
      setTitle("");
      setMessage("");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Publish Notice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Notice Title
          </label>
          <input
            type="text"
            placeholder="Enter notice title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Message
          </label>
          <textarea
            rows="5"
            placeholder="Write your notice here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Publish Notice
        </button>

      </form>
    </div>
  );
};

export default PublishNotice;