import app from './app';
import config from './config/config';
import { updateRealtimeData } from './gtfsDataFetcher';
import { gtfsStaticService } from './services/static.gtfs.service';

updateRealtimeData({pos: URL.parse("https://s3.amazonaws.com/kcm-alerts-realtime-prod/vehiclepositions_pb.json"), alerts:null, updates:null})
gtfsStaticService.loadStops("D:/Downloads/google_transit/stops.txt");
gtfsStaticService.loadRouteShapes("D:/Downloads/google_transit/shapes.txt")
gtfsStaticService.loadRoutes("D:/Downloads/google_transit/routes.txt")
gtfsStaticService.loadTrips("D:/Downloads/google_transit/trips.txt")

app.listen(config.server_port, () => {
  console.log(`Server running on port ${config.server_port}`);
});