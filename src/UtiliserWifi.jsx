import React, { useState, useEffect } from 'react';

const UtiliserWifi = ({ posteId, nomPoste }) => {
    const [session, setSession] = useState({
        debut: new Date().toLocaleTimeString(),
        fin: "--:--:--",
        minutes: 0,
        volumeData: 0, // En Mo (Mégaoctets)
        actif: true
    });

    useEffect(() => {
        let intervalle;

        if (session.actif) {
            intervalle = setInterval(() => {
                setSession(prev => ({
                    ...prev,
                    // Calcul des minutes (on simule ici une progression rapide pour le test)
                    minutes: prev.minutes + 1,
                    // Simulation de consommation de données (entre 1 et 5 Mo par seconde)
                    volumeData: prev.volumeData + Math.floor(Math.random() * 5) + 1
                }));
            }, 1000); // Mise à jour chaque seconde pour la démo
        }

        return () => clearInterval(intervalle);
    }, [session.actif]);

    const terminerSession = () => {
        setSession(prev => ({
            ...prev,
            fin: new Date().toLocaleTimeString(),
            actif: false
        }));
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>⏱️ Session en cours : {nomPoste}</h3>

            <div style={styles.grid}>
                <div style={styles.statBox}>
                    <span style={styles.label}>Début</span>
                    <span style={styles.value}>{session.debut}</span>
                </div>

                <div style={styles.statBox}>
                    <span style={styles.label}>Fin</span>
                    <span style={styles.value}>{session.fin}</span>
                </div>

                <div style={styles.statBox}>
                    <span style={styles.label}>Durée</span>
                    <span style={styles.value}>{session.minutes} min</span>
                </div>

                <div style={styles.statBox}>
                    <span style={styles.label}>Volume Data</span>
                    <span style={styles.value}>{session.volumeData} Mo</span>
                </div>
            </div>

            {session.actif ? (
                <button onClick={terminerSession} style={styles.stopBtn}>
                    Terminer la session
                </button>
            ) : (
                <div style={styles.facture}>
                    ✅ Session terminée. Total à facturer : {(session.minutes * 0.5).toFixed(2)} €
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#fff',
        border: '1px solid #3498db',
        borderRadius: '12px',
        padding: '15px',
        marginTop: '10px',
        boxShadow: '0 2px 8px rgba(52, 152, 219, 0.2)'
    },
    title: { margin: '0 0 15px 0', fontSize: '16px', color: '#2980b9' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    statBox: {
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px'
    },
    label: { fontSize: '11px', color: '#7f8c8d', textTransform: 'uppercase' },
    value: { fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' },
    stopBtn: {
        width: '100%',
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e67e22',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    facture: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#27ae60',
        color: 'white',
        borderRadius: '6px',
        textAlign: 'center',
        fontWeight: 'bold'
    }
};

export default UtiliserWifi;