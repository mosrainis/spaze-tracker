import { UTCDate } from "../models/satellite.model";

export const getUTCData = (date: Date): UTCDate => {
    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        date: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds()
    }
};

export const getDuration = (startDate: any, endDate: any): String => {

    const diffTime = Math.abs(endDate - startDate);
    return millisecondsToFormattedTime(diffTime)
};

export function millisecondsToFormattedTime(milliseconds: number) {

    const days = Math.floor(milliseconds / 86400000); // 1 day = 24 * 60 * 60 * 1000 ms
    milliseconds %= 86400000;
    const hours = Math.floor(milliseconds / 3600000);
    milliseconds %= 3600000;
    const minutes = Math.floor(milliseconds / 60000);
    milliseconds %= 60000;
    const seconds = Math.floor(milliseconds / 1000);
  
    let formattedTime = '';
    if (days > 0) {
        formattedTime += `${days}d `;
    }
    formattedTime += `${hours}h ${minutes}m ${seconds}s`;
  
    return formattedTime;
  }

export function azimuthToCardinal(angle: number | undefined): string {
    if(!angle) return '--';

    const directions = [
      "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ];
  
    // Ensure the angle is between 0 and 360 degrees
    angle = (angle + 360) % 360;
  
    // Calculate the index for the cardinal direction
    const index = Math.round(angle / 22.5);
  
    return directions[index % 16];
}

export function kilometersToRadians(distanceKm: number | undefined, minDistanceKm: number | undefined, maxDistanceKm: number | undefined): number {
    if(!distanceKm || !minDistanceKm || !maxDistanceKm) return 0;
    // Ensure the input distance is within the specified range
    if (distanceKm < minDistanceKm) {
      distanceKm = minDistanceKm;
    } else if (distanceKm > maxDistanceKm) {
      distanceKm = maxDistanceKm;
    }
  
    // Calculate the range of radians (in this case, from 0 to Math.PI)
    const minRadians = 0;
    const maxRadians = Math.PI;
  
    // Perform linear interpolation to convert distance to radians
    const radians = ((distanceKm - minDistanceKm) / (maxDistanceKm - minDistanceKm)) * (maxRadians - minRadians);
  
    return radians;
  }