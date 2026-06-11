import { useState, useEffect } from "react";
import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const apiURL = import.meta.env.VITE_API_URL; // Ensure this is correctly set in `.env`

export const useSignInWithGoogle = () => {
  const [loading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectToHome) {
      navigate("/dashboard"); 
    }
  }, [redirectToHome, navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // We now send the idToken to a single backend endpoint to handle login/register
      const response = await axios.post(`${apiURL}/user/google-auth`, { idToken });
      
      toast.success(response.data.message || "Authentication successful!", { icon: "✅" });

      const responseData = response.data;
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("id", responseData.data.id);
      localStorage.setItem("email", responseData.data.email);

      setTimeout(() => {
        setRedirectToHome(true);
      }, 1000);

    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.response?.data?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};