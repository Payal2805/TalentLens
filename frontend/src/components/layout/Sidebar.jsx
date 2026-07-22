import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  Bell,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/candidate/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Resume",
    path: "/candidate/resume",
    icon: FileText,
  },
  {
    name: "Jobs",
    path: "/candidate/jobs",
    icon: Briefcase,
  },
  {
    name: "My Applications",
    path: "/candidate/my-applications",
    icon: ClipboardList,
  },
  {
    name: "Notifications",
    path: "/candidate/notifications",
    icon: Bell,
  },
];

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-2xl">

      {/* Logo */}
      <div className="p-6 border-b border-blue-600">
        <h1 className="text-3xl font-extrabold tracking-wide">
          TalentLens
        </h1>

        <p className="text-sm text-blue-200 mt-1">
          Candidate Portal
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
                `flex items-center gap-3 rounded-xl px-5 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-white text-blue-700 font-semibold shadow-lg"
                    : "hover:bg-blue-800"
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

export default Sidebar;
