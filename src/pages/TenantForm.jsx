import { useRef, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function TenantForm() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageBase64, setImageBase64] = useState("");

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const base64 = canvas.toDataURL("image/png"); // ✅ BASE64
    setImageBase64(base64);

    // stop camera
    videoRef.current.srcObject.getTracks().forEach(track => track.stop());
  };

  const saveToFirestore = async () => {
    await addDoc(collection(db, "tenants"), {
      name: "Demo Tenant",
      selfieBase64: imageBase64, // ✅ text form
      createdAt: Date.now(),
    });
    alert("Saved successfully!");
  };

  return (
    <div>
      <h2>Tenant Selfie</h2>

      <video ref={videoRef} width="320" height="240" autoPlay />
      <br />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureImage}>Capture</button>

      <canvas ref={canvasRef} width="320" height="240" style={{ display: "none" }} />

      {imageBase64 && (
        <>
          <h3>Preview</h3>
          <img src={imageBase64} width="200" />
          <br />
          <button onClick={saveToFirestore}>Save</button>
        </>
      )}
    </div>
  );
}
