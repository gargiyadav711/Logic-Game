import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameProvider } from "./context/GameContext.jsx";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Investigation from "./pages/Investigation.jsx";
import Suspects from "./pages/Suspects.jsx";
import EvidenceBoard from "./pages/EvidenceBoard.jsx";
import Timeline from "./pages/Timeline.jsx";
import Interrogation from "./pages/Interrogation.jsx";
import FinalDeduction from "./pages/FinalDeduction.jsx";
import CaseSolved from "./pages/CaseSolved.jsx";
import Progress from "./pages/Progress.jsx";
import "./App.css";

function RoutedGame() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/investigation" element={<Investigation />} />
    <Route path="/suspects" element={<Suspects />} />
    <Route path="/evidence" element={<EvidenceBoard />} />
    <Route path="/timeline" element={<Timeline />} />
    <Route path="/interrogation" element={<Interrogation />} />
    <Route path="/deduction" element={<FinalDeduction />} />
    <Route path="/case-solved" element={<CaseSolved />} />
    <Route path="/progress" element={<Progress />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <GameProvider><BrowserRouter><RoutedGame /></BrowserRouter></GameProvider>;
}
