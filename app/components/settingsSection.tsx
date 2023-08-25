'use client';
import { Menu, Space, Form, Button, Tooltip } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { AimOutlined, InfoCircleOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Avatar from "antd/es/avatar/avatar";
import Input from "antd/es/input/Input";

type FieldType = {
    location?: string;
    // password?: string;
    // remember?: string;
};

export default function Settings() {
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
                <Space direction="vertical" style={{marginTop: '16px'}}>
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
                    <Input
                        style={{ width: '100%' }}
                        placeholder="Enter your location"
                        prefix={<AimOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="Enter your current location to start magic!">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    </Form.Item>
                </Form>
                </Space>
                
            </Card>
        </>
    );
}