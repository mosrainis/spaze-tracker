import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import { ReferencePosition } from "../models/locations.model";
import { getTimes } from 'suncalc';
import { getCoordination, getSatrec } from "./satelliteRec";
import { SatRec, gstime } from "satellite.js";
import { SatelliteCoord } from "../models/satellite.model";
import { dot } from 'mathjs';

interface ObserveDateRange { start: Date, end: Date };

const tau = 2 * Math.PI;
const RAD2DEG = 360 / tau;
const DEG2RAD = tau / 360;

export function selectLocation(satrec: SatRec, observeCoords: ReferencePosition, date: Date) {
  let observeRange: ObserveDateRange;

  for (let i = 0; i < TRACKER_CONSTSNTS.OBSERVE_RANGE_DAY; i++) {
    observeRange = calcSunTime(observeCoords.latitude, observeCoords.longitude, date);
    date.setDate(date.getDate() + 1);  
        
    calcLocalSatPos(satrec, observeRange, observeCoords);
  }

}

function calcSunTime(siteLat: number, siteLong: number, date: Date): ObserveDateRange {
  const dayAfter = new Date(date.getTime());
  dayAfter.setDate(dayAfter.getDate() + 1);   

  const sunTime = getTimes(date, siteLat, siteLong);
  const sunTimeDayAfter = getTimes(dayAfter, siteLat, siteLong);
  
  return {
    start: sunTime.dusk,
    end: sunTimeDayAfter.dawn
  };

  // for (let i = 0; i < this.numberOfPoints; i++) {
  //   satPos = this.convertTLE(currentTime);
  //   if satPos[]
  //   currentTime += dt;
  // }
}

function calcLocalSatPos(satrec: SatRec, observeRange: ObserveDateRange, observeCoords: ReferencePosition) {    
    const dt = Math.trunc((observeRange.end.getTime() - observeRange.start.getTime()) / 450);
    let innerDt: number = 1000;
    let currentTime = observeRange.start.getTime();
    let currentSatData: SatelliteCoord;
    let maxElevation: number = 0;
    let maxRange: number = 0;
    
    let innerRangeMarker: number;
    let maxInnerRange: number;
    let preElv: number = 0;
    let preCheckedRange;
    let tempSightingData;
        
    
    let sightingData = [];
    
    // Set the loop range from 'dusk' to 'dawn' 
    while (currentTime < observeRange.end.getTime()) {
      currentSatData = getCoordination(satrec, {
        sighting: true,
        sightingData: observeCoords,
        date: new Date(currentTime),
      });

      if(!currentSatData || !currentSatData.satInfo) return;
      // console.log(`======||||||||||||||=======${currentSatData[2].localTime}==(elv : ${currentSatData[2].elevation})=====|||||||||||||===========`);
      // Check if satellite if It's above the observer horizon (10 degree above horizon)
      if (currentSatData.satInfo.elevation > 10) {
        // console.log(`=============${currentSatData[2].localTime}=========(elv : ${currentSatData[2].elevation})=========`);
        
        preElv = currentSatData.satInfo.elevation;
        innerRangeMarker = currentTime - dt;
        maxInnerRange = currentTime + dt;
        
        if (preCheckedRange != currentTime) {
          // console.log(`ok current is not equal to preRange`);
          
          preCheckedRange = maxInnerRange;
          
          // Set the loop range from 'previous time' to 'next time' 
          // while (innerRangeMarker < maxInnerRange) {
            
          //   currentSatData = getCoordination(satrec, {
          //     sighting: true,
          //     sightingData: observeCoords,
          //     date: new Date(innerRangeMarker)
          //   });

          //   if(!currentSatData || !currentSatData.satInfo) return;

          //   // console.log(`---------CHECKing ${currentSatData[2].localTime}----elv : (${currentSatData[2].elevation})------`);
          //   if (currentSatData.satInfo.elevation > 10) {
          //     // console.log(`ok elv is MORE than 10`);
              
          //     if (sightingData.length == 0 && isSunlit(currentSatData)) {
          //       // console.log(`ok catch the FIRST sighting`);
          //       sightingData.push(currentSatData);
          //     }
          //     // Set the max elevation to whatever is more than previous max value
          //     if (sightingData.length != 0 ) {
          //       if (maxElevation < currentSatData.satInfo.elevation) {
          //         // console.log(`ok catch MAX elv`);
          //         maxElevation = currentSatData.satInfo.elevation;
          //         maxRange = currentSatData.satInfo.range;
          //         if (sightingData.length > 1) {
          //           // console.log(`POP action`);
          //           sightingData.pop();
          //         }
          //         sightingData.push(currentSatData);
          //       }
          //       if (!isSunlit(currentSatData)) {
          //         // console.log(`ok catch MAX as LAST -- BREAK`);
          //         sightingData.push(currentSatData);
          //         // submitSighting(sightingData, maxElevation, maxRange);
          //         sightingData = [];
          //         maxElevation = 0;
          //         maxRange = 0
          //         innerRangeMarker = maxInnerRange;
          //       }  
          //       // console.log(`size of array is ${sightingData.length}`);
                               
          //     }
          //   }
          //   else if (sightingData.length != 0 && (currentSatData.satInfo.elevation < 10 || innerRangeMarker+innerDt>maxInnerRange)) {
          //     // console.log(`NOT ok elv is LESS more than 10 -- PUSH TO SIGHTINGOPP`);
          //     sightingData.push(currentSatData);              
          //     // submitSighting(sightingData, maxElevation, maxRange);              
          //     maxElevation = 0;
          //     maxRange = 0;
          //     sightingData = [];
          //     innerRangeMarker = maxInnerRange;
          //   }
          //   innerRangeMarker += innerDt;
          // }
        }
      }
      else if (preElv > 10 && currentSatData.satInfo.elevation < 10) {
        preElv = 0;
        currentTime += 75*60000;
      }
      currentTime += dt;
    }
    // console.log(this.sightingOpp);
}

