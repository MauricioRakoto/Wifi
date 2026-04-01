import React, { useState } from 'react';
import ConnexionWifi from './ConnexionWifi';
import ListesPostes from './ListesPostes'; // Vérifiez que le 'L' est majuscule

function App() {
  const [page, setPage] = useState('connexion');

  const allerAuxPostes = () => {
    console.log("Bouton cliqué : Passage à la page postes");
    setPage('postes');
  };

  const allerAConnexion = () => {
    setPage('connexion');
  };

  return (
      <div style={{ fontFamily: 'Arial' }}>
        <nav style={{ padding: '15px', background: '#2c3e50', color: 'white', display: 'flex', gap: '15px' }}>
          <button onClick={allerAConnexion} style={btnStyle}>Accueil Connexion</button>
          <button onClick={allerAuxPostes} style={btnStyle}>Voir la Liste des Postes</button>
        </nav>

        <div style={{ padding: '20px' }}>
          {/* Logique d'affichage */}
          {page === 'connexion' ? (
              <ConnexionWifi />
          ) : (
              <ListesPostes />
          )}
        </div>

        {/* Petit indicateur de debug pour vous aider */}
        <footer style={{marginTop: '20px', fontSize: '12px', color: '#ccc'}}>
          Page actuelle dans l'état : {page}
        </footer>
      </div>
  );
}

const btnStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
  backgroundColor: '#34495e',
  color: 'white',
  border: 'none',
  borderRadius: '4px'
};

export default App;