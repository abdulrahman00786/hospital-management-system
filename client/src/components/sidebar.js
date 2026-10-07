import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h4 className="text-center mb-4">🏥 HMS</h4>

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/">
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/doctors">
            Doctors
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/patients">
            Patients
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/appointments">
            Appointments
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/prescriptions">
            Prescriptions
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/billing">
            Billing
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;