import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const app = express();
const PORT = process.env.PORT || 8103;

app.use(express.static(distDir));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', app: 'adytum-alchemist-ai-workflow', port: PORT });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[AdytumAlchemist] Workstation server listening on http://127.0.0.1:${PORT}`);
});
