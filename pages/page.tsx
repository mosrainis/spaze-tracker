import { useRouter } from "next/router";
import { useEffect } from "react";
import { TleData } from "../models/satellite.model";
import { getCoordination, getSatrec } from "../helpers/satelliteRec";

export default function Player() {
    const router = useRouter();

    const tleData: TleData = {
        line1: '1 25544U 98067A   23193.85132576  .00008865  00000+0  16485-3 0  9998',
        line2: '2 25544  51.6419 201.3435 0000251  80.9860 340.3946 15.49693145405774'
      };
    
    console.log('here mate', getCoordination(getSatrec(tleData)));

    useEffect(() => {
        if(!router.isReady) return;
    }, [router.isReady])
    
    return (
        <div className="center">
        </div>
    );
}
