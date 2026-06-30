import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

import { useFirebase } from "./context/Firebase";
import './App.css'; // <--- This imports your styles
function App() {
  const firebase = useFirebase();

  if (firebase.loading) {
    return (
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </h1>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          firebase.user ? (
            <Navigate to="/" replace />
          ) : (
            <Auth />
          )
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute user={firebase.user}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={firebase.user ? "/" : "/auth"} replace />}
      />
    </Routes>
  );
}

export default App;