// function isSunlit(sat: SatelliteCoord, needPhaseAngle?: boolean) {
//   if(!sat.satXYZ) return false;

//   // var sunECI = getSunXYZ();

//   var semiDiamEarth = Math.asin(6371/Math.sqrt(Math.pow(-sat.satXYZ.x, 2) + Math.pow(-sat.satXYZ.y, 2) + Math.pow(-sat.satXYZ.z, 2))) * RAD2DEG;
//   var semiDiamSun = Math.asin(6371/Math.sqrt(Math.pow(-sat.satXYZ.x + sunECI.x, 2) + Math.pow(-sat.satXYZ.y + sunECI.y, 2) + Math.pow(-sat.satXYZ.z + sunECI.z, 2))) * RAD2DEG;

//   // Angle between earth and sun
//   var theta = Math.acos(dot([-sat.satXYZ.x,-sat.satXYZ.y,-sat.satXYZ.z],[-sat.satXYZ.x + sunECI.x,-sat.satXYZ.y + sunECI.y,-sat.satXYZ.z + sunECI.z])/(Math.sqrt(Math.pow(-sat.satXYZ.x, 2) + Math.pow(-sat.satXYZ.y, 2) + Math.pow(-sat.satXYZ.z, 2))*Math.sqrt(Math.pow(-sat.satXYZ.x + sunECI.x, 2) + Math.pow(-sat.satXYZ.y + sunECI.y, 2) + Math.pow(-sat.satXYZ.z + sunECI.z, 2)))) * this.RAD2DEG;

//   // var isSun = false;

//   if(needPhaseAngle) return theta;

//   // var isUmbral = false;
//   if ((semiDiamEarth > semiDiamSun) && (theta < semiDiamEarth - semiDiamSun)) {
//     // isUmbral = true;
//     return false;
//   }

//   // var isPenumbral = false;
//   if ((Math.abs(semiDiamEarth - semiDiamSun) < theta) && (theta < semiDiamEarth + semiDiamSun)){
//     // isPenumbral = true;
//     return true;
//   }

//   if (semiDiamSun > semiDiamEarth) {
//     // isPenumbral = true;
//     return true;
//   }

//   if (theta < semiDiamSun - semiDiamEarth) {
//     // isPenumbral = true;
//     return true;
//   }

//   // if (!isUmbral && !isPenumbral) isSun = true;
//   // return 2;
//   return true;
// };

