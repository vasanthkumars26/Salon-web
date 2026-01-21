import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ADMIN_UID = "YuGcmQdwEHd8zeLcsk1Oiq62v9b2";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ADMIN_UID) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Checking access...</p>
      </div>
    );
  }

  // ❌ Not admin → block access
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // ✅ Admin → allow access
  return children;
};

export default AdminProtectedRoute;
