import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileManager {
    constructor(path) {
        this.path = path;
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, se crea con un array vacío
                await this.writeFile([]);
                return [];
            }
            throw error;
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            throw error;
        }
    }
}