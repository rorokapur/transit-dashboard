export type ArrivalData = ArrivalInfo[];

export interface ArrivalInfo {
    routeId: string;
    name: string;
    timeToArrival: number;
}