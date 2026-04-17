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

      // Prepare user data
      const userData = {
        email: user.email,
        fullname: user.displayName,
        photoUrl: user.photoURL
      };

      // Check if user exists
      const checkUserResponse = await axios.get(`${apiURL}/user/check?email=${user.email}`);

      if (checkUserResponse.data.exists) {
        toast.loading("User already exists. Logging in...", { icon: "ℹ️" });
        setTimeout(async () => {
          const loginResponse = await axios.post(`${apiURL}/user/login`, { email: user.email });
          let response = loginResponse.data;
          toast.success("Login successful!", { icon: "✅" });

          localStorage.setItem("token", response.token);
          localStorage.setItem("id", response.data.id);
          localStorage.setItem("email", response.data.email);

          setTimeout(() => {
            setRedirectToHome(true);
          }, 2000);
        }, 2000);
      } else {
        // If user does not exist, create new account
        const response = await axios.post(`${apiURL}/user/create`, userData, {
          headers: { "Content-Type": "application/json" }
        });
        toast.success("Registration successful!", { icon: "🎉" });

        let responsee = response.data;
        localStorage.setItem("token", responsee.token);
        localStorage.setItem("id", responsee.data.id);
        localStorage.setItem("email", responsee.data.email);

        setTimeout(() => {
          setRedirectToHome(true);
        }, 2000);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.response?.data?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};