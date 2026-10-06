import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { API } from "../api/api";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(API.GET_ME, {
          method: "GET",
          credentials: "include",
        });

        setAuthenticated(response.ok);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return ;
  }

  return authenticated ? <Outlet /> : <Navigate to="/signup" replace />;
};

export default ProtectedRoute;