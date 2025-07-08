import app from './app';
import config from './config/config';
import { updateRealtimeData } from './gtfsDataFetcher';
import { loadStops } from './gtfsStaticData';

updateRealtimeData({pos: URL.parse("https://s3.amazonaws.com/kcm-alerts-realtime-prod/vehiclepositions_pb.json"), alerts:null, updates:null})
loadStops("D:/Downloads/google_transit/stops.txt");

app.listen(config.server_port, () => {
  console.log(`Server running on port ${config.server_port}`);
});