import React, { useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        email: "",
        reset_code: "",
        new_password: "",
        confirm_password: ""
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await axios.post("http://127.0.0.1:8000/password-reset-confirm/", formData);
            setSuccessMessage("Mot de passe réinitialisé avec succès!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setError("Code invalide ou expiré. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    <i className="pi pi-lock"></i> Réinitialiser le mot de passe
                </h2>
                {error && <Message severity="error" text={error} className="mb-4" />}
                {successMessage && <Message severity="success" text={successMessage} className="mb-4" />}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <InputText
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Code de vérification</label>
                        <InputText
                            name="reset_code"
                            value={formData.reset_code}
                            onChange={handleChange}
                            className="w-full mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                        <InputText
                            name="new_password"
                            type="password"
                            value={formData.new_password}
                            onChange={handleChange}
                            className="w-full mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                        <InputText
                            name="confirm_password"
                            type="password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="w-full mt-1"
                        />
                    </div>
                    <Button
                        type="submit"
                        label={isLoading ? "Traitement..." : "Réinitialiser"}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        disabled={isLoading}
                    />
                </form>
            </div>
        </div>
    );
}