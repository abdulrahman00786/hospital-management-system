
import { Link } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        user = null;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const linkStyle = "text-white text-decoration-none mb-3";

    return (
        <div
            className="bg-dark text-white"
            style={{
                width: "250px",
                minHeight: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                padding: "15px",
                overflowY: "auto"
            }}
        >
            <h3 className="text-center">🏥 HMS</h3>

            <p className="text-center small">
                Hospital Management System
            </p>

            <hr />

            <div className="d-flex flex-column">
                <Link to="/" className={linkStyle}>
                    🏠 Dashboard
                </Link>

                {token && user?.role === "admin" && (
                    <Link to="/doctors" className={linkStyle}>
                        👨‍⚕️ Doctors
                    </Link>
                )}

                <Link to="/patients" className={linkStyle}>
                    🧑 Patients
                </Link>

                <Link to="/appointments" className={linkStyle}>
                    📅 Appointments
                </Link>

                {token && (
                    <Link to="/ai-assistant" className={linkStyle}>
                        🤖 Hospital AI Assistant
                    </Link>
                )}

                {token &&
                    (user?.role === "admin" || user?.role === "doctor") && (
                        <Link to="/prescriptions" className={linkStyle}>
                            💊 Prescriptions
                        </Link>
                    )}

                {token &&
                    (user?.role === "admin" || user?.role === "staff") && (
                        <Link to="/billing" className={linkStyle}>
                            💰 Billing
                        </Link>
                    )}

                <hr />

                {token ? (
                    <>
                        <div className="card bg-dark border-light text-white mb-3">
                            <div className="card-body text-center">
                                <div
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        background: "#0d6efd",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "auto",
                                        fontSize: "35px"
                                    }}
                                >
                                    👤
                                </div>

                                <h5 className="mt-3">{user?.name}</h5>

                                <span className="badge bg-success">
                                    {user?.role}
                                </span>

                                <p className="small mt-3 mb-0">
                                    📧 {user?.email}
                                </p>
                            </div>
                        </div>

                        <button
                            className="btn btn-danger w-100"
                            onClick={logout}
                        >
                            🚪 Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="btn btn-light w-100 mb-2"
                        >
                            🔐 Login
                        </Link>

                        <Link
                            to="/register"
                            className="btn btn-success w-100"
                        >
                            📝 Register
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;
