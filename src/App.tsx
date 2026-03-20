import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { UniverseDefinition } from "./pages/universe-definition/UniverseDefinition";
import { UnderDevelopment } from "./pages/UnderDevelopment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route
            index
            element={<Navigate to="/universe-definition" replace />}
          />
          <Route path="universe-definition" element={<UniverseDefinition />} />
          <Route path="*" element={<UnderDevelopment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
