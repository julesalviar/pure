import express from 'express';
import cors from 'cors';
import agentRoutes from './routes/agentRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/agents', agentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Property Agent API running on http://localhost:${PORT}`);
});
