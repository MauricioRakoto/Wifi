import React, { useState, useEffect } from 'react';

const ConnexionWifi = () => {
    const [ipDetectee, setIpDetectee] = useState("Recherche...");

    useEffect(() => {
        // Appel à une API qui renvoie votre adresse IP
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                setIpDetectee(data.ip); // Récupère l'IP automatiquement
                console.log("IP détectée automatiquement :", data.ip);
            })
            .catch(err => setIpDetectee("Erreur de détection"));
    }, []);

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Identification Automatique</h2>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3498db' }}>
                Votre IP actuelle : {ipDetectee}
            </div>
            <p>L'application vous a reconnu via votre connexion Box.</p>
        </div>
    );
};

export default ConnexionWifi;