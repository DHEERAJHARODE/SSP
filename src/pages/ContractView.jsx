import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ContractView.css";

export default function ContractView() {
  const location = useLocation();
  const navigate = useNavigate();
  // Get data passed from TenantAgreement or Dashboard
  const { agreement, tenant } = location.state || {};

  // Agar data nahi hai (direct access without flow), to error dikhaye ya redirect kare
  if (!agreement || !tenant) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No Agreement Data Found</h2>
        <p>Please access this page via the generated link or dashboard.</p>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "10px", marginTop: "10px" }}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  const downloadPDF = async () => {
    const input = document.getElementById('stamp-paper-area');
    
    // Temporarily hide the button or borders if needed before capture
    // html2canvas capture
    const canvas = await html2canvas(input, { 
      scale: 2,
      useCORS: true // Important if loading images from external URLs
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Agreement_${tenant.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="contract-container">
      <div className="action-bar">
        <button onClick={downloadPDF} className="download-btn">
          Download PDF
        </button>
      </div>

      {/* Main Stamp Paper Area */}
      <div id="stamp-paper-area" className="stamp-paper">
        {/* Background Image is set via CSS */}
        
        <div className="content-overlay">
          <h1 className="title">RENTAL AGREEMENT</h1>
          
          <div className="details-section">
            <p><strong>Property:</strong> {agreement.propertyName}</p>
            <p><strong>Rent:</strong> ₹{agreement.rentAmount} / month</p>
            <br/>
            <h3>Tenant Details:</h3>
            <p><strong>Name:</strong> {tenant.name}</p>
            <p><strong>Father's Name:</strong> {tenant.fatherName}</p>
            <p><strong>Permanent Address:</strong> {tenant.address}</p>
            <p><strong>Mobile:</strong> {tenant.mobile}</p>
            {tenant.aadhaar && <p><strong>Aadhaar:</strong> {tenant.aadhaar}</p>}
          </div>

          <div className="terms-section">
            <h3>Terms and Conditions:</h3>
            <ul>
              {/* Ensure terms is an array before mapping */}
              {Array.isArray(agreement.terms) ? agreement.terms.map((term, index) => (
                <li key={index}>{term}</li>
              )) : <li>{agreement.terms}</li>}
            </ul>
          </div>

          <div className="signatures">
            <div className="tenant-sign">
              {tenant.signature ? (
                <img src={tenant.signature} alt="Tenant Sign" />
              ) : <div className="placeholder-sign">Signed</div>}
              <p>Tenant Signature</p>
            </div>
            
            <div className="owner-sign">
              {/* Owner signature placeholder */}
              <div className="placeholder-sign" style={{height:'50px'}}></div>
              <p>Owner Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}