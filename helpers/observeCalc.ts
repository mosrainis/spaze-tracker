import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import { ReferencePosition } from "../models/locations.model";
import { getTimes } from 'suncalc';
import { getCoordination, getSatrec } from "./satelliteRec";
import { SatRec, gstime, jday, ecfToEci, geodeticToEcf, degreesToRadians } from "satellite.js";
import { SatelliteCoord, Sighting } from "../models/satellite.model";
import { dot } from 'mathjs';
import { getDuration } from "./satelliteUtils";

declare const A: any; //From meeujs lib
interface ObserveDateRange { start: Date; end: Date };
interface SightingScopeInput { currentTime: number; shiftLength: number; observeCoords: ReferencePosition; satrec: SatRec}

const tau: number = 2 * Math.PI;
const RAD2DEG: number = 360 / tau;
const DEG2RAD: number = tau / 360;
const MIN_SIGHT_ELV: number = 10;
const ISS_LOOP_MS: number = 75*60000 // Equal to 90min


export function getSightings(satrec: SatRec, observeCoords: ReferencePosition): Sighting[] {
  let date = new Date();
  let sightings: any = [];
  let observeRange: ObserveDateRange;
  
  for (let i = 0; i < TRACKER_CONSTSNTS.OBSERVE_RANGE_DAY; i++) {
    observeRange = calcSunTime(observeCoords.latitude, observeCoords.longitude, date);
    date.setDate(date.getDate() + 1);
    const opp = calcLocalSatPos(satrec, observeRange, observeCoords);    
    if(opp) {sightings.push(opp);}
  }

  return sightings;
}

function calcSunTime(siteLat: number, siteLong: number, date: Date): ObserveDateRange {
  const dayAfter = new Date(date.getTime());
  
  dayAfter.setDate(dayAfter.getDate() + 1);   

  const sunTime = getTimes(date, siteLat, siteLong);
  const sunTimeDayAfter = getTimes(dayAfter, siteLat, siteLong);

  return {
    start: sunTime.sunset,
    end: sunTimeDayAfter.sunriseEnd
  };

  // for (let i = 0; i < this.numberOfPoints; i++) {
  //   satPos = this.convertTLE(currentTime);
  //   if satPos[]
  //   currentTime += dt;
  // }
}

function calcLocalSatPos(satrec: SatRec, observeRange: ObserveDateRange, observeCoords: ReferencePosition): Sighting | undefined  {    
  let currentTime = observeRange.start.getTime();
  let currentSatData: SatelliteCoord;
  let sightingOpp: Sighting | undefined = undefined;

  const dt = Math.trunc((observeRange.end.getTime() - observeRange.start.getTime()) / 450);
  
  let preElv: number = 0;

  while (currentTime < observeRange.end.getTime()) {
    currentSatData = getCoordination(satrec, {
      sighting: true,
      sightingData: observeCoords,
      date: new Date(currentTime),
    });

    if((currentSatData.satInfo?.elevation as number) >= MIN_SIGHT_ELV) {
      preElv = currentSatData.satInfo?.elevation as number;
      const sightingData = processSightingScope({
        currentTime,
        observeCoords,
        satrec,
        shiftLength: dt
      });
      currentTime = sightingData.newCurrentTime;
      
      if(sightingData.sighting.length !== 0) {
        sightingOpp = submitSighting(sightingData.sighting, sightingData.elv, sightingData.range);
      }
    } else if(
      currentSatData.satInfo?.elevation as number < MIN_SIGHT_ELV
      && preElv > MIN_SIGHT_ELV
    ) {
      preElv = 0;
      currentTime += ISS_LOOP_MS;
    }

    currentTime += dt;
  }

  return sightingOpp;
}

