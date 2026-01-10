import { useEffect, useState } from "react";
import { db } from "../firebase"; // Path according to your structure
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import "./Dashboard.css";

export default function Dashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firestore se real-time data fetch karne ke liye
    const q = query(collection(db, "tenants"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tenantList = [];
      querySnapshot.forEach((doc) => {
        tenantList.push({ id: doc.id, ...doc.data() });
      });
      setTenants(tenantList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Owner Dashboard</h1>
        <p>Total Registered Tenants: {tenants.length}</p>
      </header>

      <div className="tenant-grid">
        {tenants.map((tenant) => (
          <div key={tenant.id} className="tenant-card">
            <div className="tenant-image">
              {/* Base64 text ko seedhe src mein use kar rahe hain */}
              <img src={tenant.selfie} alt={tenant.name} />
            </div>
            <div className="tenant-info">
              <h3>{tenant.name}</h3>
              <p><strong>Father:</strong> {tenant.fatherName}</p>
              <p><strong>Mobile:</strong> {tenant.mobile}</p>
              <p className="address"><strong>Address:</strong> {tenant.address}</p>
              
              <div className="doc-previews">
                <div>
                  <span>Aadhaar Front</span>
                  <img src={tenant.aadhaarFront} alt="Aadhaar Front" className="mini-doc" />
                </div>
                <div>
                  <span>Signature</span>
                  <img src={tenant.signature} alt="Signature" className="mini-doc" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}