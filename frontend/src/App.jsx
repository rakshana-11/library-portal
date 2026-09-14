import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public & Common Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

// Book Pages
import BookList from './pages/books/BookList';
import BookDetails from './pages/books/BookDetails';
import AddBook from './pages/books/AddBook';
import EditBook from './pages/books/EditBook';

// Member Pages
import MemberList from './pages/members/MemberList';
import MemberDetails from './pages/members/MemberDetails';
import AddMember from './pages/members/AddMember';
import EditMember from './pages/members/EditMember';

// Loan Pages
import LoanList from './pages/loans/LoanList';
import LoanDetails from './pages/loans/LoanDetails';
import IssueBook from './pages/loans/IssueBook';

// User Admin Page
import UserList from './pages/users/UserList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="main-content flex-grow-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetails />} />

              {/* Protected Routes - Any Logged In User */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loans"
                element={
                  <ProtectedRoute>
                    <LoanList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loans/:id"
                element={
                  <ProtectedRoute>
                    <LoanDetails />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Librarian & Admin */}
              <Route
                path="/books/add"
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <AddBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <EditBook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <MemberList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/add"
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <AddMember />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <EditMember />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members/:id"
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin', 'member']}>
                    <MemberDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/loans/issue"
                element={
                  <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                    <IssueBook />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admin Only */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserList />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
