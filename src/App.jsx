import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Settings, Loader2 } from 'lucide-react';

// Vos imports de composants
import Home from './components/Home';
import Postes from "./components/Postes.jsx";
import Utiliser from "./components/Utiliser.jsx";
import Stats from "./components/Stats.jsx";
import About from "./components/About.jsx";
import Help from "./components/Help.jsx";
import EditConfig from "./components/EditConfig.jsx";
import ActivationToken from './components/ActivationToken';
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SetupScreen from "./SetupScreen.jsx";
import wifiIcon from '../src/assets/img/min.png';

function App() {
    const [isReady, setIsReady] = useState(false);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [settings, setSettings] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [configTick, setConfigTick] = useState(0);

    // 1. INITIALISATION ET LOGIQUE DE CONTRÔLE
    useEffect(() => {
        const checkAppStatus = () => {
            // 1. Lire la chaîne de caractères brute
            const configRaw = localStorage.getItem('app_config');

            if (!configRaw) {
                // Le "fichier" n'existe pas encore
                setNeedsSetup(true);
            } else {
                try {
                    // 2. Transformer la chaîne en objet JavaScript
                    const config = JSON.parse(configRaw);

                    // 3. Vérifier si les champs internes ne sont pas vides
                    if (!config.nomSociete || config.nomSociete.trim() === "") {
                        setNeedsSetup(true);
                    } else {
                        setNeedsSetup(false);
                        setSettings(config); // On stocke l'objet complet dans le state
                    }
                } catch (error) {
                    console.error("Erreur de lecture du config JSON", error);
                    setNeedsSetup(true);
                }
            }
            setIsReady(true);
        };

        checkAppStatus();

        // Splash Screen (2 secondes)
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, [configTick]);

    // Fonction de sauvegarde initiale (venant du SetupScreen)
    const handleFirstSetup = (data) => {
        // On transforme l'objet en texte JSON avant de l'enregistrer
        const configEnTexte = JSON.stringify(data);
        localStorage.setItem('app_config', configEnTexte);

        setNeedsSetup(false);
        setConfigTick(prev => prev + 1); // Relance la vérification
    };

    // Fonction pour rafraîchir l'interface (venant de EditConfig)
    const handleConfigChange = () => {
        setConfigTick(prev => prev + 1);
    };

    // --- LOGIQUE DE RENDU ---

    // A. Système en cours de démarrage
    if (!isReady) return null;

    // B. Priorité 1 : Vérifier si l'application a besoin d'être configurée
    if (needsSetup) {
        return <SetupScreen onComplete={handleFirstSetup} />;
    }



    // D. Priorité 3 : Splash Screen style WhatsApp/WifiManager
    if (isLoading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center bg-white vh-100">
                <img src={wifiIcon} alt="Logo" className="animate-bounce mb-4" style={{width: '80px'}} />
                <h2 className="fw-bold text-dark">WifiManager</h2>
                <div className="mt-5 d-flex align-items-center gap-2 text-muted">
                    <Loader2 size={18} className="spin" /> Initialisation du système...
                </div>
            </div>
        );
    }

    // E. Dashboard Principal
    return (
        <Router>
            <div className="container-fluid p-0 overflow-hidden">
                <div className="d-flex" style={{ minHeight: '100vh' }}>

                    {/* Sidebar dynamique avec le nom de la société */}
                    <Sidebar
                        key={`side-${configTick}`}
                        nomSociete={settings.nomSociete}
                    />

                    <main className="flex-grow-1 d-flex flex-column bg-light" style={{marginLeft: '260px'}}>

                        {/* Header dynamique avec le nom de l'admin */}
                        <Header
                            key={`head-${configTick}`}
                            nomAdmin={settings.nomAdmin}
                        />

                        <div className="container-fluid p-4" style={{marginTop: '65px'}}>
                            <div className="bg-white rounded-4 shadow-sm p-3 animate-fade-in" style={{minHeight: '82vh'}}>
                                <Routes>
                                    <Route path="/" element={<Home/>}/>
                                    <Route path="/postes" element={<Postes/>}/>
                                    <Route path="/utiliser" element={<Utiliser/>}/>
                                    <Route path="/stats" element={<Stats devise={settings.devise} />}/>
                                    <Route path="/about" element={<About/>}/>
                                    <Route path="/help" element={<Help/>}/>
                                    <Route path="/econfig" element={<EditConfig onSave={handleConfigChange} />}/>
                                </Routes>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style>
                {`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    
                    .spin { animation: spin 1s linear infinite; }
                    .animate-bounce { animation: bounce 2s ease-in-out infinite; }
                    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
                `}
            </style>
        </Router>
    );
}

export default App;