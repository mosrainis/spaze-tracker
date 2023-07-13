import { TleData, CoordOptions } from "../models/satellite.model";
import { twoline2satrec, SatRec, propagate, gstime, eciToGeodetic, EciVec3, degreesLat, degreesLong } from 'satellite.js';
import { getUTCData } from "./ssatelliteUtils";

export const getSatrec = (tleData: TleData): SatRec => {
    return twoline2satrec(tleData.line1, tleData.line2)
};

export function getCoordination(satRec: SatRec, options?: CoordOptions) {
    const selectedTime = options?.date || new Date();
    const UTCData = getUTCData(selectedTime);
    
    const positionAndVelocity = propagate(satRec, selectedTime);

    const positionEci = positionAndVelocity.position as EciVec3<number>;
    // const velocityEci = positionAndVelocity.velocity;

    const gmst = gstime(
      UTCData.year,
      UTCData.month,
      UTCData.date,
      UTCData.hour,
      UTCData.minute,
      UTCData.second
    );

    const positionGd = eciToGeodetic(positionEci, gmst);

    const longitude = positionGd.longitude,
    latitude = positionGd.latitude;

    return {
      lat: degreesLat(latitude),
      long: degreesLong(longitude)
    }
}

export function getCurrentSpeed(velocityEci: EciVec3<number>) {
    return Math.round(Math.sqrt(((velocityEci.x)**2)+((velocityEci.y)**2)+((velocityEci.z)**2))*3600);
}