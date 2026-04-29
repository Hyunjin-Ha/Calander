import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'workouts.json');

app.use(cors());
app.use(express.json());

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeData(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/workouts', (req, res) => res.json(readData()));

app.get('/api/workouts/:date', (req, res) => {
  const data = readData();
  res.json(data[req.params.date] || null);
});

app.post('/api/workouts/:date', (req, res) => {
  const data = readData();
  data[req.params.date] = req.body;
  writeData(data);
  res.json({ ok: true });
});

app.delete('/api/workouts/:date', (req, res) => {
  const data = readData();
  delete data[req.params.date];
  writeData(data);
  res.json({ ok: true });
});

// 프로덕션: 빌드된 프론트엔드 서빙
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
