import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // Firebase Google Popup Login
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Logged in as:", user.displayName);
      
      // Login ke baad dashboard par bhejhein
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Failed to login with Google");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>SafeStay Owner Login</h1>
        <p>Manage your property and tenants securely</p>
        
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google logo" 
          />
          <span>Sign in with Google</span>
        </button>
        
        <div className="login-footer">
          <p>Authorized access only</p>
        </div>
      </div>
    </div>
  );
}