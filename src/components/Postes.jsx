import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, Wifi, Search, ShieldCheck } from 'lucide-react';

const Postes = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les données du serveur Node.js
    const fetchDevices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/scanner');
            if (!response.ok) throw new Error('Erreur de connexion au serveur');
            const data = await response.json();
            setDevices(data);
        } catch (err) {
            setError("Impossible de charger les postes. Vérifiez que le serveur Node (port 5000) est lancé.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Charger la liste automatiquement au montage du composant
    useEffect(() => {
        fetchDevices();
    }, []);

    return (
        <div className="p-2">
            {/* EN-TÊTE DE PAGE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-primary btn-sm rounded-3 px-3"> Détails</button>
                    <button className="btn btn-outline-danger btn-sm rounded-3 px-2">Supprimer</button>
                </div>
                <button
                    onClick={fetchDevices}
                    className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-3 px-3"
                    disabled={loading}
                >
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    {loading ? 'Scan en cours...' : 'Actualiser'}
                </button>
            </div>

            {/* ALERT EN CAS D'ERREUR */}
            {error && (
                <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex align-items-center gap-3">
                    <ShieldCheck size={24} />
                    {error}
                </div>
            )}

            {/* TABLEAU DES POSTES */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3 border-0 text-muted small uppercase">Nom </th>
                            <th className="py-3 border-0 text-muted small uppercase">Appareil</th>
                            <th className="py-3 border-0 text-muted small uppercase">Status</th>

                            <th className="py-3 border-0 text-muted small uppercase text-end px-4">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {devices.length > 0 ? (
                            devices.map((device, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3">
                                        {/* BOUTON DÉMARRER L'UTILISATION */}
                                        <button
                                            className="btn btn-success btn-sm rounded-3 d-flex align-items-center gap-2 px-3 shadow-sm">
                                            <Play size={14} fill="currentColor"/>
                                            <span className="fw-medium">Démarrer</span>
                                        </button>

                                        {/* BOUTON SUPPRIMER */}
                                        <button
                                            className="btn btn-outline-danger btn-sm rounded-3 px-2"
                                            title="Supprimer">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                                                <Monitor size={20} />
                                            </div>
                                            <span className="fw-bold text-dark">
                                                    {device.name === '?' ? 'Appareil Inconnu' : device.name}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="py-3 font-monospace text-secondary">{device.ip}</td>
                                    <td className="py-3 font-monospace text-muted">{device.mac}</td>
                                    <td className="py-3 text-center">
                                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2">
                                                ● Connecté
                                            </span>
                                    </td>
                                    <td className="py-3 text-end px-4">
                                        <button className="btn btn-outline-primary btn-sm rounded-3">Gérer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            !loading && (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <Wifi size={48} className="mb-3 opacity-25" />
                                        <p>Aucun appareil trouvé. Cliquez sur Actualiser.</p>
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CSS POUR L'ANIMATION DU BOUTON */}
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spin {
                        animation: spin 1s linear infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default Postes;