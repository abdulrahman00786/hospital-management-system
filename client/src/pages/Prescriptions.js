import { useEffect, useState } from "react";
import axios from "axios";

function Prescriptions() {

  const [prescriptions, setPrescriptions] = useState([]);

  const [prescription, setPrescription] = useState({
    patientId: "",
    doctorId: "",
    medicineName: "",
    dosage: "",
    duration: "",
    instructions: ""
  });

  const [loading, setLoading] = useState(false);

  

  const getPrescriptions = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/prescriptions"
      );

      if (response.data.success) {
        setPrescriptions(response.data.data);
      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    getPrescriptions();

  }, []);

 

  const handleChange = (e) => {

    setPrescription({

      ...prescription,
      [e.target.name]: e.target.value

    });

  };

 

  const addPrescription = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await axios.post(

        "http://localhost:5000/api/prescriptions",

        {
          ...prescription,
          patientId: Number(prescription.patientId),
          doctorId: Number(prescription.doctorId)
        }

      );

      console.log(response.data);

      alert("Prescription Added Successfully");

      setPrescription({

        patientId: "",
        doctorId: "",
        medicineName: "",
        dosage: "",
        duration: "",
        instructions: ""

      });

      getPrescriptions();

    } catch (error) {

      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        "Prescription Add Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="container mt-4">

      <h2>💊 Prescription Management</h2>

      <hr />

      <form onSubmit={addPrescription}>

  <input
          className="form-control mb-2"
          name="patientId"
          placeholder="Patient ID"
          value={prescription.patientId}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="doctorId"
          placeholder="Doctor ID"
          value={prescription.doctorId}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="medicineName"
          placeholder="Medicine Name"
          value={prescription.medicineName}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="dosage"
          placeholder="Dosage"
          value={prescription.dosage}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          name="duration"
          placeholder="Duration (e.g. 5 Days)"
          value={prescription.duration}
          onChange={handleChange}
          required
        />

        <textarea
          className="form-control mb-2"
          name="instructions"
          placeholder="Instructions"
          value={prescription.instructions}
          onChange={handleChange}
        />

        <button
          className="btn btn-success"
          disabled={loading}
        >

          {loading ? "Saving..." : "Add Prescription"}

        </button>

      </form>

      <hr />

      <h3>Prescription List</h3>

      <table className="table table-bordered">

        <thead className="table-dark">

          <tr>

            <th>ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Duration</th>
            <th>Instructions</th>

          </tr>

        </thead>

        <tbody>

          {

            prescriptions.length > 0 ?

              prescriptions.map((p) => (

                <tr key={p.id}>

                  <td>{p.id}</td>
                  <td>{p.patientId}</td>
                  <td>{p.doctorId}</td>
                  <td>{p.medicineName}</td>
                  <td>{p.dosage}</td>
                  <td>{p.duration}</td>
                  <td>{p.instructions}</td>

                </tr>

              ))

              :

              <tr>

                <td colSpan="7" className="text-center">

                  No Prescriptions Found

                </td>

              </tr>

          }

        </tbody>

      </table>

    </div>

  );

}

export default Prescriptions;