
import { useEffect, useState } from "react";
import api from "../services/api";

function Patient() {
    const [patients, setPatients] = useState([]);

    const [patient, setPatient] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        address: ""
    });

    const [editId, setEditId] = useState(null);

    const getPatients = async () => {
        try {
            const response = await api.get("/patients");
            setPatients(response.data.data || []);
        } catch (error) {
            console.log(error);
            alert("Patients load nahi huay. Login dobara check karein.");
        }
    };

    useEffect(() => {
        getPatients();
    }, []);

    const handleChange = (e) => {
        setPatient({
            ...patient,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setEditId(null);
        setPatient({
            name: "",
            email: "",
            phone: "",
            age: "",
            gender: "",
            address: ""
        });
    };

    const savePatient = async (e) => {
        e.preventDefault();

        try {
            const patientData = {
                ...patient,
                age: Number(patient.age)
            };

            if (editId !== null) {
                await api.put(`/patients/${editId}`, patientData);
                alert("Patient Updated Successfully");
            } else {
                await api.post("/patients", patientData);
                alert("Patient Added Successfully");
            }

            resetForm();
            await getPatients();
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Operation Failed"
            );
        }
    };

    const editPatient = (p) => {
        setEditId(p.id);

        setPatient({
            name: p.name || "",
            email: p.email || "",
            phone: p.phone || "",
            age: p.age ?? "",
            gender: p.gender || "",
            address: p.address || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const deletePatient = async (id) => {
        const confirmed = window.confirm(
            `Kya aap Patient ID ${id} ko delete karna chahte hain?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/patients/${id}`);
            alert("Patient Deleted Successfully");
            await getPatients();

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
            <h2>🧑 Patient Management</h2>
            <hr />

            <form onSubmit={savePatient}>
                <input
                    className="form-control mb-2"
                    name="name"
                    placeholder="Patient Name"
                    value={patient.name}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={patient.email}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-2"
                    name="phone"
                    placeholder="Phone"
                    value={patient.phone}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-2"
                    type="number"
                    min="0"
                    name="age"
                    placeholder="Age"
                    value={patient.age}
                    onChange={handleChange}
                    required
                />

                <select
                    className="form-control mb-2"
                    name="gender"
                    value={patient.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <input
                    className="form-control mb-2"
                    name="address"
                    placeholder="Address"
                    value={patient.address}
                    onChange={handleChange}
                />

                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    {editId !== null ? "Update Patient" : "Add Patient"}
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
            <h3>Patient List</h3>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {patients.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.name}</td>
                                <td>{p.email}</td>
                                <td>{p.phone}</td>
                                <td>{p.age}</td>
                                <td>{p.gender}</td>
                                <td>{p.address}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        type="button"
                                        onClick={() => editPatient(p)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        type="button"
                                        onClick={() => deletePatient(p.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {patients.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No patients found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Patient;
