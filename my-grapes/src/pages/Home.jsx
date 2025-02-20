import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

const Home = () => {
    const [pages, setPages] = useState([]);
    const [name, setName] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire modal

    const handleSubmit = () => {
        if (!name) {
            setIsValid(false);
        } else {
            setIsValid(true);
            // Ajouter la nouvelle page à la liste
            const newPage = {
                _id: Math.random().toString(36).substr(2, 9), // Génère un ID unique
                name: name,
                slug: name.toLowerCase().replace(/\s+/g, "-"), // Génère un slug
            };
            setPages([...pages, newPage]);

            // Réinitialiser le formulaire et masquer la modale
            setName("");
            setShowForm(false);
        }
    };

    // Footer de la modale (boutons)
    const modalFooter = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text p-button-danger"
                onClick={() => setShowForm(false)}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-primary"
                onClick={handleSubmit}
            />
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
           
            <Navbar />

            {/* Contenu principal */}
            <div className="flex-grow p-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Carte pour créer une page */}
                   
                        <div className=" flex justify-between items-center">
                            <h5 className="text-2xl font-semibold text-gray-800">Dashboard</h5>
                            <Button
                                label="Add a new page"
                                icon="pi pi-plus"
                                className="p-button-rounded p-button-info font-semibold"
                                onClick={() => setShowForm(true)}
                            />
                        </div>


                    {/* Carte pour afficher la liste des pages */}
                    <Card className="shadow-lg rounded-lg border-0">
                        <div className="mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">Pages List</h2>
                        </div>
                        <DataTable
                            value={pages}
                            emptyMessage="No Pages Available"
                            className="p-datatable-striped p-datatable-gridlines"
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25]}
                        >
                            <Column field="_id" header="ID" sortable style={{ minWidth: "100px" }} />
                            <Column field="name" header="Name" sortable style={{ minWidth: "150px" }} />
                            <Column field="slug" header="Slug" sortable style={{ minWidth: "150px" }} />
                            <Column
                                header="Action"
                                body={(rowData) => (
                                    <Link
                                        to={`/editor/${rowData._id}`}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Edit
                                    </Link>
                                )}
                                style={{ minWidth: "100px" }}
                            />
                        </DataTable>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Modale pour le formulaire */}
            <Dialog
                visible={showForm}
                onHide={() => setShowForm(false)}
                header="Create a New Page"
                footer={modalFooter}
                className="w-11/12 md:w-1/2 lg:w-1/3"
            >
                <form id="create-page" onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <InputText
                            id="name"
                            className={`w-full ${isValid ? "" : "p-invalid"}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of Page"
                        />
                        {!isValid && (
                            <small className="text-red-600 mt-1 block">
                                Please provide a valid name.
                            </small>
                        )}
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default Home;