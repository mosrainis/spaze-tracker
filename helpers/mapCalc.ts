import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import { getCoordination } from "./satelliteRec";
import { SatRec } from "satellite.js";
import { SatelliteCoord } from "../models/satellite.model";


const dt: number = (92 / TRACKER_CONSTSNTS.NUMBER_OF_ORBIT_POINTS) * 60000;

interface drawProps {
  satRec: SatRec;
  startTimeMS: number;
  incoming: boolean;
}

export function drawOrbit({satRec, startTimeMS, incoming}: drawProps) {
  const direction = incoming ? 1 : -1;
  let coordinatePair: SatelliteCoord;
  let timeMS = startTimeMS;

  const groundTracks = {
    type1: [] as any[],
    type2: [] as any[]
  }

  function checkCondition(coordinatePair: SatelliteCoord) {
    const lastIndex = groundTracks.type1.length - 1;
    return groundTracks.type1.length !== 0 && (
        (incoming && coordinatePair.long < groundTracks.type1[lastIndex][1]) ||
        (!incoming && coordinatePair.long > groundTracks.type1[lastIndex][1])
    );
  };

  for (let i = 0; i < TRACKER_CONSTSNTS.NUMBER_OF_ORBIT_POINTS; i++) {          
    
    coordinatePair = getCoordination(satRec, {
      date: new Date(timeMS)
    });
    let groundTrackDefaultType: boolean = true;
    
    
    if (checkCondition(coordinatePair)) {
      groundTrackDefaultType = false;
    }
    
    const trackTypeArray = groundTrackDefaultType ? groundTracks.type1 : groundTracks.type2;

    trackTypeArray.push([coordinatePair.lat, coordinatePair.long]);
    
    timeMS += direction * dt;
  }
  
  return groundTracks;
  }