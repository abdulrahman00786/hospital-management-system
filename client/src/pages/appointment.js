import { useEffect, useState } from "react";
import axios from "axios";

function Appointment() {

  const [appointments, setAppointments] = useState([]);

  const [appointment, setAppointment] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    status: "pending"
  });

  const [loading, setLoading] = useState(false);

  

  const getAppointments = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/appointments"
      );

      console.log("Appointment Data:", response.data);

      if (response.data.success) {
        setAppointments(response.data.data);
      }

    } catch (error) {

      console.log("Get Appointment Error:", error);

    }

  };

  useEffect(() => {

    getAppointments();

  }, []);

  

  const handleChange = (e) => {

    setAppointment({

      ...appointment,

      [e.target.name]: e.target.value

    });

  };

  

  const addAppointment = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/appointments",
        {
          patientId: Number(appointment.patientId),
          doctorId: Number(appointment.doctorId),
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          status: appointment.status
        }
      );

      console.log("Appointment Added:", response.data);

      alert("Appointment Added Successfully");

      setAppointment({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        status: "pending"
      });

      getAppointments();

    } catch (error) {

      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        "Appointment Add Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container mt-4">

      <h2>📅 Appointment Management</h2>

      <hr />

      <form onSubmit={addAppointment}>

        <input
          className="form-control mb-2"
          name="patientId"
          placeholder="Patient ID"
          value={appointment.patientId}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="doctorId"
          placeholder="Doctor ID"
          value={appointment.doctorId}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          className="form-control mb-2"
          name="appointmentDate"
          value={appointment.appointmentDate}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          className="form-control mb-2"
          name="appointmentTime"
          value={appointment.appointmentTime}
          onChange={handleChange}
          required
        />

        <select
          className="form-control mb-2"
          name="status"
          value={appointment.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Appointment"}
        </button>

      </form>

      <hr />

      <h3>Appointment List</h3>

      <table className="table table-bordered">

        <thead className="table-dark">

          <tr>
            <th>ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {appointments.length > 0 ? (

            appointments.map((a) => (

              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patientId}</td>
                <td>{a.doctorId}</td>
                <td>{a.appointmentDate}</td>
                <td>{a.appointmentTime}</td>
                <td>{a.status}</td>
              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="6" className="text-center">
                No Appointments Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

export default Appointment;