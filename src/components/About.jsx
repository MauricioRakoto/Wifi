import React from 'react';
import { Info, Code2, Smartphone, Palette, Globe, ShieldCheck, Mail, Cpu } from 'lucide-react';

const About = () => {
    const services = [
        {
            icon: <Globe size={32} className="text-primary" />,
            title: "Développement Web",
            desc: "Conception de sites vitrines et plateformes e-commerce performantes."
        },
        {
            icon: <Smartphone size={32} className="text-info" />,
            title: "Applications Mobiles",
            desc: "Solutions natives et cross-plateformes pour Android et iOS."
        },
        {
            icon: <Palette size={32} className="text-warning" />,
            title: "Design Graphique",
            desc: "Création de logos, chartes graphiques et supports publicitaires professionnels."
        },
        {
            icon: <Cpu size={32} className="text-success" />,
            title: "Logiciels Sur Mesure",
            desc: "Développement d'outils de gestion spécifiques comme ce Wifi Manager."
        }
    ];

    return (
        <div className="p-3 animate-fade-in">
            <div className="row">
                <div className="card ab1 bg-white  p-5 mb-4 text-center">
                    <h2 className="fw-bold text-dark mb-3">À propos de Wifi Manager</h2>
                    <p>
                        Wifi Manager est une solution intelligente conçue pour simplifier la gestion de votre parc
                        informatique
                        et la facturation de vos sessions de connexion. Développée avec une expertise technique de
                        pointe
                        en React et technologies modernes.
                    </p>
                </div>

            </div>

            <div className="row ab2">
                {services.map((service, index) => (
                    <div className="card col-6" key={index} style={{marginBottom: '20px', height: '100px'}}>
                        <h6 className="fw-bold mb-1">{service.title}</h6>
                        <p className="text-muted small mb-0">{service.desc}</p>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default About;