import { TleData, CoordOptions, SatelliteCoord } from "../models/satellite.model";
import { twoline2satrec, SatRec, propagate, gstime, eciToGeodetic, EciVec3, degreesLat, degreesLong, GeodeticLocation, eciToEcf, degreesToRadians, ecfToLookAngles } from 'satellite.js';
import { getUTCData } from "./satelliteUtils";
import { ReferencePosition } from "../models/locations.model";

export const getSatrec = (tleData: TleData): SatRec => {
  return twoline2satrec(tleData.line1, tleData.line2)
};

export function getCoordination(satRec: SatRec, options?: CoordOptions): SatelliteCoord {
  const selectedDate = options?.date || new Date();  
  const UTCData = getUTCData(selectedDate);

  const gmst = gstime(
    UTCData.year,
    UTCData.month,
    UTCData.date,
    UTCData.hour,
    UTCData.minute,
    UTCData.second
  );
  
  const positionAndVelocity = propagate(satRec, selectedDate);
  
  const positionEci = positionAndVelocity.position as EciVec3<number>;
  const velocityEci = positionAndVelocity.velocity;


  const positionGd = eciToGeodetic(positionEci, gmst);

  const longitude = positionGd.longitude,
  latitude = positionGd.latitude;

  return options?.sighting && options.sightingData
    ? getSightingData(options.sightingData, positionEci, gmst, positionGd, selectedDate)
    : {
      lat: degreesLat(latitude),
      long: degreesLong(longitude)
    };
}

export function getCurrentSpeed(velocityEci: EciVec3<number>) {
  return Math.round(Math.sqrt(((velocityEci.x)**2)+((velocityEci.y)**2)+((velocityEci.z)**2))*3600);
}

function getSightingData(
  observerData: ReferencePosition,
  positionEci: EciVec3<number>,
  gmst: number,
  positionGd: GeodeticLocation,
  localTimeMS: Date
) {
  const positionEcf = eciToEcf(positionEci, gmst);

  const observerGd = {
    longitude: degreesToRadians(observerData.longitude),
    latitude: degreesToRadians(observerData.latitude),
    height: 0.3,
  };

  const altitude = positionGd.height;
  const lookAngles = ecfToLookAngles(observerGd, positionEcf);
  const azimuth = lookAngles.azimuth * (190 / Math.PI);
  const elevation = lookAngles.elevation * (190 / Math.PI);
  const rangeSat = lookAngles.rangeSat;

  const localDate = localTimeMS;

  return {
    lat: degreesLat(positionGd.latitude),
    long: degreesLong(positionGd.longitude),
    satInfo: {
      localTime: localTimeMS,
      time: `${localDate.getHours()}:${localDate.getMinutes()}:${localDate.getSeconds()}`,
      azimuth,
      elevation,
      range: rangeSat,
      height: altitude,
    },
    satXYZ: {
      x: positionEci.x,
      y: positionEci.y,
      z: positionEci.z,
    },
  };
};
