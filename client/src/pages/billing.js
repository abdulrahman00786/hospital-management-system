import { useEffect, useState } from "react";
import api from "../services/api";

function Billing() {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [billing, setBilling] = useState({
    patientId: "",
    doctorId: "",
    amount: "",
    paymentStatus: "Pending",
    paymentMethod: "Cash"
  });

  const getBillings = async () => {
    try {
      const response = await api.get("/billing");
      setBillings(response.data.data || []);
    } catch (error) {
      console.log("Get Billing Error:", error);
    }
  };

  useEffect(() => {
    getBillings();
  }, []);

  const handleChange = (e) => {
    setBilling({
      ...billing,
      [e.target.name]: e.target.value
    });
  };

  const addBilling = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/billing", {
        ...billing,
        patientId: Number(billing.patientId),
        doctorId: Number(billing.doctorId),
        amount: Number(billing.amount)
      });

      alert(
        response.data.message ||
        "Billing Added Successfully"
      );

      setBilling({
        patientId: "",
        doctorId: "",
        amount: "",
        paymentStatus: "Pending",
        paymentMethod: "Cash"
      });

      await getBillings();
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        "Billing Add Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteBilling = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) {
      return;
    }

    try {
      await api.delete(`/billing/${id}`);

      alert("Billing Deleted Successfully");
      await getBillings();
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        "Billing Delete Failed"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>💰 Billing Management</h2>
      <hr />

      <form onSubmit={addBilling}>
        <input
          type="number"
          min="1"
          className="form-control mb-2"
          name="patientId"
          placeholder="Patient ID"
          value={billing.patientId}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          min="1"
          className="form-control mb-2"
          name="doctorId"
          placeholder="Doctor ID"
          value={billing.doctorId}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          min="0"
          step="0.01"
          className="form-control mb-2"
          name="amount"
          placeholder="Amount"
          value={billing.amount}
          onChange={handleChange}
          required
        />

        <select
          className="form-control mb-2"
          name="paymentStatus"
          value={billing.paymentStatus}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        <select
          className="form-control mb-2"
          name="paymentMethod"
          value={billing.paymentMethod}
          onChange={handleChange}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Online">Online</option>
        </select>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Bill"}
        </button>
      </form>

      <hr />

      <h3>Billing List</h3>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {billings.length > 0 ? (
              billings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.patientId}</td>
                  <td>{b.doctorId}</td>
                  <td>{b.amount}</td>
                  <td>{b.paymentStatus}</td>
                  <td>{b.paymentMethod}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteBilling(b.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Billing Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Billing;