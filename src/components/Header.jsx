import { Link } from "react-router-dom";

const Header = () => (
    <header className="bg-f1-red text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-3xl font-bold">
          <Link to="/">F1 Data Tracker</Link>
        </h1>
        <nav className="space-x-6">
          <Link to="/schedule" className="hover:underline">Schedule</Link>
          <Link to="/results" className="hover:underline">Results</Link>
          <Link to="/drivers" className="hover:underline">Drivers</Link>
          <Link to="/teams" className="hover:underline">Teams</Link>
        </nav>
      </div>
    </header>
  );

  export default Header;