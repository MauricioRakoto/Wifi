import React, { useState, useEffect } from 'react';
import { Monitor, RefreshCw, Power, Trash2, Loader2, Database } from 'lucide-react';

const Utiliser = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tempsActuel, setTempsActuel] = useState(new Date());

    // Horloge interne pour les calculs en temps réel (Prix et Volume)
    useEffect(() => {
        const timer = setInterval(() => { setTempsActuel(new Date()); }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Lecture des sessions (VUE -> CONTROLLER)
    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/sessions');
            const data = await response.json();
            // On ne gère ici que l'affichage des sessions "En cours"
            setSessions(data.filter(s => s.status === 'En cours'));
        } catch (err) {
            console.error("Erreur de chargement des sessions");
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => { fetchSessions(); }, []);

    // --- FONCTIONALITÉ : CALCUL DU VOLUME GLOBAL DU PARC ---
    const calculerVolumeGlobal = () => {
        const totalMo = sessions.reduce((acc, session) => {
            const [h, m] = session.debutHeure.split(':').map(Number);
            const debut = new Date(); debut.setHours(h, m, 0);
            let diffMs = tempsActuel - debut;
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            return acc + (Math.floor(diffMs / 60000) * 1.5);
        }, 0);

        return totalMo >= 1024
            ? `${(totalMo / 1024).toFixed(2)} Go`
            : `${totalMo.toFixed(1)} Mo`;
    };

    // --- MÉTHODE MISE À JOUR : handleTerminate (MVC READY) ---
    const handleTerminate = async (id, session) => {
        if (window.confirm(`Arrêter la session sur ${session.nomAppareil} ?`)) {
            const maintenant = new Date();

            // Calcul final pour le stockage JSON
            const [hDebut, mDebut] = session.debutHeure.split(':').map(Number);
            const debutDate = new Date();
            debutDate.setHours(hDebut, mDebut, 0);

            let diffMs = maintenant - debutDate;
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            const minutesConsommees = Math.floor(diffMs / 60000);

            const prixFinal = minutesConsommees * 35;
            const volumeMo = minutesConsommees * 1.5;
            const volumeGo = (volumeMo / 1024).toFixed(3); // On stocke en Go pour le composant Stats

            // Objet conforme au Modèle attendu par le Controller
            const sessionUpdate = {
                status: 'Terminé',
                finHeure: maintenant.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                dureeMinutes: minutesConsommees,
                prixTotal: prixFinal,
                volumeTotal: volumeGo,
                createdAt: maintenant.toISOString() // Crucial pour le filtrage par date dans Stats
            };

            try {
                // Appel au Contrôleur via la route API
                const response = await fetch(`http://localhost:5000/api/sessions/terminer/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionUpdate),
                });

                if (response.ok) {
                    setSessions(sessions.filter(s => s.id !== id));
                } else {
                    alert("Erreur lors de l'enregistrement de la session.");
                }
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

        if (session.finHeure === "Illimitée") {
            return `${Math.floor(totalSec / 3600)}h ${Math.floor((totalSec % 3600) / 60)}m ${totalSec % 60}s`;
        } else {
            const [hf, mf] = session.finHeure.split(':').map(Number);
            const fin = new Date(); fin.setHours(hf, mf, 0);
            let resteMs = fin - tempsActuel;
            if (resteMs <= 0) return "Terminé";
            return `${Math.floor(resteMs / 3600000)}h ${Math.floor((resteMs % 3600000) / 60000)}m ${Math.floor((resteMs % 60000) / 1000)}s`;
        }
    };

    return (
        <div className="p-2">
            <div className="total d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex gap-2">
                    {/* Badge Volume Global en temps réel */}
                    <div className="stats d-flex align-items-center px-3 rounded-3 shadow-sm">
                        <Database size={18} className="me-2"/>
                        <h3>Données: {calculerVolumeGlobal()}</h3>
                    </div>
                    <div className="stats bg-opacity-10  d-flex align-items-center px-3 rounded-3 shadow-sm">
                        <Monitor size={18}/>
                        <h3>{sessions.length} Postes connectés</h3>
                    </div>

                </div>
            </div>

            {/* --- TABLEAU DES DONNÉES --- */}
            <div className="data-session">
                {/* En-tête des colonnes (Masqué sur mobile) */}
                <div className="row sh infoh px-4 py-2 text-muted small fw-normal d-none d-md-flex  mb-2">
                    <div className="col-1 pr">
                        <h4 className="patl1">#</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Appareil</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Système</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Début</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Fin</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Durée</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Prix</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1">Volume</h4>
                    </div>
                    <div className="col pr">
                        <h4 className="patl1"></h4>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-transparent"
                     style={{minHeight: '400px'}}>
                    {loading ? (
                        <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
                             style={{height: '400px'}}>
                            <Loader2 size={45} className="text-primary spin mb-3"/>
                            <span className="text-muted fw-medium">Actualisation des sessions...</span>
                        </div>
                    ) : (
                        <div className="data-sessions">

                            {/* Liste des sessions dynamiques */}
                            {sessions.length === 0 ? (
                                <div className="text-center py-5 text-muted bg-white rounded-4 shadow-sm">
                                    Aucune session active actuellement.
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-2">
                                    {sessions.map((session, index) => {
                                        // Calcul du temps écoulé pour le prix et le volume
                                        const [h, m] = session.debutHeure.split(':').map(Number);
                                        const debut = new Date();
                                        debut.setHours(h, m, 0);
                                        const mins = Math.max(0, Math.floor((tempsActuel - debut) / 60000));

                                        return (
                                            <div key={session.id}
                                                 className="row sb session-time">
                                                {/* Index */}
                                                <div className="col-1 pr">
                                                    <h6 className="patl2">{index + 1}</h6>
                                                </div>

                                                {/* Appareil */}
                                                <div className="col pr">
                                                    <h6 className="patl2">{session.nomAppareil}</h6>

                                                </div>

                                                {/* Système */}
                                                <div className="col pr">
                                                    <h6 className="patl2">{session.systeme || "Windows"}</h6>
                                                </div>

                                                {/* Début */}
                                                <div className="col pr">
                                                    <h6 className="patl2">{session.debutHeure}</h6>
                                                </div>

                                                {/* Fin */}
                                                <div
                                                    className="col pr">
                                                    <h6 className="col patl2">{session.finHeure || "--:--"}</h6>
                                                </div>

                                                {/* Durée Dynamique */}
                                                <div className="col pr">
                                                    <h6 className="patl2">{calculerDureeDynamique(session)}</h6>
                                                </div>

                                                {/* Prix Dynamique */}
                                                <div className="col pr">
                                                    <h6 className="patl2">{(mins * 35).toLocaleString()} Ar</h6>
                                                </div>

                                                {/* Volume Dynamique */}
                                                <div className="col pr">
                                                    <h6 className="patl2">{(mins * 1.5).toFixed(1)} Mo</h6>
                                                </div>

                                                {/* Actions */}
                                                <div className="col pr">
                                                    <div className="patl2" style={{display: 'flex'}}>
                                                        <button
                                                            onClick={() => handleTerminate(session.id, session)}
                                                            className="btn btn-standard"
                                                            title="Arrêter"
                                                        >
                                                            <Power size={18}/>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(session.id)}
                                                            className="btn btn-standard"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={18}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <style>{`
        .hover-row { transition: all 0.2s ease; cursor: default; }
        .hover-row:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
        .bg-light-hover:hover { background-color: #f8f9fa !important; transform: scale(1.1); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
                </div>
            </div>



            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
                .bg-light-hover:hover { background-color: #f8f9fa !important; transition: 0.2s; }
            `}</style>
        </div>
    );
};

export default Utiliser;