"use client";

import { useEffect, useState, useMemo } from "react";
import { TleData, SatelliteCoord } from "../../models/satellite.model";
import { getCoordination, getSatrec } from "../../helpers/satelliteRec";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import TRACKER_CONSTSNTS from "../../constants/trackerConstants";
import dynamic from 'next/dynamic'
import { drawOrbit } from "../../helpers/mapCalc";

import { Button, ConfigProvider, Layout, Space } from 'antd';
import theme from '../../theme/themeConfig';
import Navigation from "../../components/navigation";
const { Header, Footer, Sider, Content } = Layout;

const Map = dynamic(
  () => import('../../components/map'),
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
    const satRec = useMemo(() => getSatrec(tleData), [tleData]);
    const pastGroundTracks = drawOrbit({satRec, startTimeMS: new Date().getTime(), incoming: false});
    const incomingGroundTracks = drawOrbit({satRec, startTimeMS: new Date().getTime(), incoming: true});


    const [satelliteCoord, seCoordinate] = useState<SatelliteCoord | undefined>(undefined);


    const setCoord = () => {
      seCoordinate(getCoordination(satRec));
    };

    useEffect(() => {
        setCoord();

        const interval = setInterval(setCoord, TRACKER_CONSTSNTS.LIVE_REFRESH_MS);
        return () => clearInterval(interval);
    }, [])

    const headerStyle: React.CSSProperties = {
      // textAlign: 'center',
      // color: '#fff',
      // height: 64,
      // paddingInline: 50,
      // lineHeight: '64px',
      // backgroundColor: '#7dbcea',
    };
    
    const contentStyle: React.CSSProperties = {
      textAlign: 'center',
      minHeight: 120,
      lineHeight: '120px',
      color: '#fff',
      backgroundColor: '#108ee9',
    };
    
    const footerStyle: React.CSSProperties = {
      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#7dbcea',
    };
    
    return (
      <ConfigProvider theme={theme}>
        {/* <div className="center">
          <Button type="primary">Button</Button>
          {satelliteCoord && <Map 
            target={satelliteCoord}
            incomingGroundTracks={incomingGroundTracks}
            pastGroundTracks={pastGroundTracks}
          />}
        </div> */}
        <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
          <Layout>
            <Header style={headerStyle}>
              <Navigation/>
            </Header>
            <Content style={contentStyle}>Content</Content>
            <Footer style={footerStyle}>Footer</Footer>
          </Layout>
        </Space>
      </ConfigProvider>
    );
}
