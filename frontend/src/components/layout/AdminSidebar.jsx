import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Briefcase,
  ClipboardList,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Candidates",
    path: "/admin/candidates",
    icon: UserRound,
  },
  {
    name: "Recruiters",
    path: "/admin/recruiters",
    icon: Users,
  },
  {
    name: "Jobs",
    path: "/admin/jobs",
    icon: Briefcase,
  },
  {
    name: "Applications",
    path: "/admin/applications",
    icon: ClipboardList,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-slate-800 to-slate-950 text-white shadow-2xl">

      {/* Logo */}

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-3xl font-extrabold tracking-wide">
          TalentLens
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Admin Panel
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
                    ? "bg-white text-slate-800 font-semibold shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

    </div>
  );
}

export default AdminSidebar;
