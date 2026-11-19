
import { useEffect, useState } from "react";

const ViewResults = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        const response = await fetch(
          "https://school-management-node-backend.onrender.com/api/results/student/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch result");
        }

        const data = await response.json();
        setResult(data);

      } catch (err) {
        console.error("Fetch result error:", err);
        setError(err.message || "Failed to fetch result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  const studentResult = result?.subjects?.[0];
  const prediction = result?.prediction;
  const attendance = result?.attendance;

  // ================= GRADE CALCULATION =================

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <p className="text-center text-gray-600">
          Loading your results...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <p className="text-center text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">

      {/* PAGE TITLE */}

      <h1 className="text-2xl font-bold text-green-700 mb-6">
        My Continuous Assessment Results
      </h1>

      {/* STUDENT DETAILS */}

      {result && (
        <div className="mb-6 bg-green-50 p-5 rounded-xl">
          <p>
            <strong>Name:</strong> {result.name}
          </p>

          <p>
            <strong>Roll:</strong> {result.roll}
          </p>

          <p>
            <strong>Class:</strong> {result.className || "N/A"}
          </p>
        </div>
      )}

      {/* NO RESULT */}

      {!studentResult && (
        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl text-center">
          <p className="text-yellow-800 font-medium">
            No CA results have been published yet.
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Your results and performance prediction will appear here
            once your teacher publishes your assessment marks.
          </p>
        </div>
      )}

      {studentResult && (
        <>
          {/* ================= CA RESULTS TABLE ================= */}

          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Assessment Details
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead className="bg-green-50">
                <tr>
                  <th className="border p-3">
                    Assessment
                  </th>

                  <th className="border p-3">
                    Marks Obtained
                  </th>

                  <th className="border p-3">
                    Maximum Marks
                  </th>
                </tr>
              </thead>

              <tbody>
                {studentResult.assessments.map((ca, index) => (
                  <tr key={index}>
                    <td className="border p-3 font-medium">
                      {ca.name}
                    </td>

                    <td className="border p-3 text-center">
                      {ca.marks === null
                        ? "Not published"
                        : ca.marks}
                    </td>

                    <td className="border p-3 text-center">
                      {ca.maxMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= RESULT SUMMARY ================= */}

          <div className="mt-6 bg-gray-50 p-5 rounded-xl space-y-2">

            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Result Summary
            </h2>

            <p>
              <strong>Completed Assessments:</strong>{" "}
              {studentResult.completedAssessments}/4
            </p>

            <p>
              <strong>Marks Obtained:</strong>{" "}
              {studentResult.total} / {studentResult.maxTotal}
            </p>

            <p>
              <strong>Percentage:</strong>{" "}
              {studentResult.percentage.toFixed(2)}%
            </p>

            {studentResult.completedAssessments > 0 && (
              <p>
                <strong>Grade:</strong>{" "}
                <span className="font-bold text-green-700">
                  {getGrade(studentResult.percentage)}
                </span>
              </p>
            )}
          </div>
        </>
      )}

      {/* ================= ATTENDANCE OVERVIEW ================= */}

      {attendance && (
        <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-xl">

          <h2 className="text-lg font-bold text-blue-800 mb-3">
            Attendance Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">
                Total Classes
              </p>

              <p className="text-2xl font-bold text-gray-800">
                {attendance.totalClasses}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">
                Classes Attended
              </p>

              <p className="text-2xl font-bold text-green-700">
                {attendance.attendedClasses}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-500">
                Attendance Percentage
              </p>

              <p className="text-2xl font-bold text-blue-700">
                {attendance.percentage === null
                  ? "N/A"
                  : `${attendance.percentage}%`}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ================= AI PERFORMANCE PREDICTION ================= */}

      {prediction && (
        <div className="mt-6 bg-purple-50 border border-purple-200 p-6 rounded-2xl">

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>

            <h2 className="text-xl font-bold text-purple-800">
              AI-Based Performance Prediction
            </h2>
          </div>

          {/* PREDICTION AVAILABLE */}

          {prediction.available && (
            <>
              <p className="text-gray-600 mb-3">
                {prediction.message}
              </p>

              <div className="bg-white rounded-xl p-5 text-center">

                <p className="text-sm text-gray-500 mb-2">
                  Expected Overall Total
                </p>

                <p className="text-4xl font-extrabold text-purple-700">
                  {Number(prediction.expectedTotal).toFixed(2)}
                  <span className="text-xl text-gray-500">
                    {" "} / 100
                  </span>
                </p>

                <div className="mt-4">
                  <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Prediction After CA{prediction.stage}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Attendance considered:</strong>{" "}
                  {prediction.attendance}%
                </p>

                <p>
                  <strong>Prediction stage:</strong>{" "}
                  After CA{prediction.stage}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                This is an AI-generated estimate based on your
                assessment marks and attendance. It is not your
                final result.
              </p>
            </>
          )}

          {/* ALL FOUR CAs COMPLETED */}

          {prediction.completed && (
            <div className="bg-white rounded-xl p-5 text-center">

              <p className="text-gray-600 mb-2">
                All four assessments have been completed.
              </p>

              <p className="text-sm text-gray-500">
                Your actual overall result is:
              </p>

              <p className="text-4xl font-extrabold text-green-700 mt-2">
                {prediction.actualTotal}
                <span className="text-xl text-gray-500">
                  {" "} / 100
                </span>
              </p>

              <p className="text-sm text-green-700 font-medium mt-3">
                Final assessment completed
              </p>

            </div>
          )}

          {/* PREDICTION NOT AVAILABLE */}

          {!prediction.available && !prediction.completed && ( 
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-700">
                {prediction.message ||
                  "Prediction is not available yet."}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ViewResults;
