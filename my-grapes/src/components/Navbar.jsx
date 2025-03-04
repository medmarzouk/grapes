import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import api from "../api/Api_utils"; // Assurez-vous d'avoir une instance API configurée

const Navbar = () => {
    const { user, logout } = useAuth();
    const op = useRef(null);
    const navigate = useNavigate(); // Use useNavigate instead of Navigate

    const handleLogout = async () => {
        try {
            await api.post("/logout/", { refresh: localStorage.getItem("refreshToken") });
            logout();
        } catch (error) {
            console.error("Erreur de déconnexion :", error);
        }
    };

    return (
        <nav className="bg-white shadow-lg px-6 py-2 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <img src="/LogoProsoft2018.png" alt="Logo entreprise" className="h-12 w-auto" />
                <Link to="/" className="text-ml font-bold  text-gray-800">PRO No-Code</Link>
            </div>

            {/* Navigation & Utilisateur */}
            <div className="flex items-center space-x-4">
                {user ? (
                    <>
                        <span className="text-gray-700 font-mono ">{user.username}</span>
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
                                            onClick={()  => navigate('/')} // Use navigate function
                                        >
                                            <i className="pi pi-user"></i>
                                            <span>Voir Profil</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="w-full flex items-center space-x-2 text-left px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                                            onClick={()  =>  window.location.href = 'http://localhost:5173/chat'} // Use navigate function
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
                        <Link to="/login" className="p-button p-button-text flex items-center space-x-2">
                            <i className="pi pi-sign-in"></i>
                            <span>Connexion</span>
                        </Link>
                        <Link to="/register" className="p-button p-button-text flex items-center space-x-2">
                            <i className="pi pi-user-plus"></i>
                            <span>Inscription</span>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;