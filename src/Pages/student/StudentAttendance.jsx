import { useEffect, useState } from "react";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // FETCH ATTENDANCE (AUTO)
  // ===============================
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
  "https://school-management-node-backend.onrender.com/api/attendance/me",
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  }
);

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch attendance");
          return;
        }

        setAttendance(data);
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // ===============================
  // CALCULATIONS
  // ===============================
  const totalClasses = attendance?.totalClasses || 0;
  const attended = attendance?.attendedClasses || 0;

  const percent =
    totalClasses > 0
      ? ((attended / totalClasses) * 100).toFixed(2)
      : 0;

  const isLow = percent < 75;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        My Attendance
      </h1>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600">Loading...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {/* Attendance Card */}
      {attendance && (
        <div className="bg-green-50 p-6 rounded-xl shadow-sm">
          <p><strong>Name:</strong> {attendance.name}</p>
          <p><strong>Roll:</strong> {attendance.roll}</p>
          <p><strong>Class:</strong> {attendance.className}</p>

          <div className="mt-4 space-y-2">
            <p><strong>Total Classes:</strong> {totalClasses}</p>
            <p><strong>Classes Attended:</strong> {attended}</p>
            <p>
              <strong>Attendance %:</strong>{" "}
              <span className={isLow ? "text-red-600" : "text-green-700"}>
                {percent}%
              </span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  isLow ? "bg-red-500" : "bg-green-600"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Warning */}
          {isLow && (
            <p className="text-red-600 mt-4 font-medium">
              ⚠ Attendance below 75%
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;