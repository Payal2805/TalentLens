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
import CandidateInterviewDashboard from "../pages/candidate/CandidateInterviewDashboard";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import CreateJob from "../pages/recruiter/CreateJob";
import MyJobs from "../pages/recruiter/MyJobs";
import EditJob from "../pages/recruiter/EditJob";
import Applicants from "../pages/recruiter/Applicants";
import CandidateDetails from "../pages/recruiter/CandidateDetails";
import RecruiterNotifications from "../pages/recruiter/RecruiterNotifications";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";
import RecruiterInterviewList from "../pages/recruiter/RecruiterInterviewList";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminJobs from "../pages/admin/AdminJobs";
import AdminCandidates from "../pages/admin/AdminCandidates";
import AdminRecruiters from "../pages/admin/AdminRecruiters";
import AdminApplications from "../pages/admin/AdminApplications";
import AdminSettings from "../pages/admin/AdminSettings";

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
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/candidates"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminCandidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/recruiters"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminRecruiters />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminSettings />
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

      <Route
        path="/candidate/interviews"
        element={
            <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                <CandidateInterviewDashboard />
            </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/create-job"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <CreateJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/my-jobs"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <MyJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/edit-job/:id"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <EditJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs/:jobId/applicants"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <Applicants />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/application/:applicationId"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <CandidateDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/notifications"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterNotifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/profile"
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]}>
            <RecruiterProfile />
          </ProtectedRoute>
        }
      />

      <Route
          path="/recruiter/interviews"
          element={
              <ProtectedRoute allowedRoles={["RECRUITER"]}>
                  <RecruiterInterviewList />
              </ProtectedRoute>
          }
      />

    </Routes>
  );
}
