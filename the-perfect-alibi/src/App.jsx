import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";  
import InvestigationPage from "./pages/Investigation.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/investigation" element={<InvestigationPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
