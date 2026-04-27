function App() {
    // ... vos constantes CONFIG_INITIALE ...

    const [isReady, setIsReady] = useState(false);
    const [settings, setSettings] = useState({});
    const [needsSetup, setNeedsSetup] = useState(false); // État pour forcer la configuration

    useEffect(() => {
        const initApp = () => {
            const nom = localStorage.getItem('wifi_nomSociete');
            const admin = localStorage.getItem('wifi_nomAdmin');

            // CONDITION : Si l'un des champs est vide ou null
            if (!nom || !admin) {
                setNeedsSetup(true);
            } else {
                setSettings({
                    nomSociete: nom,
                    nomAdmin: admin,
                    devise: localStorage.getItem('wifi_devise') || "Ar"
                });
            }
            setIsReady(true);
        };
        initApp();
    }, []);

    // Fonction appelée par le formulaire d'installation
    const handleFirstSetup = (data) => {
        localStorage.setItem('wifi_nomSociete', data.nomSociete);
        localStorage.setItem('wifi_nomAdmin', data.nomAdmin);
        localStorage.setItem('wifi_devise', data.devise);

        setSettings(data);
        setNeedsSetup(false); // On débloque l'application
    };

    if (!isReady) return null;

    // Si la configuration est vide, on affiche l'écran de saisie forcée
    if (needsSetup) {
        return <SetupScreen onComplete={handleFirstSetup} />;
    }

    // ... reste de votre code (ActivationToken, Router, etc.)
}