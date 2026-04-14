import express from 'express';
import cors from 'cors';
import posteRoutes from './data/routes/posteRoutes.js';
import sessionRoutes from './data/routes/sessionRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use('/api/postes', posteRoutes);
app.use('/api/sessions', sessionRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur MVC actif sur http://localhost:${PORT}`);
});