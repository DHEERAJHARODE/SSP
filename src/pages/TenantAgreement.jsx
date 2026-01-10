import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import "./TenantAgreement.css"; // Ensure CSS file exists for styling

export default function TenantAgreement() {
  const { key } = useParams(); // URL se key (e.g., /fill-agreement/ABC123)
  const navigate = useNavigate();
  
  const [agreementData, setAgreementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State for Tenant
  const [tenantData, setTenantData] = useState({
    name: "",
    fatherName: "",
    mobile: "",
    email: "",
    address: "",
    aadhaar: "",
    photo: "",     // New: Tenant Photo
    signature: ""  // Signature
  });

  // 1. Fetch Agreement Details by Key
  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        const q = query(collection(db, "agreements"), where("accessKey", "==", key));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          // Check if already filled
          if (data.status === "filled") {
            setError("⛔ This agreement has already been signed and closed.");
          } else {
            setAgreementData({ id: snapshot.docs[0].id, ...data });
          }
        } else {
          setError("❌ Invalid Access Key or Link expired.");
        }
      } catch (err) {
        console.error("Error fetching:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgreement();
  }, [key]);

  // Handle Text Inputs
  const handleInput = (e) => {
    setTenantData({ ...tenantData, [e.target.name]: e.target.value });
  };

  // Handle File Uploads (Photo & Signature)
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTenantData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Submit Logic (Link Tenant to Agreement)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenantData.signature || !tenantData.photo) {
      alert("Please upload both your Photo and Signature.");
      return;
    }
    
    setLoading(true);

    try {
      // Step A: Create Tenant Document
      const tenantRef = await addDoc(collection(db, "tenants"), {
        ...tenantData,
        agreementId: agreementData.id, // Linking to Agreement
        filledAt: new Date().toISOString()
      });

      // Step B: Update Agreement Status
      const agreementRef = doc(db, "agreements", agreementData.id);
      await updateDoc(agreementRef, {
        status: "filled",
        tenantName: tenantData.name,
        tenantId: tenantRef.id
      });

      alert("✅ Agreement Signed Successfully!");
      // Redirect to View Contract page with data
      navigate("/view-contract", { state: { agreement: agreementData, tenant: tenantData } });

    } catch (err) {
      console.error("Error submitting:", err);
      alert("Submission Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Verifying Secure Link...</div>;
  
  if (error) return (
    <div className="error-screen">
      <h2>{error}</h2>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );

  return (
    <div className="agreement-wrapper">
      <div className="agreement-container">
        
        {/* SECTION 1: AGREEMENT DETAILS (READ ONLY) */}
        <header className="agreement-header">
          <h1>Rental Agreement Form</h1>
          <p className="sub-text">Please review terms and fill your details below.</p>
        </header>

        <div className="details-card">
          <h3>🏡 Property Details</h3>
          <div className="info-grid">
            <p><strong>Owner:</strong> {agreementData.ownerEmail}</p>
            <p><strong>Property:</strong> {agreementData.propertyName}</p>
            <p><strong>Monthly Rent:</strong> ₹{agreementData.rentAmount}</p>
          </div>
          
          <div className="terms-box">
            <h4>📜 Terms & Conditions:</h4>
            <ul>
              {agreementData.terms && agreementData.terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION 2: TENANT FORM */}
        <div className="form-card">
          <h3>👤 Tenant Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="name" type="text" onChange={handleInput} required placeholder="As per Aadhaar" />
              </div>
              <div className="form-group">
                <label>Father's Name *</label>
                <input name="fatherName" type="text" onChange={handleInput} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input name="mobile" type="tel" onChange={handleInput} required />
              </div>
              <div className="form-group">
                <label>Email ID</label>
                <input name="email" type="email" onChange={handleInput} />
              </div>
            </div>

            <div className="form-group">
              <label>Permanent Address *</label>
              <textarea name="address" rows="3" onChange={handleInput} required></textarea>
            </div>

            <div className="form-group">
              <label>Aadhaar Number (Optional)</label>
              <input name="aadhaar" type="text" onChange={handleInput} maxLength="12" />
            </div>

            {/* Upload Section */}
            <div className="upload-row">
              <div className="upload-box">
                <label>📸 Your Photo *</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "photo")} required />
                {tenantData.photo && <img src={tenantData.photo} alt="Preview" className="preview-thumb" />}
              </div>

              <div className="upload-box">
                <label>✍️ Your Signature *</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "signature")} required />
                {tenantData.signature && <img src={tenantData.signature} alt="Sign" className="preview-thumb" />}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Sign & Generate Agreement"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}