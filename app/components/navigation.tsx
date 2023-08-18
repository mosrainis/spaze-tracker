'use client';

import { Menu } from "antd";

export default function Navigation() {
    return (
        <>
            <div className="demo-logo" />
                <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={new Array(15).fill(null).map((_, index) => {
                    const key = index + 1;
                    return {
                    key,
                    label: `nav ${key}`,
                    };
                })}
            />
        </>
    );
}