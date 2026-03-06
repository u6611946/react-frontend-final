import './App.css';
import { Route, Routes, Link } from 'react-router-dom';
import RequireAuth from './middleware/RequireAuth';
import Login from './components/Login';
import Logout from './components/Logout';
import Books from './components/Books';
import { BookDetail } from './components/BookDetail';
import BookBorrow from './components/BookBorrow';
import { useUser } from './contexts/UserProvider';

function Nav() {
  const { user } = useUser();
  if (!user.isLoggedIn) return null;
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/books" style={{ marginRight: '15px' }}>Books</Link>
      {user.role === 'USER' && <Link to="/borrow" style={{ marginRight: '15px' }}>My Borrow Requests</Link>}
      {user.role === 'ADMIN' && <Link to="/borrow" style={{ marginRight: '15px' }}>Manage Requests</Link>}
      <Link to="/logout">Logout</Link>
      <span style={{ marginLeft: '15px', color: '#666' }}>({user.role})</span>
    </nav>
  );
}

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/logout' element={<RequireAuth><Logout /></RequireAuth>} />
        {/* MODIFIED: Added book and borrow routes */}
        <Route path='/books' element={<RequireAuth><Books /></RequireAuth>} />
        <Route path='/books/:id' element={<RequireAuth><BookDetail /></RequireAuth>} />
        <Route path='/borrow' element={<RequireAuth><BookBorrow /></RequireAuth>} />
        <Route path='/' element={<RequireAuth><Books /></RequireAuth>} />
      </Routes>
    </>
  );
}

export default App;