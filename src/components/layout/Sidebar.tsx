import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileSpreadsheet,
  Wallet,
  BarChart2,
  Users,
  User,
  ChevronDown,
  Building2,
  Tags,
  BoxesIcon,
  ArrowLeftRight,
  X,
  LogOut,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

interface SidebarSubmenuProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  exact = false,
}) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twMerge(
          "flex items-center py-2.5 px-4 text-sm font-medium rounded-md transition-colors",
          isActive
            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        )
      }
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  icon,
  label,
  children,
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    // Auto-open submenu if any of its children is active
    const childPaths = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return child.props.to;
      }
      return null;
    });

    return (
      childPaths?.some((path) => location.pathname.startsWith(path)) || false
    );
  });

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "flex items-center justify-between w-full py-2.5 px-4 text-sm font-medium rounded-md transition-colors",
          isOpen
            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        )}
      >
        <div className="flex items-center">
          <span className="mr-3 text-xl">{icon}</span>
          <span>{label}</span>
        </div>
        <ChevronDown
          className={`transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          size={16}
        />
      </button>
      <div
        className={`overflow-hidden transition-all ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pl-10 pr-2 py-1 space-y-1">{children}</div>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-bold text-primary-600 dark:text-primary-400">
            Inventory System
          </h1>
          <button
            onClick={onClose}
            className="p-1 rounded-md lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Dashboard */}
          <SidebarItem
            to="/"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            exact
          />

          {/* Inventory */}
          <SidebarSubmenu icon={<Package size={20} />} label="Inventory">
            {/* Categories */}
            <SidebarItem
              to="/categories"
              icon={<Tags size={18} />}
              label="Categories"
            />
            {/* Stores */}
            <SidebarItem
              to="/stores"
              icon={<Building2 size={18} />}
              label="Stores"
            />
            {/* Products */}
            <SidebarItem
              to="/products"
              icon={<BoxesIcon size={18} />}
              label="Products"
            />
            {/* Stock Movements */}
            <SidebarItem
              to="/stock-movements"
              icon={<ArrowLeftRight size={18} />}
              label="Stock Movements"
            />
          </SidebarSubmenu>

          {/* Quotation */}
          <SidebarItem
            to="/quotations"
            icon={<FileSpreadsheet size={20} />}
            label="Quotations"
          />

          {/* Purchase */}
          <SidebarItem
            to="/purchases"
            icon={<ShoppingCart size={20} />}
            label="Purchases"
          />

          {/* Report */}
          <SidebarItem
            to="/reports"
            icon={<BarChart2 size={20} />}
            label="Reports"
          />

          {/* Akuns */}
          <SidebarItem to="/akuns" icon={<Wallet size={20} />} label="Akuns" />

          {/* Spacer to push User to bottom */}
          <div className="flex-grow" />

          {/* User Management */}
          <SidebarItem
            to="/users"
            icon={<Users size={20} />}
            label="User Management"
          />

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center px-4 py-2">
              <div className="flex-shrink-0">
                <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.fullname || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full text-gray-500 hover:text-danger-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-danger-400"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