function processSightingScope({ currentTime, shiftLength, observeCoords, satrec}: SightingScopeInput): {
  newCurrentTime: number;
  sighting: SatelliteCoord[];
  elv: number;
  range: number;
}{
  let  sightingArray: SatelliteCoord[] = [];
  let currentSatData: SatelliteCoord;
  let innerRangeMarker: number = currentTime - shiftLength;
  let maxInnerRange: number = currentTime;
  let dt: number = 1000; // equal to 1second

  let maxElevation: number = 0;
  let maxRange: number = 0;

  while (innerRangeMarker < maxInnerRange) {
    currentSatData = getCoordination(satrec, {
      sighting: true,
      sightingData: observeCoords,
      date: new Date(innerRangeMarker)
    });
    
    if ((currentSatData.satInfo?.elevation as number) >= MIN_SIGHT_ELV) {

      // Catch the FISRT sighting
      if (sightingArray.length === 0) {
        if(isSunlit(currentSatData, innerRangeMarker)) {
          // console.log(' ---> first', currentSatData.satInfo?.localTime);
          sightingArray.push(currentSatData);
        }
      } else {
        // Catch the MAX sighting
        if (maxElevation < (currentSatData.satInfo?.elevation as number)) {
          maxElevation = currentSatData.satInfo?.elevation as number;
          maxRange = currentSatData.satInfo?.range as number;
          (sightingArray.length > 1) && sightingArray.pop();
          sightingArray.push(currentSatData);
        }
        // Catch the LAST sighting
        if(!isSunlit(currentSatData, innerRangeMarker)) {
          // console.log('--- last --- (NOT sun-lit)');
          sightingArray.push(currentSatData);
          innerRangeMarker = maxInnerRange;
          continue;
        }

        // Need to expand range to find the LAST sighting
        if(innerRangeMarker+dt > maxInnerRange) {
          maxInnerRange += dt;
        }
      }
    } else {
      // Catch the LAST sighting (Elevation too low)
      if(sightingArray.length !== 0) {
        sightingArray.push(currentSatData);
        innerRangeMarker = maxInnerRange;
      }
    }
    
    innerRangeMarker += dt;
  }

  return {
    newCurrentTime: maxInnerRange,
    sighting: sightingArray,
    elv: maxElevation,
    range: maxRange
  }
}

function isSunlit(sat: SatelliteCoord, timeMs: number, needPhaseAngle?: boolean) {
  if(!sat.satXYZ) return false;

  var sunECI = getSunXYZ(timeMs);

  var semiDiamEarth = Math.asin(6371/Math.sqrt(Math.pow(-sat.satXYZ.x, 2) + Math.pow(-sat.satXYZ.y, 2) + Math.pow(-sat.satXYZ.z, 2))) * RAD2DEG;
  var semiDiamSun = Math.asin(6371/Math.sqrt(Math.pow(-sat.satXYZ.x + sunECI.x, 2) + Math.pow(-sat.satXYZ.y + sunECI.y, 2) + Math.pow(-sat.satXYZ.z + sunECI.z, 2))) * RAD2DEG;

  // Angle between earth and sun
  var theta = Math.acos(dot([-sat.satXYZ.x,-sat.satXYZ.y,-sat.satXYZ.z],[-sat.satXYZ.x + sunECI.x,-sat.satXYZ.y + sunECI.y,-sat.satXYZ.z + sunECI.z])/(Math.sqrt(Math.pow(-sat.satXYZ.x, 2) + Math.pow(-sat.satXYZ.y, 2) + Math.pow(-sat.satXYZ.z, 2))*Math.sqrt(Math.pow(-sat.satXYZ.x + sunECI.x, 2) + Math.pow(-sat.satXYZ.y + sunECI.y, 2) + Math.pow(-sat.satXYZ.z + sunECI.z, 2)))) * RAD2DEG;

  // var isSun = false;

  if(needPhaseAngle) return theta;

  // var isUmbral = false;
  if ((semiDiamEarth > semiDiamSun) && (theta < semiDiamEarth - semiDiamSun)) {
    // isUmbral = true;
    return false;
  }

  // var isPenumbral = false;
  if ((Math.abs(semiDiamEarth - semiDiamSun) < theta) && (theta < semiDiamEarth + semiDiamSun)){
    // isPenumbral = true;
    return true;
  }

  if (semiDiamSun > semiDiamEarth) {
    // isPenumbral = true;
    return true;
  }

  if (theta < semiDiamSun - semiDiamEarth) {
    // isPenumbral = true;
    return true;
  }

  // if (!isUmbral && !isPenumbral) isSun = true;
  // return 2;
  return true;
};

