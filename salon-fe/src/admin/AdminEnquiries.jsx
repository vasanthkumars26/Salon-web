import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaDoorClosed } from "react-icons/fa6";

// Dummy sendEmail function for now
const sendEmail = async ({ to, subject, message }) => {
  console.log("Email sent to:", to, { subject, message });
  // Replace with your nodemailer API call
};

const API = "https://salon-server-gurw.onrender.com/api/enquiries";

const statusStyles = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Closed: "bg-green-100 text-green-700",
};

const AdminEnquiries = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Fetch enquiries from backend
  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(API);
      setEnquiries(res.data);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    }
  };

  // Update status of enquiry
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/${id}`, { status });
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Send email reply
  const handleReply = async () => {
    if (!replyMessage) return;
    try {
      await sendEmail({
        to: selected.email,
        subject: "Response to Your Enquiry",
        message: replyMessage,
      });
      await updateStatus(selected._id, "Contacted");
      setReplyMessage("");
      setSelected(null);
      alert("Reply sent successfully!");
    } catch (err) {
      console.error("Failed to send email:", err);
      alert("Failed to send email.");
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 onClick={() => navigate("/admin")} className="bg-slate-300 mt-3  hover:text-blue-500 cursor-pointer hover:underline w-fit px-3 rounded-xl py-1 flex items-center m-3"><FaDoorClosed/> BACK</h1></div>
      <h2 className="text-3xl font-bold text-center m-3">Customer Enquiries</h2>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-2xl shadow overflow-hidden mx-auto justify-items-center">
        <table className="w-[75%] text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Customer</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {enquiries.map((e) => (
              <tr key={e._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{e.name}</td>
                <td>{e.email}</td>
                <td>{e.type}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[e.status]}`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="flex gap-3 py-4">
                  <button
                    onClick={() => setSelected(e)}
                    className="text-blue-600 hover:underline"
                  >
                    View / Reply
                  </button>
                  <button
                    onClick={() => updateStatus(e._id, "Contacted")}
                    className="text-yellow-600 hover:underline"
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => updateStatus(e._id, "Closed")}
                    className="text-green-600 hover:underline"
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 lg:hidden">
        {enquiries.map((e) => (
          <div key={e._id} className="bg-white rounded-xl shadow p-5 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{e.name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[e.status]}`}
              >
                {e.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">{e.email}</p>
            <p className="text-sm">{e.type}</p>

            <div className="flex gap-4 pt-3 text-sm">
              <button onClick={() => setSelected(e)} className="text-blue-600">
                View / Reply
              </button>
              <button
                onClick={() => updateStatus(e._id, "Contacted")}
                className="text-yellow-600"
              >
                Contacted
              </button>
              <button
                onClick={() => updateStatus(e._id, "Closed")}
                className="text-green-600"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW & REPLY MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-xl">
            <h3 className="text-xl font-bold mb-1">{selected.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{selected.email}</p>
            <p className="mb-4 text-gray-700">{selected.message}</p>

            <textarea
              rows="4"
              placeholder="Type your reply..."
              className="w-full border rounded-xl p-3 mb-4 focus:ring-2 focus:ring-pink-500 outline-none"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>
              <button
                onClick={handleReply}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