// function getSunXYZ() {
//   const now = new Date();
//   let j = satellite.jday(now.getUTCFullYear(),
//                now.getUTCMonth() + 1,
//                now.getUTCDate(),
//                now.getUTCHours(),
//                now.getUTCMinutes(),
//                now.getUTCSeconds());
//   j += now.getUTCMilliseconds() * 1.15741e-8; // days per milliseconds
//   var gmst = gstime(j);
//   var jdo = new A.JulianDay(j); // now
  
//   var coord = A.EclCoord.fromWgs84(0,0,0);

//   // AZ / EL Calculation
//   var tp = A.Solar.topocentricPosition(jdo, coord, false);
//   var azimuth = tp.hz.az * this.RAD2DEG + 180 % 360;
//   var elevation = tp.hz.alt * this.RAD2DEG % 360;

//   // Range Calculation
//   var T = (new A.JulianDay(A.JulianDay.dateToJD(now))).jdJ2000Century();
//   var g = A.Solar.meanAnomaly(T)*180/Math.PI;
//   g = g % 360.0;
//   var R = 1.00014 - (0.01671 * Math.cos(g)) - (0.00014 * Math.cos(2 * g));
//   var range = R * 149597870700 / 1000; // au to km conversion

//   // RAE to ECI
//   var eci = satellite.ecfToEci(this.lookAnglesToEcf(azimuth, elevation, range, 0,0,0), gmst);

//   return {'x': eci.x, 'y': eci.y, 'z': eci.z};
// }

// function lookAnglesToEcf(azimuthDeg, elevationDeg, slantRange, obs_lat, obs_long, obs_alt) {
//   // site ecef in meters
//   var geodeticCoords = {};
//   geodeticCoords["latitude"] = obs_lat;
//   geodeticCoords["longitude"] = obs_long;
//   geodeticCoords["height"] = obs_alt;

//   var siteXYZ = satellite.geodeticToEcf(geodeticCoords);
//   var sitex, sitey, sitez;
//   sitex = siteXYZ.x;
//   sitey = siteXYZ.y;
//   sitez = siteXYZ.z;

//   // some needed calculations
//   var slat = Math.sin(obs_lat);
//   var slon = Math.sin(obs_long);
//   var clat = Math.cos(obs_lat);
//   var clon = Math.cos(obs_long);

//   var azRad = this.DEG2RAD * azimuthDeg;
//   var elRad = this.DEG2RAD * elevationDeg;

//   // az,el,range to sez convertion
//   var south  = -slantRange * Math.cos(elRad) * Math.cos(azRad);
//   var east   =  slantRange * Math.cos(elRad) * Math.sin(azRad);
//   var zenith =  slantRange * Math.sin(elRad);

//   var x = ( slat * clon * south) + (-slon * east) + (clat * clon * zenith) + sitex;
//   var y = ( slat * slon * south) + ( clon * east) + (clat * slon * zenith) + sitey;
//   var z = (-clat *        south) + ( slat * zenith) + sitez;
  
//   return {'x': x, 'y': y, 'z': z};
// }

// // Calculate Magnitude
// function calcMagnitude(phaseAngle, satRange) {
//   const stdMag = -1.8; // ISS intrinsic brightness at 1000km
//   const phaseAngleToRadians = satellite.degreesToRadians(phaseAngle);

//   const term_1 = stdMag;
//   const term_2 = 5.0 * Math.log10(satRange / 1000.0);

//   const arg = Math.sin(phaseAngleToRadians) + (Math.PI - phaseAngleToRadians) * Math.cos(phaseAngleToRadians);
//   const term_3 = -2.5 * Math.log10(arg);

//   const apparentMagnitude = term_1 + term_2 + term_3;
//   return apparentMagnitude;
// }

// function submitSighting(data, elv: number, range: number) {
//   // console.log(data);
  
//   const opp: {
//     "startingTime": Date;
//     "maxElv": number;
//     "mag": number;
//     "sightingData": any
//   } = {
//     startingTime: data[0].satInfo.localTime,
//     maxElv: elv,
//     mag: this.calcMagnitude(
//       this.isSunlit(
//         data[0],
//         true
//       ),
//       range
//     ),
//     sightingData: data
//   };
//   // console.log(opp);
//   this.sightingOpp.push(opp);
//   console.log(this.sightingOpp);
  
// }