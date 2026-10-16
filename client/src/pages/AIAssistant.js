
import { useState } from "react";
import axios from "axios";

function AIAssistant() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const [appointmentId, setAppointmentId] = useState("");
    const [action, setAction] = useState("view");
    const [pendingAction, setPendingAction] = useState(null);
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [agentMessage, setAgentMessage] = useState("");
    const [agentLoading, setAgentLoading] = useState(false);

    // AI Assistant
    const askAI = async (e) => {
        e.preventDefault();

        if (!question.trim()) {
            alert("Please enter a question.");
            return;
        }

        try {
            setLoading(true);
            setAnswer("");

            const response = await axios.post(
                "http://localhost:5000/api/ai",
                { question }
            );

            setAnswer(response.data.answer);
        } catch (error) {
            setAnswer(
                error.response?.data?.message ||
                "AI Assistant se connection nahi ho saka."
            );
        } finally {
            setLoading(false);
        }
    };

    // Appointment Agent request
    const requestAppointmentAction = async (e) => {
        e.preventDefault();

        if (!appointmentId.trim() || Number(appointmentId) < 1) {
            setAgentMessage("Valid Appointment ID enter karein.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setAgentMessage("Pehle login karein. Login token nahi mila.");
            return;
        }

        try {
            setAgentLoading(true);
            setAgentMessage("");
            setPendingAction(null);
            setAppointmentDetails(null);

            const response = await axios.post(
                "http://localhost:5000/api/appointment-agent",
                {
                    appointmentId: Number(appointmentId),
                    action,
                    confirmed: false
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            if (action === "view") {
                setAppointmentDetails(response.data.appointment || null);
                setAgentMessage(response.data.message);
            } else if (response.data.confirmationRequired) {
                setPendingAction({
                    appointmentId: Number(appointmentId),
                    action
                });

                setAppointmentDetails(response.data.appointment || null);
                setAgentMessage(response.data.message);
            } else {
                setAgentMessage(response.data.message);
            }
        } catch (error) {
            setAgentMessage(
                error.response?.data?.message ||
                "Appointment request complete nahi ho saki."
            );
        } finally {
            setAgentLoading(false);
        }
    };

    // Confirm approve/cancel action
    const confirmAppointmentAction = async () => {
        if (!pendingAction) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setAgentMessage("Pehle login karein.");
            setPendingAction(null);
            return;
        }

        try {
            setAgentLoading(true);
            setAgentMessage("");

            const response = await axios.post(
                "http://localhost:5000/api/appointment-agent",
                {
                    appointmentId: pendingAction.appointmentId,
                    action: pendingAction.action,
                    confirmed: true
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setAgentMessage(response.data.message);
            setPendingAction(null);

            // Update details after successful action
            if (response.data.appointment) {
                setAppointmentDetails((previous) => ({
                    ...(previous || {}),
                    ...response.data.appointment
                }));
            }
        } catch (error) {
            setAgentMessage(
                error.response?.data?.message ||
                "Appointment update nahi ho saki."
            );
        } finally {
            setAgentLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2>🏥 Hospital AI Assistant</h2>

            <p>
                Doctors, patients aur appointments ke baare mein sawal poochhein.
            </p>

            <form onSubmit={askAI}>
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Example: How many doctors are there?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Please wait..." : "Ask AI"}
                </button>
            </form>

            {answer && (
                <div className="alert alert-info mt-4">
                    <strong>Assistant:</strong>
                    <div style={{ whiteSpace: "pre-line" }}>
                        {answer}
                    </div>
                </div>
            )}

            <hr className="my-5" />

            <h3>🤖 AI Appointment Agent</h3>

            <p>
                Appointment ki details check karein, approve karein ya cancel karein.
                Approve aur cancel karne se pehle confirmation li jayegi.
            </p>

            <form onSubmit={requestAppointmentAction}>
                <label className="form-label">Appointment ID</label>

                <input
                    className="form-control mb-3"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Example: 4"
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    required
                />

                <label className="form-label">Action</label>

                <select
                    className="form-select mb-3"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                >
                    <option value="view">View Appointment Details</option>
                    <option value="approve">Approve Appointment</option>
                    <option value="cancel">Cancel Appointment</option>
                </select>

                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={agentLoading}
                >
                    {agentLoading ? "Please wait..." : "Run Agent"}
                </button>
            </form>

            {agentMessage && (
                <div className="alert alert-info mt-3">
                    {agentMessage}
                </div>
            )}

            {appointmentDetails && (
                <div className="card mt-3">
                    <div className="card-header bg-primary text-white">
                        <strong>Appointment Details</strong>
                    </div>

                    <div className="card-body">
                        <p>
                            <strong>Appointment ID:</strong>{" "}
                            {appointmentDetails.id ?? appointmentDetails.appointmentId}
                        </p>

                        <p>
                            <strong>Patient ID:</strong>{" "}
                            {appointmentDetails.patientId ?? "N/A"}
                        </p>

                        <p>
                            <strong>Doctor ID:</strong>{" "}
                            {appointmentDetails.doctorId ?? "N/A"}
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {appointmentDetails.date ??
                             appointmentDetails.appointmentDate ??
                             "N/A"}
                        </p>

                        <p>
                            <strong>Time:</strong>{" "}
                            {appointmentDetails.time ??
                             appointmentDetails.appointmentTime ??
                             "N/A"}
                        </p>

                        <p className="mb-0">
                            <strong>Status:</strong>{" "}
                            {appointmentDetails.status ??
                             appointmentDetails.currentStatus ??
                             "N/A"}
                        </p>
                    </div>
                </div>
            )}

            {pendingAction && (
                <div className="alert alert-warning mt-3">
                    <strong>Confirmation Required</strong>

                    <p>
                        Kya aap Appointment ID{" "}
                        {pendingAction.appointmentId} ko{" "}
                        {pendingAction.action} karna chahte hain?
                    </p>

                    <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={confirmAppointmentAction}
                        disabled={agentLoading}
                    >
                        {agentLoading ? "Please wait..." : "Yes, Confirm"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setPendingAction(null);
                            setAgentMessage("Action cancel kar diya gaya.");
                        }}
                        disabled={agentLoading}
                    >
                        No, Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default AIAssistant;
