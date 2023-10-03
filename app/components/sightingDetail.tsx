'use client';

import { Button, Modal, Row, Col, Space, Typography } from "antd";
const { Text, Title } = Typography;
import { useState, useEffect } from "react";
import { Sighting } from "../../models/satellite.model";
import { millisecondsToFormattedTime } from "../../helpers/satelliteUtils";
import PolarChart from "./UI/polarChart";

interface SightingDetailInput {
    data: Sighting
}

interface InfoItemInput {
    title: String;
    value?: String | number; 
}

export default function SightingDetail({data}: SightingDetailInput) {
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if(!data) return;
        const satInfo = data.sightingData[2].satInfo;
        if(!satInfo) return;

        const updateCountdown = () => {
          const currentDate = new Date();
          const currentTime = currentDate.getTime();
          const timeDifference = satInfo.localTime.getTime() - currentTime;
    
          if (timeDifference <= 0) {
            setCountdown('Already Passed');
          } else {
            const formattedCountdown = millisecondsToFormattedTime(timeDifference);
            setCountdown(formattedCountdown);
          }
        };
    
        const intervalId = setInterval(updateCountdown, 1000);
    
        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [data]);

    const title = `Sighting at ${data.startingTime.toISOString().split('T')[0]}`;
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal} size="small">
                Details
            </Button>
            <Modal title={title} open={isModalOpen} onOk={handleOk} footer={null} onCancel={handleCancel}>
                <Row>
                    <Title type="secondary" level={5} style={{ margin: 0 }}>
                       {countdown}
                    </Title>
                </Row>
                <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title='Start time'
                            value={data.sightingData[0].satInfo?.time}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="Duration"
                            value={data.duration}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="End time"
                            value={data.sightingData[2].satInfo?.time}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="Start elev."
                            value={`${data.sightingData[0].satInfo?.elevation.toFixed(0)}\u00b0`}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="Max elev."
                            value={`${data.maxElv.toFixed(0)}\u00b0`}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="End Elev."
                            value={`${data.sightingData[2].satInfo?.elevation.toFixed(0)}\u00b0`}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="Satrt Direction"
                            value={`${data.sightingData[0].satInfo?.azimuth.toFixed(0)}\u00b0`}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="Magnitude"
                            value={`${data.mag.toFixed(1)}`}
                        />
                    </Col>
                    <Col span={8} style={{textAlign: 'center'}}>
                        <InfoItem
                            title="End Direction"
                            value={`${data.sightingData[2].satInfo?.azimuth.toFixed(0)}\u00b0`}
                        />
                    </Col>
                </Row>
                <Row>
                    <PolarChart />
                </Row>
            </Modal>
        </>
    );
}

function InfoItem({title, value}: InfoItemInput) {

    return (
        <Space direction="vertical" align="center">
            <Text strong >{title}</Text>
            <Text>{value ?? '---'}</Text>
        </Space>
    );
}