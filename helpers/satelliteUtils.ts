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