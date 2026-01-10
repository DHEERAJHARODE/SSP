import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TenantForm from "./pages/TenantForm";
import ContractView from "./pages/ContractView";
import { auth } from "../firebase/firebaseConfig";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tenant-form" element={<TenantForm />} />
        <Route path="/contract" element={<ContractView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
