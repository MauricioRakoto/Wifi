import React, { useState } from 'react';
import { Play, Square, Clock, Database, CircleDollarSign, Monitor, User } from 'lucide-react';

const Utiliser = () => {
    // Exemple de données (plus tard, cela viendra de votre serveur)
    const [sessions, setSessions] = useState([
        {
            id: 1,
            nomPoste: "POSTE-01",
            debut: "14:00:10",
            fin: "--:--:--",
            total: "00:25:45",
            volume: "1.2 GB",
            prix: "1500 Ar",
            actif: true
        },
        {
            id: 2,
            nomPoste: "POSTE-05",
            debut: "13:15:00",
            fin: "14:15:00",
            total: "01:00:00",
            volume: "450 MB",
            prix: "3000 Ar",
            actif: false
        }
    ]);

    return (
        <div className="p-2">
            <div className="row mt-4 g-3">
                <div className="col-md-4">
                    <div className="bg-white p-3 rounded-4 shadow-sm border-start border-primary border-4">
                        <p className="text-muted small mb-1">Recette Totale Session</p>
                        <h4 className="fw-bold m-0 text-primary">4500 Ar</h4>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bg-white p-3 rounded-4 shadow-sm border-start border-info border-4">
                        <p className="text-muted small mb-1">Volume Total Utilisé</p>
                        <h4 className="fw-bold m-0 text-info">1.65 GB</h4>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ marginTop: '40px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-primary text-white">
                        <tr>
                            <th className="px-4 py-3 border-0">Poste</th>
                            <th className="py-3 border-0">Début</th>
                            <th className="py-3 border-0">Fin</th>
                            <th className="py-3 border-0">Total</th>
                            <th className="py-3 border-0">Volume</th>
                            <th className="py-3 border-0">Prix</th>
                            <th className="py-3 border-0 text-center">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sessions.map((session) => (
                            <tr key={session.id}>
                                <td className="px-4 py-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <Monitor size={18} className="text-primary" />
                                        <span className="fw-bold">{session.nomPoste}</span>
                                    </div>
                                </td>
                                <td className="py-3 text-secondary">{session.debut}</td>
                                <td className="py-3 text-secondary">{session.fin}</td>
                                <td className="py-3">
                                    <div className="d-flex align-items-center gap-2 text-dark fw-medium">
                                        <Clock size={16} className="text-warning" />
                                        {session.total}
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <Database size={16} className="text-info" />
                                        {session.volume}
                                    </div>
                                </td>
                                <td className="py-3">
                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                                            <CircleDollarSign size={14} className="me-1" />
                                            {session.prix}
                                        </span>
                                </td>
                                <td className="py-3 text-center">
                                    {session.actif ? (
                                        <button className="btn btn-danger btn-sm rounded-3 px-3 d-inline-flex align-items-center gap-2">
                                            <Square size={14} fill="currentColor" /> Arrêter
                                        </button>
                                    ) : (
                                        <span className="text-muted small italic text-decoration-line-through">Terminé</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

                {/* RÉSUMÉ RAPIDE EN BAS */}
                <div className="row mt-4 g-3">

                </div>
            </div>
    );
};

export default Utiliser;