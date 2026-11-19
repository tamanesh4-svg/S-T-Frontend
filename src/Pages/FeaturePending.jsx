import { useNavigate } from "react-router-dom";

const FeaturePending = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EAF3FF] flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">
          This feature is not implemented in the supplied project files yet.
          Your existing dashboard and navigation are working; this page is a safe placeholder until the feature is added.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default FeaturePending;
