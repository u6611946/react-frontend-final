import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";

const API_URL = import.meta.env.VITE_API_URL;

export function BookDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/books/${id}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => { setBook(data); setForm(data); });
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`${API_URL}/api/books/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, author: form.author, quantity: form.quantity, location: form.location })
    });
    setEditing(false);
    const res = await fetch(`${API_URL}/api/books/${id}`, { credentials: "include" });
    setBook(await res.json());
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/books")}>← Back</button>
      <h2>Book Detail</h2>
      {editing && user.role === "ADMIN" ? (
        <div>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" style={{ display: "block", marginBottom: "8px" }} />
          <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Author" style={{ display: "block", marginBottom: "8px" }} />
          <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} placeholder="Quantity" style={{ display: "block", marginBottom: "8px" }} />
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" style={{ display: "block", marginBottom: "8px" }} />
          <button onClick={handleUpdate} style={{ marginRight: "10px" }}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Quantity:</strong> {book.quantity}</p>
          <p><strong>Location:</strong> {book.location}</p>
          <p><strong>Status:</strong> {book.status}</p>
          {user.role === "ADMIN" && (
            <button onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>
      )}
    </div>
  );
}