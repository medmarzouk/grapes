import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    const [pages, setPages] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const toast = useRef(null);
    const navigate = useNavigate();

    // Récupération du token dans localStorage
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        // Vérifie si un token existe
        if (!token) {
            console.warn("Aucun token trouvé dans localStorage. Redirection ou affichage d'erreur.");
            // Par exemple, redirection vers la page de login :
            // navigate("/login");
            return;
        }

        console.log("Token récupéré depuis localStorage :", token);
        fetchPages();
        // eslint-disable-next-line
    }, []);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://127.0.0.1:8000/api/pages/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPages(response.data);
            console.log("Pages fetched:", response.data);
        } catch (error) {
            // Vérifiez la réponse pour comprendre la cause du 401
            console.error("Fetch error:", error);
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch pages",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setIsValid(false);
            return;
        }

        if (!token) {
            console.warn("Impossible de créer une page : token manquant.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:8000/api/pages/",
                { title },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPages((prevPages) => [...prevPages, response.data]);
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Page created successfully",
                life: 3000,
            });

            // Réinitialiser le formulaire et fermer la modal
            setTitle("");
            setShowForm(false);

            // Naviguer vers l'éditeur de la nouvelle page
            navigate(`/editor/${response.data.id}`);
        } catch (error) {
            console.error("Create error:", error);
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: error.response?.data?.slug || "Failed to create page",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (pageId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/pages/${pageId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPages((prevPages) => prevPages.filter((page) => page.id !== pageId));
            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Page deleted successfully",
                life: 3000,
            });
        } catch (error) {
            console.error("Delete error:", error);
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to delete page",
                life: 3000,
            });
        }
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Link to={`/editor/${rowData.id}`} className="p-button p-button-info p-button-text">
                    <i className="pi pi-pencil"></i>
                </Link>
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-text"
                    onClick={() => handleDelete(rowData.id)}
                />
            </div>
        );
    };

    const modalFooter = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => {
                    setShowForm(false);
                    setTitle("");
                    setIsValid(true);
                }}
            />
            <Button
                label="Create & Edit"
                icon="pi pi-check"
                className="p-button-primary"
                onClick={handleSubmit}
                loading={loading}
            />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Toast ref={toast} />
            <Navbar />

            <div className="flex-grow p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Mes pages</h1>
                        <Button
                            label="Créer une nouvelle page"
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-primary"
                            onClick={() => setShowForm(true)}
                        />
                    </div>

                    <Card className="shadow-lg">
                        <DataTable
                            value={pages}
                            loading={loading}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            emptyMessage="Aucune page trouvée"
                            className="p-datatable-gridlines"
                            sortField="created_at"
                            sortOrder={-1}
                        >
                            <Column
                                field="title"
                                header="Titre"
                                sortable
                                style={{ width: "25%" }}
                            />
                            <Column
                                field="slug"
                                header="Slug"
                                sortable
                                style={{ width: "25%" }}
                            />
                            <Column
                                field="created_at"
                                header="Créé"
                                sortable
                                body={(rowData) => formatDate(rowData.created_at)}
                                style={{ width: "20%" }}
                            />
                            <Column
                                field="updated_at"
                                header="Dernière modification"
                                sortable
                                body={(rowData) => formatDate(rowData.updated_at)}
                                style={{ width: "20%" }}
                            />
                            <Column
                                body={actionBodyTemplate}
                                headerStyle={{ width: "10%" }}
                                style={{ textAlign: "center" }}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>

            <Dialog
                visible={showForm}
                onHide={() => {
                    setShowForm(false);
                    setTitle("");
                    setIsValid(true);
                }}
                header="Create New Page"
                footer={modalFooter}
                className="w-11/12 md:w-1/2 lg:w-1/3"
            >
                <div className="p-fluid">
                    <div className="field">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Page Title
                        </label>
                        <InputText
                            id="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setIsValid(true);
                            }}
                            className={isValid ? "" : "p-invalid"}
                            placeholder="Enter page title"
                        />
                        {!isValid && (
                            <small className="p-error block mt-1">
                                Please enter a title for your page.
                            </small>
                        )}
                    </div>
                </div>
            </Dialog>

            <Footer />
        </div>
    );
};

export default Home;
