import React, { useState } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useNavigate, Link } from "react-router-dom"; 

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", formData);
            console.log("Success!", response.data);
            setSuccessMessage("Login Successful!");
            localStorage.setItem("accessToken", response.data.tokens.access);
            localStorage.setItem("refreshToken", response.data.tokens.refresh);
            navigate("/");
        } catch (error) {
            console.log("Error during Login!", error.response?.data);
            if (error.response && error.response.data) {
                Object.keys(error.response.data).forEach((field) => {
                    const errorMessages = error.response.data[field];
                    if (errorMessages && errorMessages.length > 0) {
                        setError(errorMessages[0]);
                    }
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    <i className="pi pi-sign-in"></i> Se connecter
                </h2>
                {error && <Message severity="error" text={error} className="mb-4" />}
                {/* {successMessage } */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <InputText
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-1"
                            placeholder="Entrez votre email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mot de passe
                        </label>
                        <InputText
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full mt-1"
                            placeholder="Enter your password"
                        />
                    </div>
                    <Button
                        type="submit"
                        label={isLoading ? "Connexion..." : "Se connecter"}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        disabled={isLoading}
                    />
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                             Vous n'avez pas de compte?{" "}
                            <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                             Inscrivez-vous ici
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}