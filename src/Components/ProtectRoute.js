import { Navigate } from "react-router-dom";

const ProtectRoute = ({ allowedRole, children }) => {
  const activeRole = sessionStorage.getItem("activeRole");

  // ================= NO ACTIVE LOGIN =================
  if (!activeRole) {
    return (
      <Navigate
        to={allowedRole === "student" ? "/student/login" : "/teacher/login"}
        replace
      />
    );
  }

  // ================= WRONG ROLE =================
  if (activeRole !== allowedRole) {
    return (
      <Navigate
        to={activeRole === "student" ? "/student/home" : "/teacher/home"}
        replace
      />
    );
  }

  // ================= AUTHORIZED =================
  return children;
};

export default ProtectRoute;