import { TleData } from "../../models/satellite.model";
import { getSatrec } from "../../helpers/satelliteRec";
import TRACKER_CONSTSNTS from "../../constants/trackerConstants";
import dynamic from 'next/dynamic'

import { Row, Col } from 'antd';
import Settings from "../components/settingsSection";

const Map = dynamic(
  () => import('../components/map'),
  { ssr: false }
)

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
    <Row>
      <Col flex="300px">
        <Settings/>
      </Col>
      <Col flex="auto">
        <Map 
          satRec={satRec}
        />
      </Col>
    </Row>
  );
}