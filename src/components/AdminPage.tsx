import { Routes, Route } from "react-router-dom";

import AdminLayout from "./admin/AdminLayout";

import Items from "./admin/pages/Items";
import ValueChanges from "./admin/pages/ValueChanges";
import ScamLogs from "./admin/pages/ScamLogs";
import StockRotation from "./admin/pages/StockRotation";
import Settings from "./admin/pages/Settings";

export default function AdminPage() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="changes" element={<ValueChanges />} />
        <Route path="scams" element={<ScamLogs />} />
        <Route path="stock" element={<StockRotation />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </AdminLayout>
  );
}
