import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import { ReferencePosition } from "../models/locations.model";
import { getTimes } from 'suncalc';
import { getCoordination, getSatrec } from "./satelliteRec";

interface ObserveDateRange { start: Date, end: Date };

export function selectLocation(observeCoords: ReferencePosition, date: Date) {
  let observeRange: ObserveDateRange;

  for (let i = 0; i < TRACKER_CONSTSNTS.OBSERVE_RANGE_DAY; i++) {
    observeRange = calcSunTime(observeCoords.latitude, observeCoords.longitude, date);
    date.setDate(date.getDate() + 1);  
        
    // calcLocalSatPos(observeRange);
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

// function calcLocalSatPos(observeRange: ObserveDateRange) {    
//     const dt = Math.trunc((observeRange.end.getTime() - observeRange.start.getTime()) / 450);
//     let innerDt: number = 1000;
//     let currentTime = observeRange.start.getTime();
//     let currentSatData: any;
//     let maxElevation: number = 0;
//     let maxRange: number = 0;
    
//     let innerRangeMarker: number;
//     let maxInnerRange: number;
//     let preElv: number;
//     let preCheckedRange;
//     let tempSightingData;
        
    
//     let sightingData = [];
    
//     // Set the loop range from 'dusk' to 'dawn' 
//     while (currentTime < observeRange.end.getTime()) {
//       currentSatData = getCoordination();
//       // console.log(`======||||||||||||||=======${currentSatData[2].localTime}==(elv : ${currentSatData[2].elevation})=====|||||||||||||===========`);
//       // Check if satellite if It's above the observer horizon (10 degree above horizon)
//       if (currentSatData.satInfo.elevation > 10) {
//         // console.log(`=============${currentSatData[2].localTime}=========(elv : ${currentSatData[2].elevation})=========`);
        
//         preElv = currentSatData.satInfo.elevation;
//         innerRangeMarker = currentTime - dt;
//         maxInnerRange = currentTime + dt;
        
//         if (preCheckedRange != currentTime) {
//           // console.log(`ok current is not equal to preRange`);
          
//           preCheckedRange = maxInnerRange;
          
//           // Set the loop range from 'previous time' to 'next time' 
//           while (innerRangeMarker < maxInnerRange) {
            
//             currentSatData = this.convertTLE(true, innerRangeMarker);            
//             // console.log(`---------CHECKing ${currentSatData[2].localTime}----elv : (${currentSatData[2].elevation})------`);
//             if (currentSatData.satInfo.elevation > 10) {
//               // console.log(`ok elv is MORE than 10`);
              
//               if (sightingData.length == 0 && this.isSunlit(currentSatData)) {
//                 // console.log(`ok catch the FIRST sighting`);
//                 sightingData.push(currentSatData);
//               }
//               // Set the max elevation to whatever is more than previous max value
//               if (sightingData.length != 0 ) {
//                 if (maxElevation < currentSatData.satInfo.elevation) {
//                   // console.log(`ok catch MAX elv`);
//                   maxElevation = currentSatData.satInfo.elevation;
//                   maxRange = currentSatData.satInfo.range;
//                   if (sightingData.length > 1) {
//                     // console.log(`POP action`);
//                     sightingData.pop();
//                   }
//                   sightingData.push(currentSatData);
//                 }
//                 if (!this.isSunlit(currentSatData)) {
//                   // console.log(`ok catch MAX as LAST -- BREAK`);
//                   sightingData.push(currentSatData);
//                   this.submitSighting(sightingData, maxElevation, maxRange);
//                   sightingData = [];
//                   maxElevation = 0;
//                   maxRange = 0
//                   innerRangeMarker = maxInnerRange;
//                 }  
//                 // console.log(`size of array is ${sightingData.length}`);
                               
//               }
//             }
//             else if (sightingData.length != 0 && (currentSatData.satInfo.elevation < 10 || innerRangeMarker+innerDt>maxInnerRange)) {
//               // console.log(`NOT ok elv is LESS more than 10 -- PUSH TO SIGHTINGOPP`);
//               sightingData.push(currentSatData);              
//               this.submitSighting(sightingData, maxElevation, maxRange);              
//               maxElevation = 0;
//               maxRange = 0;
//               sightingData = [];
//               innerRangeMarker = maxInnerRange;
//             }
//             innerRangeMarker += innerDt;
//           }
//         }
//       }
//       else if (preElv > 10 && currentSatData.satInfo.elevation < 10) {
//         preElv = undefined;
//         currentTime += 75*60000;
//       }
//       currentTime += dt;
//     }
//     // console.log(this.sightingOpp);
// }