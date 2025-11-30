import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for Supabase to finish processing the OAuth redirect
    supabase.auth.getSession().then(() => {
      navigate("/trade-ads"); // redirect after login
    });
  }, []);

  return (
    <div className="text-center text-white py-20">
      Logging in...
    </div>
  );
}
