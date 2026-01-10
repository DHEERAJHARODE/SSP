import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  LogOut, 
  Copy, 
  CheckCircle, 
  Clock 
} from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth(); // Assuming logout function exists in context
  const [activeTab, setActiveTab] = useState("overview");
  const [agreements, setAgreements] = useState([]);
  const [formData, setFormData] = useState({
    propertyName: "",
    rentAmount: "",
    terms: "1. Rent must be paid by the 5th of every month.\n2. Security deposit is refundable.\n3. Keep the premises clean.", 
  });

  // User details extraction
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : (user?.email?.split("@")[0] || "User");
  // Random Avatar based on name
  const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}&background=0D8ABC&color=fff&size=128&bold=true`;

  // Fetch Agreements (Updated to use ownerUid)
  useEffect(() => {
    if (!user) return;
    
    // Query: Fetch agreements where ownerUid matches the current logged-in user
    const q = query(collection(db, "agreements"), where("ownerUid", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAgreements(list);
    }, (error) => {
      console.error("Error fetching agreements:", error);
    });
    
    return () => unsubscribe();
  }, [user]);

  // Stats Calculation
  const totalAgreements = agreements.length;
  const signedAgreements = agreements.filter(a => a.status === "filled").length;
  const pendingAgreements = totalAgreements - signedAgreements;

  // Generate Key & Create Agreement (Updated to save ownerUid)
  const handleCreateAgreement = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to create an agreement.");
      return;
    }

    const newKey = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      await addDoc(collection(db, "agreements"), {
        ownerUid: user.uid,        // Securely link to owner's UID
        ownerEmail: user.email,
        propertyName: formData.propertyName,
        rentAmount: formData.rentAmount,
        terms: formData.terms.split('\n').filter(t => t.trim() !== ""), // Clean empty lines
        accessKey: newKey,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      alert(`✅ Agreement Created! Share Key: ${newKey}`);
      setFormData({ 
        propertyName: "", 
        rentAmount: "", 
        terms: "1. Rent must be paid by the 5th of every month.\n2. Security deposit is refundable.\n3. Keep the premises clean." 
      });
      setActiveTab("agreements"); // Switch to list view
    } catch (error) {
      console.error("Error creating agreement:", error);
      alert("❌ Failed to create agreement.");
    }
  };

  const copyToClipboard = (key) => {
    const link = `${window.location.origin}/fill-agreement/${key}`;
    navigator.clipboard.writeText(link);
    alert("🔗 Link Copied!");
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <h2>SafeStay<span className="dot">.</span></h2>
        </div>
        
        <nav className="nav-menu">
          <button onClick={() => setActiveTab("overview")} className={activeTab === "overview" ? "active" : ""}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button onClick={() => setActiveTab("agreements")} className={activeTab === "agreements" ? "active" : ""}>
            <FileText size={20} /> My Agreements
          </button>
          <button onClick={() => setActiveTab("create")} className={activeTab === "create" ? "active" : ""}>
            <PlusCircle size={20} /> Create New
          </button>
        </nav>

        <div className="logout-section">
          <button onClick={() => window.location.href = '/login'} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="header-title">
            <h1>Welcome back, {firstName} 👋</h1>
            <p>Manage your rental agreements securely.</p>
          </div>
          <div className="user-profile">
            <img src={avatarUrl} alt="Profile" className="avatar" />
            <div className="user-info">
              <span className="user-name">{user?.displayName || firstName}</span>
              <span className="user-role">Property Owner</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Based on Tab */}
        <div className="content-body">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="icon-bg"><FileText size={24} /></div>
                <div>
                  <h3>{totalAgreements}</h3>
                  <p>Total Agreements</p>
                </div>
              </div>
              <div className="stat-card green">
                <div className="icon-bg"><CheckCircle size={24} /></div>
                <div>
                  <h3>{signedAgreements}</h3>
                  <p>Signed / Active</p>
                </div>
              </div>
              <div className="stat-card orange">
                <div className="icon-bg"><Clock size={24} /></div>
                <div>
                  <h3>{pendingAgreements}</h3>
                  <p>Pending Signature</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. CREATE AGREEMENT TAB */}
          {activeTab === "create" && (
            <div className="form-card">
              <div className="card-header">
                <h3>Draft New Agreement</h3>
                <p>Define terms and generate a secure link for your tenant.</p>
              </div>
              <form onSubmit={handleCreateAgreement}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Property Name / Address</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Flat 101, Galaxy Apartments" 
                      value={formData.propertyName}
                      onChange={e => setFormData({...formData, propertyName: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Monthly Rent (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15000" 
                      value={formData.rentAmount}
                      onChange={e => setFormData({...formData, rentAmount: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Terms & Conditions (One per line)</label>
                  <textarea 
                    rows="6" 
                    value={formData.terms}
                    onChange={e => setFormData({...formData, terms: e.target.value})}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="primary-btn">Generate Agreement Link</button>
              </form>
            </div>
          )}

          {/* 3. MY AGREEMENTS TAB */}
          {activeTab === "agreements" && (
            <div className="table-container">
              <h3>Recent Agreements</h3>
              {agreements.length === 0 ? (
                <div className="empty-state">
                  <p>No agreements found. Create one to get started.</p>
                </div>
              ) : (
                <table className="agreements-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Date Created</th>
                      <th>Status</th>
                      <th>Access Key</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreements.map((ag) => (
                      <tr key={ag.id}>
                        <td>{ag.propertyName}</td>
                        <td>{new Date(ag.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${ag.status === 'filled' ? 'success' : 'pending'}`}>
                            {ag.status === 'filled' ? 'Signed' : 'Pending'}
                          </span>
                        </td>
                        <td className="key-text">{ag.accessKey}</td>
                        <td>
                          <button onClick={() => copyToClipboard(ag.accessKey)} className="action-btn" title="Copy Link">
                            <Copy size={16} /> Copy Link
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}