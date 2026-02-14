import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
<AuthProvider>
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;
