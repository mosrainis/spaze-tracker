import { TleData } from "../../models/satellite.model";
import { getSatrec } from "../../helpers/satelliteRec";
import TRACKER_CONSTSNTS from "../../constants/trackerConstants";
import InPage from "./page.index";

async function getTleData(): Promise<TleData> {
  const { ISS_TLE } = TRACKER_CONSTSNTS;
  const url = (ISS_TLE);
  const res = await fetch(url, {cache: "force-cache"});
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

export default async function Tracker() {
  const tleData = await getTleData();
  const satRec = getSatrec(tleData);
  
  return (
    <InPage satRec={satRec} />
  );
}
