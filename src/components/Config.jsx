import React, { useState, useEffect } from 'react';
import { Pencil, Building2, UserCog, Lock, Coins, Save, CheckCircle2, LayoutDashboard} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

const Config = () => {
    // États pour les paramètres
    const [config, setConfig] = useState({
        nomSociete: localStorage.getItem('wifi_nomSociete') || 'Wifi Manager',
        nomAdmin: localStorage.getItem('wifi_nomAdmin') || 'Administrateur',
        password: '', // On ne l'affiche pas par sécurité au chargement
        devise: localStorage.getItem('wifi_devise') || 'Ar'
    });

    const [saved, setSaved] = useState(false);

    // Fonction de sauvegarde
    const handleSave = (e) => {
        e.preventDefault();

        localStorage.setItem('wifi_nomSociete', config.nomSociete);
        localStorage.setItem('wifi_nomAdmin', config.nomAdmin);
        localStorage.setItem('wifi_devise', config.devise);

        // On ne change le mot de passe que s'il a été saisi
        if (config.password.trim() !== "") {
            localStorage.setItem('wifi_password', config.password);
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);

        // Optionnel : Forcer le rechargement pour mettre à jour la Sidebar/Header
        // window.location.reload();
    };

    return (

        <div className="p-4 animate-fade-in">
            {/* Header de configuration */}


            <div className="row justify-content-center">
                <div className="col-12 col-xl-8">
                    <div className="card border-0">

                        <div className="p-2">
                            {/* Conteneur des informations de configuration */}
                            <div className="d-flex flex-column gap-3">

                                {/* Ligne Société */}
                                <div
                                    className="config d-flex align-items-center justify-content-between p-3 ">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 bg-white rounded-circle shadow-sm">
                                            <Building2 size={20} className="text-dark"/>
                                        </div>
                                        <div>
                                            <label className="text-muted small fw-bold mb-0"
                                                   style={{letterSpacing: '0.5px'}}>
                                                Société
                                            </label>
                                            <h6 className="m-0 fw-bold text-dark fs-5">{config.nomSociete}</h6>
                                        </div>
                                    </div>
                                </div>

                                {/* Ligne Administrateur */}
                                <div
                                    className="config d-flex align-items-center justify-content-between p-3 ">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 bg-white rounded-circle ">
                                            <UserCog size={20} className="text-dark"/>
                                        </div>
                                        <div>
                                            <label className="text-muted small fw-bold mb-0"
                                                   style={{letterSpacing: '0.5px'}}>
                                                Administrateur
                                            </label>
                                            <h6 className="m-0 fw-bold text-dark fs-5">{config.nomAdmin}</h6>
                                        </div>
                                    </div>
                                </div>

                                {/* Ligne Devise */}
                                <div
                                    className="config d-flex align-items-center justify-content-between p-3 ">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 bg-white rounded-circle shadow-sm">
                                            <Coins size={20} className="text-dark"/>
                                        </div>
                                        <div>
                                            <label className="text-muted small fw-bold mb-0"
                                                   style={{letterSpacing: '0.5px'}}>
                                                Unité Monétaire
                                            </label>
                                            <h6 className="m-0 fw-bold text-dark fs-5">{config.devise}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Bouton de modification */}
                            <nav className="mt-4 pt-3 border-top d-flex justify-content-end">

                                <NavLink
                                    to="/econfig"
                                    className="btn  px-4 py-2 d-flex align-items-center gap-2 hover-scale"
                                    style={{transition: 'all 0.2s'}}
                                >
                                    <Pencil size={20} className="text-light"/>

                                    <span className="fw-bold">Modifier</span>
                                </NavLink>
                            </nav>

                            <style>{`
        .hover-scale:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3) !important;
        }
       
    `}</style>
                        </div>


                    </div>
                </div>
            </div>

            <style>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .form-control:focus, .form-select:focus { 
                    background-color: #fff !important; 
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
                    border: 1px solid #0d6efd !important;
                }
            `}</style>
        </div>
    );
};

export default Config;