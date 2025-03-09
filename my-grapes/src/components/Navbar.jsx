import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import api from "../api/Api_utils";

const Navbar = () => {
  const { user, logout } = useAuth();
  const op = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Get refresh token from localStorage
    const refreshToken = localStorage.getItem("refreshToken");
    
    try {
      // Attempt to blacklist the token on the server
      await api.post("/logout/", { refresh: refreshToken });
      console.log("Logout successful on server");
    } catch (error) {
      // Log error but continue with client-side logout
      console.log("Server logout failed:", error.response?.data || error.message);
    } finally {
      // Always perform client-side logout regardless of server response
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-lg px-6 py-2">
      {/* Barre supérieure : logo + bouton hamburger + menu desktop */}
      <div className="flex items-center justify-between">
        {/* Logo et Titre */}
        <div className="flex items-center space-x-2">
          <img
            src="/LogoProsoft2018.png"
            alt="Logo entreprise"
            className="h-12 w-auto"
          />
          <Link to="/home" className="text-lg font-bold text-gray-800">
            PRO No-Code
          </Link>
        </div>

        {/* Bouton Hamburger visible seulement en mobile */}
        <div className="md:hidden">
          <Button
            icon="pi pi-bars"
            className="p-button-text p-button-plain"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          />
        </div>

        {/* Menu principal (desktop) : caché sur mobile */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700 font-mono">{user.username}</span>
              <Avatar
                icon="pi pi-user"
                size="large"
                shape="circle"
                className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                onClick={(e) => op.current.toggle(e)}
              />
              <OverlayPanel ref={op} className="p-0 shadow-lg">
                <div className="bg-white rounded-lg">
                  <ul className="space-y-2">
                    <li>
                      <button
                        className="w-full flex items-center space-x-2 text-left px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                        onClick={() => navigate("/")}
                      >
                        <i className="pi pi-user"></i>
                        <span>Voir Profil</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full flex items-center space-x-2 text-left px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                        onClick={() => navigate("/chat")}
                      >
                        <i className="pi pi-comments"></i>
                        <span>Chat</span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full flex items-center space-x-2 text-left px-6 py-3 text-red-600 hover:bg-gray-100 rounded-lg transition duration-200"
                        onClick={handleLogout}
                      >
                        <i className="pi pi-sign-out"></i>
                        <span>Déconnexion</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </OverlayPanel>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="p-button p-button-text flex items-center space-x-2"
              >
                <i className="pi pi-sign-in"></i>
                <span>Connexion</span>
              </Link>
              <Link
                to="/register"
                className="p-button p-button-text flex items-center space-x-2"
              >
                <i className="pi pi-user-plus"></i>
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menu mobile (seulement si menuOpen = true) */}
      {menuOpen && (
        <div className="md:hidden flex flex-col mt-2 space-y-2">
          {user ? (
            <>
              <div className="flex items-center space-x-2 p-2">
                <Avatar
                  icon="pi pi-user"
                  size="normal"
                  shape="circle"
                  className="bg-blue-500 text-white"
                />
                <span className="text-gray-700 font-mono">{user.username}</span>
              </div>
              <button
                className="w-full flex items-center space-x-2 text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                onClick={() => {
                  navigate("/");
                  setMenuOpen(false);
                }}
              >
                <i className="pi pi-user"></i>
                <span>Voir Profil</span>
              </button>
              <button
                className="w-full flex items-center space-x-2 text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                onClick={() => {
                  navigate("/chat");
                  setMenuOpen(false);
                }}
              >
                <i className="pi pi-comments"></i>
                <span>Chat</span>
              </button>
              <button
                className="w-full flex items-center space-x-2 text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg transition duration-200"
                onClick={handleLogout}
              >
                <i className="pi pi-sign-out"></i>
                <span>Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="p-button p-button-text flex items-center space-x-2 px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <i className="pi pi-sign-in"></i>
                <span>Connexion</span>
              </Link>
              <Link
                to="/register"
                className="p-button p-button-text flex items-center space-x-2 px-4 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <i className="pi pi-user-plus"></i>
                <span>Inscription</span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;