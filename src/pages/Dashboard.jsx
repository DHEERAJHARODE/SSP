import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { LogOut, Plus, Copy, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [property, setProperty] = useState({ name: '', address: '', terms: '' });
  const [agreements, setAgreements] = useState([]);
  const [generatedKey, setGeneratedKey] = useState(null);

  const fetchAgreements = async () => {
    const q = query(collection(db, "agreements"), where("ownerEmail", "==", auth.currentUser.email));
    const snap = await getDocs(q);
    setAgreements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleGenerateKey = async () => {
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await addDoc(collection(db, "agreements"), {
        ...property,
        ownerEmail: auth.currentUser.email,
        key: key,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      setGeneratedKey(key);
      fetchAgreements();
    } catch (err) { alert("Error: " + err.message); }
  };

  useEffect(() => { fetchAgreements(); }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-10 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SafeStay</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-70">{auth.currentUser.email}</span>
          <button onClick={() => auth.signOut()} className="p-2 hover:bg-red-500/20 rounded-full text-red-400 transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="text-cyan-400" /> New Agreement
            </h2>
            <div className="space-y-4">
              <input className="w-full bg-slate-800/50 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" 
                placeholder="Property Name" onChange={e => setProperty({...property, name: e.target.value})} />
              <input className="w-full bg-slate-800/50 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none" 
                placeholder="Address" onChange={e => setProperty({...property, address: e.target.value})} />
              <textarea className="w-full bg-slate-800/50 border border-slate-700 p-3 rounded-xl h-32 focus:ring-2 focus:ring-cyan-500 outline-none" 
                placeholder="Terms & Conditions (One per line)" onChange={e => setProperty({...property, terms: e.target.value})} />
              <button onClick={handleGenerateKey} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                Generate Secure Key
              </button>
            </div>

            {generatedKey && (
              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex justify-between items-center animate-bounce">
                <span className="font-mono text-xl text-cyan-400">{generatedKey}</span>
                <button onClick={() => navigator.clipboard.writeText(generatedKey)} className="text-cyan-400 hover:text-white"><Copy size={18} /></button>
              </div>
            )}
          </div>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-xl h-full">
            <h2 className="text-xl font-semibold mb-6">Recent Agreements</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-500 border-b border-white/5">
                    <th className="pb-4 text-left">Key</th>
                    <th className="pb-4 text-left">Property</th>
                    <th className="pb-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {agreements.map((ag) => (
                    <tr key={ag.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-mono text-cyan-400 font-bold">{ag.key}</td>
                      <td className="py-4">{ag.name}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${ag.status === 'Signed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {ag.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;