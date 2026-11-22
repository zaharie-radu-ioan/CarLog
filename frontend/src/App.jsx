import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RemindersPage from "./pages/RemindersPage.jsx";
import ReminderDetailPage from "./pages/ReminderDetailPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RemindersPage />} />
        <Route path="/reminders/:id" element={<ReminderDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}