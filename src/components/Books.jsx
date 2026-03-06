import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Books() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", quantity: 1, location: "" });

  const fetchBooks = async () => {
    const params = new URLSearchParams();
    if (title) params.append("title", title);
    if (author) params.append("author", author);
    const res = await fetch(`${API_URL}/api/books?${params}`, { credentials: "include" });
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleCreate = async () => {
    await fetch(`${API_URL}/api/books`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setShowCreate(false);
    setForm({ title: "", author: "", quantity: 1, location: "" });
    fetchBooks();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this book?")) return;
    await fetch(`${API_URL}/api/books/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    fetchBooks();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Books</h2>

      {/* Search */}
      <div style={{ marginBottom: "15px" }}>
        <input placeholder="Search by title" value={title} onChange={e => setTitle(e.target.value)} style={{ marginRight: "10px" }} />
        <input placeholder="Search by author" value={author} onChange={e => setAuthor(e.target.value)} style={{ marginRight: "10px" }} />
        <button onClick={fetchBooks}>Search</button>
      </div>

      {/* Create button - ADMIN only */}
      {user.role === "ADMIN" && (
        <button onClick={() => setShowCreate(!showCreate)} style={{ marginBottom: "15px" }}>
          {showCreate ? "Cancel" : "+ Add Book"}
        </button>
      )}

      {/* Create form */}
      {showCreate && user.role === "ADMIN" && (
        <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "15px" }}>
          <h4>New Book</h4>
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ display: "block", marginBottom: "8px" }} />
          <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} style={{ display: "block", marginBottom: "8px" }} />
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} style={{ display: "block", marginBottom: "8px" }} />
          <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={{ display: "block", marginBottom: "8px" }} />
          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      {/* Book list */}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>Quantity</th><th>Location</th>
            {user.role === "ADMIN" && <th>Status</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.quantity}</td>
              <td>{book.location}</td>
              {user.role === "ADMIN" && <td>{book.status}</td>}
              <td>
                <button onClick={() => navigate(`/books/${book._id}`)} style={{ marginRight: "5px" }}>View</button>
                {user.role === "ADMIN" && (
                  <button onClick={() => handleDelete(book._id)} style={{ color: "red" }}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}