
import { useEffect, useState } from "react";
import api from "../services/api";

function Appointment() {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [appointment, setAppointment] = useState({
        patientId: "",
        doctorId: "",
        appointmentDate: "",
        appointmentTime: ""
    });

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const loadData = async () => {
        try {
            const [appointmentRes, patientRes, doctorRes] =
                await Promise.all([
                    api.get("/appointments"),
                    api.get("/patients"),
                    api.get("/doctors")
                ]);

            setAppointments(appointmentRes.data.data || []);
            setPatients(patientRes.data.data || []);
            setDoctors(doctorRes.data.data || []);
        } catch (error) {
            console.error("Load Data Error:", error);
            alert(
                error.response?.data?.message ||
                "Data load nahi hua. Login aur server check karein."
            );
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAppointment((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const addAppointment = async (e) => {
        e.preventDefault();

        if (
            !appointment.patientId ||
            !appointment.doctorId ||
            !appointment.appointmentDate ||
            !appointment.appointmentTime
        ) {
            alert("Tamam fields fill karein.");
            return;
        }

        if (appointment.appointmentDate < getTodayDate()) {
            alert("Appointment ki date aaj ya future ki honi chahiye.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/appointments", {
                patientId: Number(appointment.patientId),
                doctorId: Number(appointment.doctorId),
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                status: "pending"
            });

            alert(
                response.data.message ||
                "Appointment successfully add ho gayi."
            );

            setAppointment({
                patientId: "",
                doctorId: "",
                appointmentDate: "",
                appointmentTime: ""
            });

            await loadData();
        } catch (error) {
            console.error("Add Appointment Error:", error);

            alert(
                error.response?.data?.message ||
                "Appointment add nahi ho saki."
            );
        } finally {
            setLoading(false);
        }
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(
            (p) => Number(p.id) === Number(patientId)
        );

        return patient ? patient.name : "Patient not found";
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(
            (d) => Number(d.id) === Number(doctorId)
        );

        return doctor ? doctor.name : "Doctor not found";
    };

    return (
        <div className="container mt-4">
            <h2>📅 Appointment Management</h2>
            <hr />

            <form onSubmit={addAppointment}>
                <label className="form-label">Select Patient</label>

                <select
                    className="form-select mb-3"
                    name="patientId"
                    value={appointment.patientId}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select Patient --</option>

                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name} (ID: {p.id})
                        </option>
                    ))}
                </select>

                <label className="form-label">Select Doctor</label>

                <select
                    className="form-select mb-3"
                    name="doctorId"
                    value={appointment.doctorId}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Select Doctor --</option>

                    {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name} - {d.specialization} (ID: {d.id})
                        </option>
                    ))}
                </select>

                <label className="form-label">Appointment Date</label>

                <input
                    type="date"
                    className="form-control mb-3"
                    name="appointmentDate"
                    min={getTodayDate()}
                    value={appointment.appointmentDate}
                    onChange={handleChange}
                    required
                />

                <label className="form-label">Appointment Time</label>

                <input
                    type="time"
                    className="form-control mb-3"
                    name="appointmentTime"
                    value={appointment.appointmentTime}
                    onChange={handleChange}
                    required
                />

                <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={loading || patients.length === 0 || doctors.length === 0}
                >
                    {loading ? "Adding..." : "Add Appointment"}
                </button>

                {patients.length === 0 && (
                    <p className="text-danger mt-2">
                        Pehle Patient add karein.
                    </p>
                )}

                {doctors.length === 0 && (
                    <p className="text-danger mt-2">
                        Pehle Doctor add karein.
                    </p>
                )}
            </form>

            <hr />
            <h3>Appointment List</h3>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Patient ID</th>
                            <th>Doctor</th>
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
                                    <td>{getPatientName(a.patientId)}</td>
                                    <td>{a.patientId}</td>
                                    <td>{getDoctorName(a.doctorId)}</td>
                                    <td>{a.doctorId}</td>
                                    <td>
                                        {String(a.appointmentDate).slice(0, 10)}
                                    </td>
                                    <td>{a.appointmentTime}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                a.status === "approved"
                                                    ? "bg-success"
                                                    : a.status === "cancelled"
                                                    ? "bg-danger"
                                                    : a.status === "completed"
                                                    ? "bg-primary"
                                                    : "bg-warning text-dark"
                                            }`}
                                        >
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No Appointments Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Appointment;
