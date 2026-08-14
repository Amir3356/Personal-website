import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

/** Every route in one place, so App stays a thin shell of providers. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/*" element={<Admin />} />
    </Routes>
  );
}
