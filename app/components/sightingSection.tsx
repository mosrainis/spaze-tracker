'use client';
import { Typography, Divider, Space, Tabs, TabsProps} from "antd";
const { Text } = Typography;

import { Sighting } from "../../models/satellite.model";
import { RiseOutlined } from '@ant-design/icons';
import SightingDetail from "./sightingDetail";

interface SightingInput {
    sightings: Sighting[];
}

export default function SightingSection({sightings}: SightingInput) {
    // console.log('sightings', sightings);
    
    // const items = sightings.map(v => ({
    //     title: `${v.startingTime.toISOString().split('T')[0]} - ${v.startingTime.toTimeString().split(' ')[0]}`,
    //     description: `Appears At elevation of ${v.sightingData[0].satInfo?.elevation.toFixed(0)} degrees`
    // }));

    return (
        <>
            <Divider />
            <Text italic>Look up ! You have {sightings.length} opportunity to spot ISS in your sky.</Text>
            <Divider />
            <Space direction="vertical" style={{width: '100%'}}>
                {
                    sightings.map((item, i) => 
                        <Space key={`sighting-${i}`} style={{width: '100%', justifyContent: 'space-between'}} >
                            <RiseOutlined />
                            <Space direction="vertical">
                                <Text>{ item.startingTime.toISOString().split('T')[0]}</Text>
                                <Text>{item.startingTime.toTimeString().split(' ')[0]}</Text>
                            </Space>
                            <SightingDetail data={item}/>
                        </Space>
                    )
                }
            </Space>
        </>
    );
}