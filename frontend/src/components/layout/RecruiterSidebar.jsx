import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Bell,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/recruiter/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Create Job",
    path: "/recruiter/create-job",
    icon: PlusCircle,
  },
  {
    name: "My Jobs",
    path: "/recruiter/my-jobs",
    icon: Briefcase,
  },

  {
    name: "Notifications",
    path: "/recruiter/notifications",
    icon: Bell,
  },
];

function RecruiterSidebar() {
  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-900 text-white shadow-2xl">

      {/* Logo */}
      <div className="p-6 border-b border-indigo-600">
        <h1 className="text-3xl font-extrabold">
          TalentLens
        </h1>

        <p className="text-indigo-200 text-sm mt-1">
          Recruiter Portal
        </p>
      </div>

      {/* Menu */}
      <nav className="mt-6 flex flex-col gap-2 px-3">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-5 py-3 transition ${
                  isActive
                    ? "bg-white text-indigo-700 font-semibold shadow-lg"
                    : "hover:bg-indigo-800"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}

      </nav>
    </div>
  );
}

export default RecruiterSidebar;
