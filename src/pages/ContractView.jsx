import html2canvas from "html2canvas";
import { db } from "../firebase"; // Changed from "../firebase/firebase"
import { addDoc, collection } from "firebase/firestore";

export default function ContractView() {
  const saveContractAsText = async () => {
    const element = document.getElementById("contract-area");

    const canvas = await html2canvas(element, { scale: 2 });
    const base64Image = canvas.toDataURL("image/png");

    await addDoc(collection(db, "contracts"), {
      tenantName: "Demo Tenant",
      contractImageBase64: base64Image,
      createdAt: Date.now(),
    });

    alert("Contract saved as text!");
  };

  return (
    <>
      <div id="contract-area">
        <h2>Agreement</h2>
        <p>Name: Demo Tenant</p>
      </div>

      <button onClick={saveContractAsText}>
        Save Agreement
      </button>
    </>
  );
}