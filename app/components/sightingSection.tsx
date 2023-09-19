'use client';
import { Typography, Divider, Steps} from "antd";
const { Text } = Typography;

import { Sighting } from "../../models/satellite.model";

interface SightingInput {
    sightings: Sighting[];
}

export default function SightingSection({sightings}: SightingInput) {

    const items = sightings.map(v => ({
        title: `${v.startingTime.toISOString().split('T')[0]} - ${v.startingTime.toTimeString().split(' ')[0]}`,
        description: `Appears At elevation of ${v.sightingData[0].satInfo?.elevation.toFixed(0)} degrees`
    }));

    return (
        <>
            <Divider />
            <Text italic>Look up ! You have {sightings.length} opportunity to spot ISS in your sky.</Text>
            <Steps
                progressDot
                current={-1}
                size="small"
                direction="vertical"
                items={items}
            />
        </>
    );
}