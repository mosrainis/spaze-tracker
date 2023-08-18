import { TleData, SatelliteCoord } from "../../models/satellite.model";
import { getCoordination, getSatrec } from "../../helpers/satelliteRec";
import TRACKER_CONSTSNTS from "../../constants/trackerConstants";
import dynamic from 'next/dynamic'
import { drawOrbit } from "../../helpers/mapCalc";

import { Space } from 'antd';

const Map = dynamic(
  () => import('../components/map'),
  { ssr: false }
)

async function getTleData(): Promise<TleData> {
    const { ISS_TLE } = TRACKER_CONSTSNTS;
    const url = (ISS_TLE);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json();
}

export default async function Tracker() {
  const tleData = await getTleData();
  const satRec = getSatrec(tleData);
  const pastGroundTracks = drawOrbit({satRec, startTimeMS: new Date().getTime(), incoming: false});
  const incomingGroundTracks = drawOrbit({satRec, startTimeMS: new Date().getTime(), incoming: true});


  // const [satelliteCoord, seCoordinate] = useState<SatelliteCoord | undefined>(undefined);


  // const setCoord = () => {
  //   seCoordinate(getCoordination(satRec));
  // };

  // useEffect(() => {
  //     setCoord();

  //     const interval = setInterval(setCoord, TRACKER_CONSTSNTS.LIVE_REFRESH_MS);
  //     return () => clearInterval(interval);
  // }, [])

  
  
  return (
    <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
      <Map 
        target={getCoordination(satRec)}
        incomingGroundTracks={incomingGroundTracks}
        pastGroundTracks={pastGroundTracks}
      />
    </Space>
  );
}