function getSunXYZ(currentTime: number) {
  // const now = new Date();  
  const now = new Date(currentTime);
  
  let j = jday(now.getUTCFullYear(),
               now.getUTCMonth() + 1,
               now.getUTCDate(),
               now.getUTCHours(),
               now.getUTCMinutes(),
               now.getUTCSeconds());
  j += now.getUTCMilliseconds() * 1.15741e-8; // days per milliseconds
  var gmst = gstime(j);
  var jdo = new A.JulianDay(j); // now
  
  var coord = A.EclCoord.fromWgs84(0,0,0);

  // AZ / EL Calculation
  var tp = A.Solar.topocentricPosition(jdo, coord, false);
  var azimuth = tp.hz.az * RAD2DEG + 180 % 360;
  var elevation = tp.hz.alt * RAD2DEG % 360;

  // Range Calculation
  var T = (new A.JulianDay(A.JulianDay.dateToJD(now))).jdJ2000Century();
  var g = A.Solar.meanAnomaly(T)*180/Math.PI;
  g = g % 360.0;
  var R = 1.00014 - (0.01671 * Math.cos(g)) - (0.00014 * Math.cos(2 * g));
  var range = R * 149597870700 / 1000; // au to km conversion

  // RAE to ECI
  var eci = ecfToEci(lookAnglesToEcf(azimuth, elevation, range, 0,0,0), gmst);

  return {'x': eci.x, 'y': eci.y, 'z': eci.z};
}

function lookAnglesToEcf(azimuthDeg: number, elevationDeg: number, slantRange: number, obs_lat: number, obs_long: number, obs_alt: number) {
  // site ecef in meters
  var geodeticCoords = {
    latitude: obs_lat,
    longitude: obs_long,
    height: obs_alt
  };

  var siteXYZ = geodeticToEcf(geodeticCoords);
  var sitex, sitey, sitez;
  sitex = siteXYZ.x;
  sitey = siteXYZ.y;
  sitez = siteXYZ.z;

  // some needed calculations
  var slat = Math.sin(obs_lat);
  var slon = Math.sin(obs_long);
  var clat = Math.cos(obs_lat);
  var clon = Math.cos(obs_long);

  var azRad = DEG2RAD * azimuthDeg;
  var elRad = DEG2RAD * elevationDeg;

  // az,el,range to sez convertion
  var south  = -slantRange * Math.cos(elRad) * Math.cos(azRad);
  var east   =  slantRange * Math.cos(elRad) * Math.sin(azRad);
  var zenith =  slantRange * Math.sin(elRad);

  var x = ( slat * clon * south) + (-slon * east) + (clat * clon * zenith) + sitex;
  var y = ( slat * slon * south) + ( clon * east) + (clat * slon * zenith) + sitey;
  var z = (-clat *        south) + ( slat * zenith) + sitez;
  
  return {'x': x, 'y': y, 'z': z};
}

// Calculate Magnitude
function calcMagnitude(phaseAngle: any, satRange: number) {
  const stdMag = -1.8; // ISS intrinsic brightness at 1000km
  const phaseAngleToRadians = degreesToRadians(phaseAngle);

  const term_1 = stdMag;
  const term_2 = 5.0 * Math.log10(satRange / 1000.0);

  const arg = Math.sin(phaseAngleToRadians) + (Math.PI - phaseAngleToRadians) * Math.cos(phaseAngleToRadians);
  const term_3 = -2.5 * Math.log10(arg);

  const apparentMagnitude = term_1 + term_2 + term_3;
  return apparentMagnitude;
}

function submitSighting(data: SatelliteCoord[], elv: number, range: number): Sighting {
  
  return {
    startingTime: data[0].satInfo?.localTime,
    maxElv: elv,
    duration: getDuration(
      data[0].satInfo?.localTime,
      data[2].satInfo?.localTime
    ),
    mag: calcMagnitude(
      isSunlit(
        data[0],
        data[1].satInfo?.localTime.getTime() as number,
        true
      ),
      range
    ),
    sightingData: data
  };
}