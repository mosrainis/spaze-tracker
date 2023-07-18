import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TleData, SatelliteCoord } from "../models/satellite.model";
import { getCoordination, getSatrec } from "../helpers/satelliteRec";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import TRACKER_CONSTSNTS from "../constants/trackerConstants";
import dynamic from 'next/dynamic'
import { drawOrbit } from "../helpers/mapCalc";

const Map = dynamic(
  () => import('../components/map'),
  { ssr: false }
)

export const getStaticProps: GetStaticProps<{
    tleData: TleData
  }> = async () => {
    const { ISS_TLE } = TRACKER_CONSTSNTS;
    const url = (ISS_TLE);
    const res = await fetch(url);
    const tleData = await res.json();
    return { props: { tleData } };
}

export default function Tracker({
    tleData
  }: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const satRec = getSatrec(tleData);
    const groundTracks = drawOrbit({satRec, startTimeMS: new Date().getTime()})

    const [satelliteCoord, seCoordinate] = useState<SatelliteCoord | undefined>(undefined);


    const setCoord = () => {
      seCoordinate(getCoordination(satRec));
    };

    useEffect(() => {
        if(!router.isReady) return;
        setCoord();
        const interval = setInterval(() => {
          setCoord();
        }, TRACKER_CONSTSNTS.LIVE_REFRESH_MS);
        return () => clearInterval(interval);
    }, [router.isReady])
    
    return (
        <div className="center">
            {satelliteCoord && <Map target={satelliteCoord} groundTracks={groundTracks}/>}
        </div>
    );
}
