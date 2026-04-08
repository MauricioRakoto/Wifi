import React, { useState, useEffect } from 'react';
import initialData from './postes.json';
import UtiliserWifi from './UtiliserWifi';

const ListesPostes = () => {
    const [postes, setPostes] = useState(initialData.postes_detectes || []);
    const [listeNoire, setListeNoire] = useState([]);

    const ADMIN_ID = "ID-PERSO-77";

    useEffect(() => {
        const detecterAppareilActuel = () => {
            const isWin = navigator.userAgent.indexOf("Win") !== -1;

            const monPoste = {
                id: ADMIN_ID,
                nom: isWin ? "Asus Rogue (Admin)" : "Appareil Connecté",
                systeme: isWin ? "Windows 11" : "Linux/Android",
                type: "Ordinateur",
                ip: "192.168.1.64",
                statut: "online"
            };

            setPostes(prev => {
                const existe = prev.find(p => p.id === monPoste.id);
                const estBanni = listeNoire.includes(monPoste.id);
                if (!existe && !estBanni) return [monPoste, ...prev];
                return prev;
            });
        };

        detecterAppareilActuel();
    }, [listeNoire]);

    const supprimerPoste = (id) => {
        if (window.confirm("Voulez-vous supprimer ce poste ?")) {
            setListeNoire(prev => [...prev, id]);
            setPostes(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div style={styles.container}>
            <h2>📋 Liste des Postes sur la Box</h2>
            <div style={styles.grid}>
                {postes.map((p) => (
                    /* CORRECTION : On doit retourner un élément parent (la carte) pour chaque poste */
                    <div key={p.id} style={styles.card}>
                        <div style={styles.header}>
                            <strong>{p.nom}</strong>
                            <span style={styles.typeTag}>{p.type}</span>
                        </div>
                        <p style={styles.info}>💻 {p.systeme}</p>
                        <p style={styles.info}>🌐 {p.ip}</p>

                        {/* Logique conditionnelle pour l'Admin */}
                        {p.id === ADMIN_ID ? (
                            <div style={styles.adminBadge}>⭐ Adm</div>
                        ) : (
                            <>
                                <UtiliserWifi posteId={p.id} nomPoste={p.nom} />
                                <button
                                    onClick={() => supprimerPoste(p.id)}
                                    style={styles.deleteBtn}
                                >
                                    🗑️ Supprimer
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px' },
    grid: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
    card: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '15px',
        width: '250px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    typeTag: { fontSize: '10px', background: '#e0e0e0', padding: '2px 6px', borderRadius: '4px' },
    info: { fontSize: '13px', margin: '5px 0', color: '#555' },
    deleteBtn: {
        width: '100%', marginTop: '10px', padding: '8px', cursor: 'pointer',
        backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '6px',
        fontWeight: 'bold'
    },
    adminBadge: {
        marginTop: '10px', padding: '8px', textAlign: 'center',
        backgroundColor: '#f1c40f', color: '#2c3e50', borderRadius: '6px',
        fontWeight: 'bold', fontSize: '14px'
    }
};

export default ListesPostes;