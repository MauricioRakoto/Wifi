import React, { useState } from 'react';
import { UserCircle, X, Settings } from 'lucide-react';
import Config from './Config'; // Importez votre composant de configuration

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const nomAdmin = localStorage.getItem('wifi_nomAdmin') || 'Administrateur';

    return (
        <>
            <header className="d-flex justify-content-end align-items-center border-bottom shadow-sm bg-white">
                <div className="d-flex align-items-center gap-2 px-3 py-1">
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-link p-0 text-dark border-0 shadow-none d-flex align-items-center"
                    >
                        <UserCircle size={24} />
                    </button>
                    <h4 className="m-0 fw-bold text-dark" style={{fontSize: '0.95rem'}}>
                        {nomAdmin}
                    </h4>
                </div>
            </header>

            {/* MODAL DE CONFIGURATION */}
            {showModal && (
                <div className="modal-overlay settings">
                    <div className="modal-content-custom shadow-lg rounded-4 animate-slide-up">
                        <div className="modal-header-custom d-flex justify-content-between align-items-center p-4 border-bottom">
                            <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                                <Settings size={20} />
                                Paramètres du compte
                            </h5>
                            <button className="btn btn-light rounded-circle p-2" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body-custom p-2">
                            {/* On appelle le composant Config ici */}
                            <Config />
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

export default Header;