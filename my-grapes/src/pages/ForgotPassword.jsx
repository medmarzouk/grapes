import React, { useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await axios.post("http://127.0.0.1:8000/password-reset-request/", { email });
            setSuccessMessage("Un code de réinitialisation a été envoyé à votre email");
            setError(null);
        } catch (error) {
            setError("Une erreur est survenue. Vérifiez votre email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    <i className="pi pi-key"></i> Mot de passe oublié
                </h2>
                {error && <Message severity="error" text={error} className="mb-4" />}
                {successMessage && <Message severity="success" text={successMessage} className="mb-4" />}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <InputText
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1"
                            placeholder="Entrez votre email"
                        />
                    </div>
                    <Button
                        type="submit"
                        label={isLoading ? "Envoi en cours..." : "Envoyer le code"}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        disabled={isLoading}
                    />
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                            Retour à la connexion
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}