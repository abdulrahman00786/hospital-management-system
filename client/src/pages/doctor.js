
import { useEffect, useState } from "react";
import api from "../services/api";

function Doctor() {
    const [doctors, setDoctors] = useState([]);

    const [doctor, setDoctor] = useState({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: ""
    });

    const [editId, setEditId] = useState(null);

    const getDoctors = async () => {
        try {
            const response = await api.get("/doctors");
            setDoctors(response.data.data || []);
        } catch (error) {
            console.log(error);
            alert("Doctors load nahi huay. Login aur token check karein.");
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const handleChange = (e) => {
        setDoctor({
            ...doctor,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setEditId(null);
        setDoctor({
            name: "",
            email: "",
            phone: "",
            specialization: "",
            experience: ""
        });
    };

    const saveDoctor = async (e) => {
        e.preventDefault();

        try {
            const doctorData = {
                ...doctor,
                experience: Number(doctor.experience)
            };

            if (editId !== null) {
                await api.put(`/doctors/${editId}`, doctorData);
                alert("Doctor Updated Successfully");
            } else {
                await api.post("/doctors", doctorData);
                alert("Doctor Added Successfully");
            }

            resetForm();
            await getDoctors();
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Operation Failed"
            );
        }
    };

    const editDoctor = (doc) => {
        setEditId(doc.id);

        setDoctor({
            name: doc.name || "",
            email: doc.email || "",
            phone: doc.phone || "",
            specialization: doc.specialization || "",
            experience: doc.experience ?? ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const deleteDoctor = async (id) => {
        const confirmed = window.confirm(
            `Kya aap Doctor ID ${id} ko delete karna chahte hain?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/doctors/${id}`);
            alert("Doctor Deleted Successfully");
            await getDoctors();

            if (editId === id) {
                resetForm();
            }
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Delete Failed"
            );
        }
    };

    return (
        <div className="container mt-4">
            <h2>👨‍⚕️ Doctor Management</h2>
            <hr />

            <form onSubmit={saveDoctor}>
                <input
                    className="form-control mb-2"
                    name="name"
                    placeholder="Doctor Name"
                    value={doctor.name}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={doctor.email}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-2"
                    name="phone"
                    placeholder="Phone"
                    value={doctor.phone}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-2"
                    name="specialization"
                    placeholder="Specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="number"
                    min="0"
                    name="experience"
                    placeholder="Experience"
                    value={doctor.experience}
                    onChange={handleChange}
                    required
                />

                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    {editId !== null ? "Update Doctor" : "Add Doctor"}
                </button>

                {editId !== null && (
                    <button
                        className="btn btn-secondary ms-2"
                        type="button"
                        onClick={resetForm}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <hr />
            <h3>Doctor List</h3>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {doctors.map((doc) => (
                            <tr key={doc.id}>
                                <td>{doc.id}</td>
                                <td>{doc.name}</td>
                                <td>{doc.email}</td>
                                <td>{doc.phone}</td>
                                <td>{doc.specialization}</td>
                                <td>{doc.experience}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        type="button"
                                        onClick={() => editDoctor(doc)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        type="button"
                                        onClick={() => deleteDoctor(doc.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {doctors.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No doctors found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Doctor;
