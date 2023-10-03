'use client';
import { MailOutlined, GithubOutlined } from '@ant-design/icons';
import { Menu } from "antd";

const items = [
    {
        label: (
          <a href="https://github.com/mosrainis/spaze-tracker/" target="_blank" rel="noopener noreferrer">
            Github Page
          </a>
        ),
        key: 'source',
        icon: <GithubOutlined />,
    },
    {
        label: (
          <a href="https://www.linkedin.com/in/mostafa-esmaeilian/" target="_blank" rel="noopener noreferrer">
            Contact Me
          </a>
        ),
        key: 'contact',
        icon: <MailOutlined />,
    }
]

export default function Navigation() {
    return (
        <>
            <div className="demo-logo" />
                <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={items}
            />
        </>
    );
}