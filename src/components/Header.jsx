import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-f1-red text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold">
          <Link to="/">F1 Data Tracker</Link>
        </h1>
        <nav className="space-x-6">
          <Link
            to="/schedule"
            className={`hover:underline ${location.pathname === "/schedule" ? "text-yellow-500" : ""}`}
          >
            Schedule
          </Link>
          <Link
            to="/results"
            className={`hover:underline ${location.pathname === "/results" ? "text-yellow-500" : ""}`}
          >
            Results
          </Link>
          <Link
            to="/drivers"
            className={`hover:underline ${location.pathname === "/drivers" ? "text-yellow-500" : ""}`}
          >
            Drivers
          </Link>
          <Link
            to="/teams"
            className={`hover:underline ${location.pathname === "/teams" ? "text-yellow-500" : ""}`}
          >
            Teams
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
