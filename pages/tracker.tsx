import { useRouter } from "next/router";
import { useEffect } from "react";
import { TleData } from "../models/satellite.model";
import { getCoordination, getSatrec } from "../helpers/satelliteRec";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import TRACKER_CONSTSNTS from "../constants/trackerConstants";

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
    
    console.log('here mate', getCoordination(getSatrec(tleData)));

    useEffect(() => {
        if(!router.isReady) return;
    }, [router.isReady])
    
    return (
        <div className="center">
        </div>
    );
}
