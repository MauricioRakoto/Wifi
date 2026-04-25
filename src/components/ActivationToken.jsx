import React, { useState } from 'react';
import { KeyRound, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

const ActivationToken = ({ onActivate }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleVerify = () => {
        // Logique de vérification (Exemple: code simple ou logique complexe)
        // Vous pouvez remplacer ceci par un appel API vers votre backend
        if (code === "Wifi-Exp-2020") {
            const dateExpiration = new Date();
            dateExpiration.setDate(dateExpiration.getDate() + 30);

            localStorage.setItem('wifi_token', code);
            localStorage.setItem('wifi_expiry', dateExpiration.toISOString());

            onActivate(true);
        } else {
            setError("Code d'activation invalide. Veuillez contacter l'administrateur.");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light"
             style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: '#f8f9fa' }}>
            <div className="card key border-0 shadow-lg rounded-4 p-4 text-center" style={{ maxWidth: '400px' }}>
                <div className="mb-4">
                    <div className="bg-dark bg-opacity-10 p-3 rounded-circle d-inline-block">
                        <KeyRound size={48} className="text-dark" />
                    </div>
                </div>

                <h2 className="fw-bold mb-2">Activation </h2>
                <p className="text-muted mb-4">
                    Cette application est protégée. Veuillez saisir votre code pour activer <strong>30 jours d'utilisation</strong>.
                </p>

                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control form-control-lg text-center fw-bold ${error ? 'is-invalid' : ''}`}
                        placeholder="XXXX-XXXX-XXXX"
                        value={code}
                        onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                        style={{ letterSpacing: '2px' }}
                    />
                    {error && <div className="invalid-feedback d-flex align-items-center justify-content-center gap-1 mt-2">
                        <AlertCircle size={14}/> {error}
                    </div>}
                </div>

                <div className="key-footer">
                    <button
                        onClick={handleVerify}
                        className="btn  w-100  py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
                    >
                        Activer
                    </button>
                </div>


            </div>
        </div>
    );
};

export default ActivationToken;