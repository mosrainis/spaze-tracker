'use client';

import dynamic from 'next/dynamic'

import { Row, Col } from 'antd';
import Settings from "../components/settingsSection";

import { SatRec } from "satellite.js";
import satrecContext from '../../contexts/satellite.context';

const Map = dynamic(
  () => import('../components/map'),
  { ssr: false }
)

interface MapInput {
    satRec: SatRec;
}

export default function InPage({satRec}: MapInput) {
  
  return (
    <satrecContext.Provider value={satRec}>
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
    </satrecContext.Provider >
  );
}
