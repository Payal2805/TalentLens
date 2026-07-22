import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import Resume from "../pages/candidate/Resume";
import JobList from "../pages/candidate/JobList";
import MyApplications from "../pages/candidate/MyApplications";
import Notifications from "../pages/candidate/Notifications";
import CandidateProfile from "../pages/candidate/CandidateProfile";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function Home() {
  return <h2>Home Page</h2>;
}

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:uid/:token"
        element={<ResetPassword />}
      />

      {/* Candidate Dashboard */}

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Dashboard */}

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/resume"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <Resume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/jobs"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <JobList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/my-applications"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/notifications"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/profile"
        element={
          <ProtectedRoute allowedRoles={["CANDIDATE"]}>
            <CandidateProfile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
