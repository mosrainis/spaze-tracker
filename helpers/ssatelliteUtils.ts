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