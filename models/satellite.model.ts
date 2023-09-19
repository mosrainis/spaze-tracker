import { ReferencePosition } from "./locations.model";

export interface TleData {
    line1: string;
    line2: string
}

export interface CoordOptions {
    date?: Date;
    sighting?: boolean;
    sightingData?: ReferencePosition 
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
    long: number;
    satInfo?: SatInfo,
    satXYZ?: Location
}

export interface SatInfo {
    localTime: Date,
    time: String,
    azimuth: number,
    elevation: number,
    range: number,
    height: number
}

export interface Location {
    x: number;
    y: number;
    z: number;
}

export interface Sighting {
    startingTime: Date;
    maxElv: number;
    mag: number;
    sightingData: SatelliteCoord[]
}