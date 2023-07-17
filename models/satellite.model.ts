export interface TleData {
    line1: string;
    line2: string
}

export interface CoordOptions {
    date?: Date,
    sighting?: boolean
}

export interface UTCDate {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    second: number;
}

export interface SatelliteCoord {
    lat: number;
    long: number
}