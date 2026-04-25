import React, { useState } from 'react';
import {Building2, UserCog, Coins, Lock, Save, ArrowLeft, CheckCircle, Settings} from 'lucide-react';

const EditConfig = () => {

    // 1. Initialisation de l'état avec les valeurs actuelles du localStorage
    const [formData, setFormData] = useState({
        nomSociete: localStorage.getItem('wifi_nomSociete') || '',
        nomAdmin: localStorage.getItem('wifi_nomAdmin') || '',
        devise: localStorage.getItem('wifi_devise') || 'Ar'
    });

    const [isSaving, setIsSaving] = useState(false);

    // 2. Méthode pour gérer la sauvegarde
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulation d'un court délai pour l'expérience utilisateur
        setTimeout(() => {
            localStorage.setItem('wifi_nomSociete', formData.nomSociete);
            localStorage.setItem('wifi_nomAdmin', formData.nomAdmin);
            localStorage.setItem('wifi_devise', formData.devise);

            setIsSaving(false);

            // Retour à la page précédente (le modal ou le dashboard)
            navigate(-1);

            // Note : Si vos composants Sidebar/Header ne se mettent pas à jour,
            // vous pouvez utiliser window.location.reload() ou un contexte React.
        }, 600);
    };

    return (
        <form onSubmit={handleSubmit} className="econfig p-3 animate-fade-in">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="m-0 fw-bold d-flex align-items-center gap-2 text-dark">

                    Modifier le paramètre compte
                </h5>
            </div>

            <div className="card bg-transparent border-0">

                <div className="mb-4">
                            <label className="form-label"
                                   style={{letterSpacing: '1px'}}>
                                Nom de la Société
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Entrez le nom..."
                                onChange={(e) => setFormData({...formData, nomSociete: e.target.value})}
                            />

                    </div>
                <div className="mb-4">
                        {/* Ligne Administrateur */}

                        <label className="form-label" style={{letterSpacing: '1px'}}>
                            Administrateur
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nom de l'admin..."
                            onChange={(e) => setFormData({...formData, nomAdmin: e.target.value})}

                        />


                    </div>
                <div className="mb-4">
                    <label className="form-label"
                           style={{letterSpacing: '1px'}}>
                        Unité Monétaire
                    </label>
                    <select
                        className="form-control"
                        onChange={(e) => setFormData({...formData, devise: e.target.value})}
                    >
                        <option value="Ar">Ariary (Ar)</option>
                        <option value="€">Euro (€)</option>
                        <option value="$">Dollar ($)</option>
                    </select>

                </div>

                {/* Pied de formulaire avec bouton */}
                <div className="">
                    <button type="submit"
                            disabled={isSaving}
                            className="btn fw-bold d-flex ">

                        {isSaving ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <CheckCircle size={20} />
                        )}
                        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EditConfig;