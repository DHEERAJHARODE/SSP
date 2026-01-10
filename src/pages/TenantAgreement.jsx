// src/pages/TenantAgreement.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

export default function TenantAgreement() {
  const { key } = useParams(); // URL se key milegi
  const navigate = useNavigate();
  const [agreementData, setAgreementData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form State (Same as your TenantForm.jsx)
  const [tenantData, setTenantData] = useState({
    name: "", fatherName: "", address: "", mobile: "", aadhaar: "", signature: ""
  });

  // Verify Key on Load
  useEffect(() => {
    const fetchAgreement = async () => {
      const q = query(collection(db, "agreements"), where("accessKey", "==", key));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setAgreementData({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        alert("Invalid Link or Key!");
        navigate("/");
      }
      setLoading(false);
    };
    fetchAgreement();
  }, [key, navigate]);

  // Handle Input (Same logic as existing form)
  const handleInput = (e) => setTenantData({...tenantData, [e.target.name]: e.target.value});
  
  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!agreementData) return;

    try {
      // 1. Save Tenant Data linked to Agreement
      await addDoc(collection(db, "tenants"), {
        ...tenantData,
        agreementId: agreementData.id,
        createdAt: new Date().toISOString()
      });

      // 2. Update Agreement Status
      const agreementRef = doc(db, "agreements", agreementData.id);
      await updateDoc(agreementRef, { status: "filled", tenantName: tenantData.name });

      // 3. Redirect to Final Contract View
      // Hum data ko state ke through pass kar rahe hain agle page par
      navigate("/view-contract", { state: { agreement: agreementData, tenant: tenantData } });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  if(loading) return <div>Validating Key...</div>;

  return (
    <div className="form-container">
      <h2>Rental Agreement for: {agreementData.propertyName}</h2>
      <p>Please fill your details to generate the contract.</p>
      
      <form onSubmit={handleSubmit}>
         <input name="name" placeholder="Full Name" onChange={handleInput} required />
         <input name="fatherName" placeholder="Father Name" onChange={handleInput} required />
         <input name="mobile" placeholder="Mobile" onChange={handleInput} required />
         <textarea name="address" placeholder="Permanent Address" onChange={handleInput} required />
         
         {/* Signature Upload Logic (Reuse logic from your TenantForm.jsx) */}
         <label>Upload Signature</label>
         <input type="file" onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setTenantData({...tenantData, signature: reader.result});
            if(file) reader.readAsDataURL(file);
         }} required />

         <button type="submit">Generate Agreement</button>
      </form>
    </div>
  );
}