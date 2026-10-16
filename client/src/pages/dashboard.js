import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    revenue: 0,
    recentPatients: [],
    recentAppointments: [],
    recentBills: []
  });

  const getDashboard = async () => {
    try {
      const response = await api.get("/dashboard");

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 bg-primary text-white mb-4">
        <h1>🏥 Hospital Management Dashboard</h1>
        <p>Complete Hospital Overview</p>
      </div>

      <div className="row">
        {[
          { title: "Doctors", icon: "👨‍⚕️", value: data.doctors },
          { title: "Patients", icon: "🧑", value: data.patients },
          { title: "Appointments", icon: "📅", value: data.appointments },
          { title: "Revenue", icon: "💰", value: `Rs ${data.revenue}` }
        ].map((item) => (
          <div className="col-md-3" key={item.title}>
            <div className="card shadow text-center p-3 mb-3">
              <h2>{item.icon}</h2>
              <h5>{item.title}</h5>
              <h2>{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <hr />
      <h3>🧑 Recent Patients</h3>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {data.recentPatients.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />
      <h3>📅 Recent Appointments</h3>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentAppointments.map((a) => (
              <tr key={a.id}>
                <td>{a.patientId}</td>
                <td>{a.doctorId}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />
      <h3>💰 Recent Billing</h3>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Patient ID</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentBills.map((b) => (
              <tr key={b.id}>
                <td>{b.patientId}</td>
                <td>Rs {b.amount}</td>
                <td>{b.paymentStatus ?? b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;