import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password1: "",
        password2: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);

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
            const response = await axios.post("http://127.0.0.1:8000/register/", formData);
            console.log("Success!", response.data);
            setSuccessMessage("Registration Successful!");

            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.log("Error during registration!", error.response?.data);
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
                    <i className="pi pi-user-plus"></i> Register
                </h2>
                {error && <Message severity="error" text={error} className="mb-4" />}
                {successMessage && (
                    <Message severity="success" text={successMessage} className="mb-4" />
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <InputText
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full mt-1"
                            placeholder="Enter your username"
                        />
                    </div>
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
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password1" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <InputText
                            id="password1"
                            name="password1"
                            type="password"
                            value={formData.password1}
                            onChange={handleChange}
                            className="w-full mt-1"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div>
                        <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <InputText
                            id="password2"
                            name="password2"
                            type="password"
                            value={formData.password2}
                            onChange={handleChange}
                            className="w-full mt-1"
                            placeholder="Confirm your password"
                        />
                    </div>
                    <Button
                        type="submit"
                        label={isLoading ? "Registering..." : "Register"}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        disabled={isLoading}
                    />
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}