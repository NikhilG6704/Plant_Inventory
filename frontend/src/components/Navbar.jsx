import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-slate-900 p-4 overflow-y-auto shadow-xl z-50">
      <h1 className="text-white text-3xl font-bold mb-10">Inventory</h1>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/issued" className={linkClass}>
          Issued Assets
        </NavLink>

        <NavLink to="/returned" className={linkClass}>
          Returned Assets
        </NavLink>
        <NavLink to="/damaged" className={linkClass}>
          Damaged Assets
        </NavLink>
      </nav>
    </aside>
  );
}

export default Navbar;
