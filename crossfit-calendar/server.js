import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;
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
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/workouts', (req, res) => {
  res.json(readData());
});

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

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
