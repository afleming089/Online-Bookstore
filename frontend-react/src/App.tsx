import type { JSX } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./contexts/AuthContext.js";
import BooksPage from "./pages/Books.js";
import CartPage from "./pages/Cart.js";
import CheckoutSuccess from "./pages/CheckoutSuccess.js";
import LoginPage from "./pages/Login.js";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? " active" : ""}`;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-pill">OB</span>
          <div>
            <div>Online Bookstore</div>
            <small className="brand-subtitle">Curated reads for every mood</small>
          </div>
        </div>
        <div className="app-nav">
          <NavLink to="/books" className={navClass}>
            Books
          </NavLink>
          <NavLink to="/cart" className={navClass}>
            Cart
          </NavLink>
          {isAuthenticated ? (
            <>
              <span className="user-pill">
                {user?.username}
                {user?.role && <span className="user-role">{user.role}</span>}
              </span>
              <button className="ghost-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="primary-button nav-login">
              Login
            </NavLink>
          )}
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <CartPage />
              </RequireAuth>
            }
          />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
