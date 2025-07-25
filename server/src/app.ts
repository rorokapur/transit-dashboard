import express from 'express';
import cron from 'node-cron';
import { updateRealtimeData } from './gtfsDataFetcher';
import { routePaths, stops, vehiclePositions } from './routes';

const app = express();
app.use(express.json());
app.get('/api/vehicles', vehiclePositions);
app.get('/api/stops', stops);
app.get('/api/paths', routePaths)

cron.schedule('*/30 * * * * *', async () => {
    await updateRealtimeData({pos: URL.parse("https://s3.amazonaws.com/kcm-alerts-realtime-prod/vehiclepositions_pb.json"), alerts:null, updates:null});
});

export default app;