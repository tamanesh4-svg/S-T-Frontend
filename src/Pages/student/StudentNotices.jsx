import { useEffect, useState } from "react";

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH NOTICES
  // ===============================
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("https://school-management-node-backend.onrender.com/api/notices");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load notices");
        setNotices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alert("Failed to load notices");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Notices
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600">Loading notices...</p>
      )}

      {/* No Notices */}
      {!loading && notices.length === 0 && (
        <p className="text-center text-gray-500">
          No notices available
        </p>
      )}

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice._id || notice.id}
            className="border border-green-100 bg-green-50 rounded-xl p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-green-800">
              {notice.title}
            </h2>

            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {notice.message}
            </p>

            <div className="mt-3 text-xs text-gray-500">
              <span>Published: </span>
              {new Date(notice.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentNotices;