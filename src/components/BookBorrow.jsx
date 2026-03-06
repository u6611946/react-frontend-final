import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";

const API_URL = import.meta.env.VITE_API_URL;

const STATUSES = ["INIT", "ACCEPTED", "CLOSE-NO-AVAILABLE-BOOK", "CANCEL-ADMIN", "CANCEL-USER"];

export default function BookBorrow() {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ bookId: "", targetDate: "" });

  const fetchRequests = async () => {
    const res = await fetch(`${API_URL}/api/borrow`, { credentials: "include" });
    const data = await res.json();
    setRequests(data);
  };

  const fetchBooks = async () => {
    const res = await fetch(`${API_URL}/api/books`, { credentials: "include" });
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => { fetchRequests(); fetchBooks(); }, []);

  const handleCreate = async () => {
    if (!form.bookId || !form.targetDate) return alert("Please fill all fields");
    await fetch(`${API_URL}/api/borrow`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ bookId: "", targetDate: "" });
    fetchRequests();
  };

  const handleStatusUpdate = async (id, status) => {
    await fetch(`${API_URL}/api/borrow/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchRequests();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{user.role === "ADMIN" ? "Manage Borrow Requests" : "My Borrow Requests"}</h2>

      {/* Create request - USER only */}
      {user.role === "USER" && (
        <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
          <h4>New Borrow Request</h4>
          <select value={form.bookId} onChange={e => setForm({ ...form, bookId: e.target.value })} style={{ display: "block", marginBottom: "8px" }}>
            <option value="">-- Select a Book --</option>
            {books.map(b => <option key={b._id} value={b._id}>{b.title} by {b.author}</option>)}
          </select>
          <input type="date" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} style={{ display: "block", marginBottom: "8px" }} />
          <button onClick={handleCreate}>Submit Request</button>
        </div>
      )}

      {/* Requests table */}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Book ID</th>
            <th>Target Date</th>
            <th>Created At</th>
            <th>Status</th>
            {user.role === "ADMIN" && <th>Update Status</th>}
            {user.role === "USER" && <th>Cancel</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id}>
              <td>{r._id}</td>
              <td>{r.bookId}</td>
              <td>{new Date(r.targetDate).toLocaleDateString()}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>{r.status}</td>
              {user.role === "ADMIN" && (
                <td>
                  <select onChange={e => handleStatusUpdate(r._id, e.target.value)} defaultValue={r.status}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              )}
              {user.role === "USER" && r.status === "INIT" && (
                <td>
                  <button onClick={() => handleStatusUpdate(r._id, "CANCEL-USER")} style={{ color: "red" }}>Cancel</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}