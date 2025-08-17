import React from "react";
import { useNavigate } from "react-router-dom";

const AuditPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 space-y-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Audit Page</h1>
      <p className="text-gray-600">
        This page will display audit data and analytics.
      </p>
      <button
        onClick={() => navigate("/admin")}
        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
      >
        Back to Admin Page
      </button>
    </div>
  );
};

export default AuditPage;