import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const POSTES_FILE = path.join(__dirname, '../../postes.json');
export const SESSIONS_FILE = path.join(__dirname, '../../sessions_actives.json');

export const readData = (file) => {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data || '[]');
};

export const saveData = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};