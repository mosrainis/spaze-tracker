'use client';
import { Menu, Space, Form, Button, Tooltip, Typography, Empty } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { InfoCircleOutlined, SlidersFilled } from '@ant-design/icons';
import Avatar from "antd/es/avatar/avatar";
import Input from "antd/es/input/Input";
import DebounceSelect from "./UI/debounceSelect";
import { useState } from "react";
import { Location, ReferencePosition } from "../../models/locations.model";
import { icon } from "leaflet";
import { selectLocation } from "../../helpers/observeCalc";
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
            value: 'Iran Tehran',
            data: {
                "latitude": 37.40966033935547,
                "longitude": 49.953861236572266
            }
        }]);
    });
}

export default function Settings() {
    const [userLocation, setUserLocation] = useState<any>();

    const startMagic = () => {
        selectLocation(userLocation, new Date());
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
                                console.log(newValue, option);
                                setUserLocation(option);
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
                                <Text italic>You are here:</Text>
                                <Text type="secondary">- Latitude : {userLocation.data.latitude.toFixed(3)}</Text>
                                <Text type="secondary">- Longitude : {userLocation.data.longitude.toFixed(3)}</Text>
                            </Space>  
                        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}  imageStyle={{ marginBottom: '30px' }}/>
                    }

                    <Form.Item>
                    {/* <Button type="primary" htmlType="submit">
                        Submit
                    </Button> */}

                    <Button onClick={startMagic} type="primary" shape="round" icon={<SlidersFilled />} size={'large'}>
                        Start Magic
                    </Button>
                    </Form.Item>
                </Form>
                </Space>
                
            </Card>
        </>
    );
}