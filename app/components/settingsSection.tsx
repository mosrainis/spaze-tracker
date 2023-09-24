'use client';
import { Menu, Space, Form, Button, Tooltip, Typography, Empty } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { InfoCircleOutlined, SlidersFilled, EditOutlined } from '@ant-design/icons';
import Avatar from "antd/es/avatar/avatar";
import Input from "antd/es/input/Input";
import DebounceSelect from "./UI/debounceSelect";
import { useState, useContext, SetStateAction, useRef } from "react";
import { Location, ReferencePosition } from "../../models/locations.model";
import { icon } from "leaflet";
import { getSightings } from "../../helpers/observeCalc";
import satrecContext from "../../contexts/satellite.context";
import { Sighting } from "../../models/satellite.model";
import SightingSection from "./sightingSection";
const { Text } = Typography;

interface LocationValue {
    value: string;
    data?: ReferencePosition
}

type FieldType = {
    location?: string;
    // password?: string;
    // remember?: string;
};

async function fetchLocationList(text: string): Promise<LocationValue[]> {
    // return fetch(`https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${text}&apiKey=RVVfNDM2MDVjN2E1YjA2NDA0MmI2ZjE1YmRmNWNmMDcwMDQ6OTEwMDk2N2QtNjVlOS00MmUyLTk4MTItZmE2OTljMmNjNjA5`)
    //   .then((response) => response.json())
    //   .then(res => {
    //       console.log(res);
    //       return res;
    //   })
    //   .then((body) => 
    //     body.locations.map(
    //       (location: Location) => ({
    //         label: `${location.address.countryName} ${location.address.city}`,
    //         value: location.referencePosition.latitude,
    //       }),
    //     ),
    //   );
    return new Promise<any>((resolve) => {
        resolve([{
            // label: `Iran Tehran`,
            value: 'Tehran, Iran',
            data: {
                "latitude": 35.689,
                "longitude": 51.390
            }
        }
    ]);
    });
}

export default function Settings() {
    const [userLocation, setUserLocation] = useState<LocationValue>();
    const [sightings, setSightings] = useState<Sighting[]>();
    const satrec = useContext(satrecContext);
    const locationInput = useRef(null);
    
    const startMagic = () => {
        if(!userLocation?.data) return;
        const sightings = getSightings(satrec, userLocation.data);
        setSightings(sightings);
    }

    const editLocation = () => {
        setUserLocation(undefined);
        setSightings(undefined);
    }

    return (
        <>
            <Card
                style={{ width: '100%', height: '100%'}}
                // actions={[
                //     <SettingOutlined key="setting" />,
                //     <EditOutlined key="edit" />,
                //     <EllipsisOutlined key="ellipsis" />,
                // ]}
            >
                <Meta
                    avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1" />}
                    title="Observe ISS"
                />
                <Space direction="vertical" style={{marginTop: '16px', width: '100%'}}>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                    name="location"
                    rules={[{ required: true, message: 'Enter your location' }]}
                    >
                        <DebounceSelect
                            value={userLocation?.value as LocationValue | undefined}
                            placeholder="Enter your location"
                            fetchOptions={fetchLocationList}
                            onSelect={(newValue, option) => {
                                setUserLocation(option as SetStateAction<LocationValue | undefined>);
                            }}
                            style={{ width: '100%' }}
                            suffixIcon={
                                <Tooltip title="Enter your current location to start the magic!">
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            }
                        />
                    </Form.Item>
                    {
                        userLocation ? (
                            <Space direction="vertical" align="start" style={{width: '100%'}}>
                                <Text italic>
                                    You are at {userLocation.value}
                                    <Space style={{marginLeft: '6px'}}>
                                    <Tooltip title="Change location">
                                        <Button onClick={editLocation} type="dashed" shape="circle" icon={<EditOutlined />} />
                                    </Tooltip>
                                    </Space>
                                </Text>
                                <Text type="secondary">Lat: {userLocation.data?.latitude.toFixed(3)} | Long: {userLocation.data?.longitude.toFixed(3)}</Text>
                            </Space>  
                        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  imageStyle={{ marginBottom: '30px' }}/>
                    }

                    <Form.Item>
                    {/* <Button type="primary" htmlType="submit">
                        Submit
                    </Button> */}

                    {
                        userLocation &&
                            <Space style={{marginTop: '16px'}}>
                                { 
                                    sightings ? <SightingSection sightings={sightings} />
                                    : <Button onClick={startMagic} type="primary" shape="round" icon={<SlidersFilled />} size={'large'}>Start Magic</Button>
                                }
                            </Space>
                    }
                    </Form.Item>
                </Form>
                </Space>
                
            </Card>
        </>
    );
}