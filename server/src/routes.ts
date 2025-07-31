import { Request, Response } from "express";
import { vehiclePositionsInArea } from "./gtfsDataFetcher";
import { gtfsStaticService } from "./services/static.gtfs.service";

export const vehiclePositions = (req: Request, res: Response) => {
    const x1: number = Number(req.query.x1);
    const y1: number = Number(req.query.y1);
    const x2: number = Number(req.query.x2);
    const y2: number = Number(req.query.y2);

    if(isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
        res.status(400).send('vehiclePositions: one or more coordinates (y1, x1, y2, x2) is missing or invalid');
    } else {
        res.json(vehiclePositionsInArea(y1, x1, y2, x2));
    }

}

export const stops = (req: Request, res: Response) => {
    const x1: number = Number(req.query.x1);
        const y1: number = Number(req.query.y1);
        const x2: number = Number(req.query.x2);
        const y2: number = Number(req.query.y2);
    
        if(isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
            res.status(400).send('stops: one or more coordinates (y1, x1, y2, x2) is missing or invalid');
        } else {
            res.json(gtfsStaticService.getStopsInArea(y1, x1, y2, x2));
        }
}

export const routePaths = (req: Request, res: Response) => {
    const x1: number = Number(req.query.x1);
        const y1: number = Number(req.query.y1);
        const x2: number = Number(req.query.x2);
        const y2: number = Number(req.query.y2);
        res.json(gtfsStaticService.getRouteSegmentsInArea(y1,x1,y2,x2));
        // if(isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
        //     res.status(400).send('stops: one or more coordinates (y1, x1, y2, x2) is missing or invalid');
        // } else {
        //     res.json(routeSegmentsInArea(y1,x1,y2,x2));
        // }
}