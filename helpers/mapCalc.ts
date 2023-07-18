import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import { getCoordination } from "./satelliteRec";
import { SatRec } from "satellite.js";
import { SatelliteCoord } from "../models/satellite.model";

interface drawProps {
    satRec: SatRec;
    startTimeMS: number;
}

export function drawOrbit({satRec, startTimeMS}: drawProps) {
    let coordinatePair: SatelliteCoord;
    let timeMS = startTimeMS;
    let futurePolyline1, futurePolyline2;
    const dt: number = (92 / TRACKER_CONSTSNTS.NUMBER_OF_ORBIT_POINTS) * 60000;
    const futureGroundTracks = {
        type1: [] as any[],
        type2: [] as any[]
    }

    // Future ground track
    for (let i = 0; i < TRACKER_CONSTSNTS.NUMBER_OF_ORBIT_POINTS; i++) {          

        coordinatePair = getCoordination(satRec, {
            date: new Date(timeMS)
        });

      let groundTrackDefaultType: boolean = true;

      if (
        futureGroundTracks.type1.length != 0
        && coordinatePair.long < futureGroundTracks.type1[futureGroundTracks.type1.length - 1][1]
      ) groundTrackDefaultType = false

      groundTrackDefaultType ?
        futureGroundTracks.type1.push([coordinatePair.lat, coordinatePair.long])
        : futureGroundTracks.type2.push([coordinatePair.lat, coordinatePair.long])
      
      timeMS += dt;
    }       
    
    return futureGroundTracks;

    // futurePolyline1 = L.polyline([
    //   futureGroundTracks.type1
    // ],{color: '#56cbf9', dashArray: '5, 5'}).addTo(this.satelliteMap)

    // this.futurePolyline2 = L.polyline([
    //   this.futureGroundTracks.type2
    // ],{color: '#56cbf9', dashArray: '5, 5'}).addTo(this.satelliteMap)
    // timeMS = currentTimeMS || new Date().getTime();

    // Previous ground track
    // for (let i = 0; i < this.numberOfPoints; i++) {
      
    //   coordinatePair = this.convertTLE(false, timeMS);

    //   let groundTrackDefaultType: boolean = true;
      
    //   if (
    //     this.preGroundTracks.type1.length != 0
    //     && coordinatePair.long > this.preGroundTracks.type1[this.preGroundTracks.type1.length - 1][1]
    //   ) groundTrackDefaultType = false

    //   groundTrackDefaultType ?
    //     this.preGroundTracks.type1.push([coordinatePair.lat, coordinatePair.long])
    //     : this.preGroundTracks.type2.push([coordinatePair.lat, coordinatePair.long])
            
    //     timeMS -= this.dt;
    // }

    // // console.log("past :", this.preGroundTracks);
    
    // this.prePolyline1 = L.polyline([
    //   this.preGroundTracks.type1
    // ],{color:'red'}).addTo(this.satelliteMap)

    // this.prePolyline2 = L.polyline([
    //   this.preGroundTracks.type2
    // ],{color:'red'}).addTo(this.satelliteMap)

    // this.drawLineInfo();
  }