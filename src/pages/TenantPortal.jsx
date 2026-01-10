import React, { useState, useRef } from 'react';
import { db, storage } from '../firebase/firebaseConfig';
import { doc, getDocs, query, collection, where, updateDoc } from 'firebase/firestore';
import { Camera, ShieldCheck } from 'lucide-react';

const TenantPortal = () => {
  const [agreement, setAgreement] = useState(null);
  const [key, setKey] = useState('');
  const [selfie, setSelfie] = useState(null);
  const videoRef = useRef(null);

  const fetchByKey = async () => {
    const q = query(collection(db, "agreements"), where("key", "==", key.toUpperCase()));
    const snap = await getDocs(q);
    if (!snap.empty) setAgreement({ id: snap.docs[0].id, ...snap.docs[0].data() });
    else alert("Key Invalid!");
  };

  const startCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
        {!agreement ? (
          <div className="text-center">
            <ShieldCheck size={60} className="mx-auto text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold mb-6">Enter Agreement Key</h1>
            <input className="w-full border-2 border-slate-200 p-4 rounded-2xl text-center text-2xl font-mono uppercase mb-4 focus:border-blue-500 outline-none" 
              maxLength={6} placeholder="XXXXXX" onChange={e => setKey(e.target.value)} />
            <button onClick={fetchByKey} className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">
              Verify Agreement
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h2 className="font-bold text-blue-800 mb-2">Property: {agreement.name}</h2>
              <p className="text-sm text-blue-600">{agreement.address}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold">Terms (Hindi/English):</h3>
              <ul className="list-disc ml-5 space-y-2 text-slate-600">
                {agreement.terms.split('\n').map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>

            <div className="border-t pt-6 space-y-4">
              <input className="w-full border p-3 rounded-xl" placeholder="Your Full Name" />
              <input className="w-full border p-3 rounded-xl" placeholder="Aadhaar Number" maxLength={12} />
              
              <div className="bg-slate-100 p-4 rounded-2xl text-center">
                <video ref={videoRef} className="w-full rounded-xl hidden" />
                {selfie ? <img src={selfie} className="w-full rounded-xl" /> : (
                  <button onClick={startCam} className="flex items-center gap-2 mx-auto bg-slate-800 text-white px-6 py-3 rounded-xl">
                    <Camera size={20} /> Take Live Selfie
                  </button>
                )}
              </div>

              <button className="w-full bg-green-600 text-white p-4 rounded-2xl font-bold">
                Sign & Submit Agreement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPortal;