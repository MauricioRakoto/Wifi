import React, { useState } from 'react';
import { Settings, CheckCircle2 } from 'lucide-react'; // Ajout de l'icône de succès

const SetupScreen = ({ onComplete }) => {
    const [data, setData] = useState({
        nomSociete: '',
        nomAdmin: '',
        devise: 'Ar'
    });

    // Nouvel état pour gérer l'affichage du succès
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCapitalize = (val) => {
        if (!val) return "";
        return val.charAt(0).toUpperCase() + val.slice(1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const configJson = {
            nomSociete: data.nomSociete.trim(),
            nomAdmin: data.nomAdmin.trim(),
            devise: data.devise,
            version: "1.0.0",
            dateInstallation: new Date().toLocaleDateString()
        };

        if (configJson.nomSociete && configJson.nomAdmin) {
            // 1. On affiche le succès visuellement
            setIsSuccess(true);

            // 2. On attend 1.5 seconde pour laisser l'utilisateur voir le message
            setTimeout(() => {
                // IMPORTANT : On envoie l'objet configJson, pas la chaîne 'configJson'
                onComplete(configJson);
            }, 1500);
        }
    };

    // --- RENDU DU SUCCÈS ---
    if (isSuccess) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
                <div className="text-center animate-fade-in">
                    <div className="mb-3 text-success">
                        <CheckCircle2 size={80} className="animate-bounce" />
                    </div>
                    <h2 className="fw-bold text-dark">Initialisation réussie !</h2>
                    <p className="text-muted">Votre application est prête. Redirection en cours...</p>
                </div>
            </div>
        );
    }

    // --- RENDU DU FORMULAIRE ---
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-primary bg-opacity-10">
            <div className="config-int shadow-lg border-0 rounded-4 p-4 animate-fade-in bg-white" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-dark">Configuration Initiale</h3>
                    <p className="text-muted small">Bienvenue ! Veuillez configurer votre espace.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary">NOM DE LA SOCIÉTÉ</label>
                        <input
                            type="text"
                            className="form-control form-control-lg border-0 bg-light"
                            placeholder="Ex: My Wifi"
                            value={data.nomSociete}
                            onChange={(e) => setData({...data, nomSociete: handleCapitalize(e.target.value)})}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold small text-secondary">NOM DE L'ADMINISTRATEUR</label>
                        <input
                            type="text"
                            className="form-control form-control-lg border-0 bg-light"
                            placeholder="Votre nom"
                            value={data.nomAdmin}
                            onChange={(e) => setData({...data, nomAdmin: handleCapitalize(e.target.value)})}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold small text-secondary">UNITÉ MONÉTAIRE</label>
                        <select
                            className="form-select form-select-lg border-0 bg-light"
                            value={data.devise}
                            onChange={(e) => setData({...data, devise: e.target.value})}
                        >
                            <option value="Ar">Ariary (Ar)</option>
                            <option value="€">Euro (€)</option>
                            <option value="$">Dollar ($)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-3 rounded-pill shadow">
                        Démarrer
                    </button>
                </form>
            </div>

            <style>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                .animate-bounce { animation: bounce 1s infinite; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
};

export default SetupScreen;