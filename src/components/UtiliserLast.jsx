import React, { useState, useEffect } from 'react';
import { Monitor, Power, Trash2, Loader2, Database } from 'lucide-react';

const Utiliser = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempsActuel, setTempsActuel] = useState(new Date());

    // Horloge interne pour mettre à jour l'affichage chaque seconde
    useEffect(() => {
        const timer = setInterval(() => { setTempsActuel(new Date()); }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/sessions');
            const data = await response.json();
            setSessions(data.filter(s => s.status === 'En cours'));
        } catch (err) {
            console.error("Erreur de chargement des sessions");
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => { fetchSessions(); }, []);

    // --- FONCTION : CALCUL DU VOLUME POUR UNE SESSION PRÉCISE ---
    // On multiplie les minutes écoulées par 1.5 Mo
    const calculerVolumeSession = (debutHeure) => {
        const [h, m] = debutHeure.split(':').map(Number);
        const debut = new Date();
        debut.setHours(h, m, 0);

        let diffMs = tempsActuel - debut;
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // Gestion passage de minuit

        const minutes = Math.floor(diffMs / 60000);
        return (minutes * 1.5).toFixed(1); // Retourne le volume en Mo
    };

    // --- FONCTION : CALCUL DU VOLUME GLOBAL DU PARC ---
    const calculerVolumeGlobal = () => {
        const totalMo = sessions.reduce((acc, session) => {
            return acc + parseFloat(calculerVolumeSession(session.debutHeure));
        }, 0);

        return totalMo >= 1024
            ? `${(totalMo / 1024).toFixed(2)} Go`
            : `${totalMo.toFixed(1)} Mo`;
    };

    const handleTerminate = async (id, session) => {
        if (window.confirm(`Arrêter la session sur ${session.nomAppareil} ?`)) {
            const maintenant = new Date();
            const volumeMo = calculerVolumeSession(session.debutHeure);
            const volumeGo = (parseFloat(volumeMo) / 1024).toFixed(3);

            const [hDebut, mDebut] = session.debutHeure.split(':').map(Number);
            const debutDate = new Date();
            debutDate.setHours(hDebut, mDebut, 0);
            let diffMs = maintenant - debutDate;
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            const minutesConsommees = Math.floor(diffMs / 60000);

            const sessionUpdate = {
                status: 'Terminé',
                finHeure: maintenant.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                dureeMinutes: minutesConsommees,
                prixTotal: minutesConsommees * 47, // Utilisation de votre tarif à 47 Ar
                volumeTotal: volumeGo,
                createdAt: maintenant.toISOString()
            };

            try {
                const response = await fetch(`http://localhost:5000/api/sessions/terminer/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionUpdate),
                });
                if (response.ok) fetchSessions();
            } catch (err) {
                console.error("Erreur réseau :", err);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer définitivement cette session ?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/sessions/${id}`, { method: 'DELETE' });
                if (response.ok) setSessions(sessions.filter(s => s.id !== id));
            } catch (err) { console.error("Erreur suppression"); }
        }
    };

    const calculerDureeDynamique = (session) => {
        const [h, m] = session.debutHeure.split(':').map(Number);
        const debut = new Date(); debut.setHours(h, m, 0);
        let diffMs = tempsActuel - debut;
        if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
        const totalSec = Math.floor(diffMs / 1000);
        return `${Math.floor(totalSec / 3600)}h ${Math.floor((totalSec % 3600) / 60)}m ${totalSec % 60}s`;
    };

    return (
        <div className="p-2 animate-fade-in">
            <div className="total d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2">
                    <div className="stats bg-white d-flex align-items-center px-3 py-2 rounded-3 shadow-sm border">
                        <Database size={18} className="me-2 text-primary"/>
                        <h5 className="m-0 fw-bold">Données: {calculerVolumeGlobal()}</h5>
                    </div>
                    <div className="stats bg-white d-flex align-items-center px-3 py-2 rounded-3 shadow-sm border">
                        <Monitor size={18} className="me-2 text-primary"/>
                        <h5 className="m-0 fw-bold">{sessions.length} Postes</h5>
                    </div>
                </div>
            </div>

            <div className="data-session">
                <div className="row sh px-4 py-2 text-muted small fw-bold d-none d-md-flex mb-2">
                    <div className="col-1 pr text-uppercase">#</div>
                    <div className="col pr text-uppercase">Appareil</div>
                    <div className="col pr text-uppercase">Système</div>
                    <div className="col pr text-uppercase">Début</div>
                    <div className="col pr text-uppercase">Fin</div>
                    <div className="col pr text-uppercase">Durée</div>
                    <div className="col pr text-uppercase">Prix</div>
                    <div className="col pr text-uppercase">Volume</div>
                    <div className="col pr"></div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-transparent" style={{minHeight: '400px'}}>
                    {loading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
                            <Loader2 size={45} className="text-primary spin mb-3"/>
                            <span className="text-muted fw-medium">Calcul des consommations...</span>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {sessions.length === 0 ? (
                                <div className="text-center py-5 text-muted bg-white rounded-4 shadow-sm">
                                    Aucune session active.
                                </div>
                            ) : (
                                sessions.map((session, index) => {
                                    const volumeMo = calculerVolumeSession(session.debutHeure);
                                    const [h, m] = session.debutHeure.split(':').map(Number);
                                    const debut = new Date();
                                    debut.setHours(h, m, 0);
                                    const mins = Math.max(0, Math.floor((tempsActuel - debut) / 60000));

                                    return (
                                        <div key={session.id} className="row sb session-time bg-white rounded-3 mx-0 shadow-sm align-items-center py-2 border-start border-primary border-4">
                                            <div className="col-1 pr"><h6 className="m-0 fw-bold">{index + 1}</h6></div>
                                            <div className="col pr"><h6 className="m-0 text-dark">{session.nomAppareil}</h6></div>
                                            <div className="col pr"><h6 className="m-0 text-muted small">{session.systeme || "Windows"}</h6></div>
                                            <div className="col pr"><h6 className="m-0">{session.debutHeure}</h6></div>
                                            <div className="col pr"><h6 className="m-0">{session.finHeure || "∞"}</h6></div>
                                            <div className="col pr"><h6 className="m-0 text-primary fw-bold">{calculerDureeDynamique(session)}</h6></div>
                                            <div className="col pr"><h6 className="m-0 fw-bold">{(mins * 47).toLocaleString()} Ar</h6></div>
                                            <div className="col pr"><h6 className="m-0 text-info fw-bold">{volumeMo} Mo</h6></div>
                                            <div className="col pr text-end">
                                                <button onClick={() => handleTerminate(session.id, session)} className="btn btn-outline-danger btn-sm border-0"><Power size={18}/></button>
                                                <button onClick={() => handleDelete(session.id)} className="btn btn-outline-secondary btn-sm border-0"><Trash2 size={18}/></button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .session-time { transition: all 0.2s ease; }
                .session-time:hover { transform: translateX(5px); background-color: #f8fbff !important; }
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Utiliser;