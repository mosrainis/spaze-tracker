'use client';

import { Layout, ConfigProvider } from "antd";
import Navigation from "../components/navigation";
const { Header, Footer, Sider, Content } = Layout;
import theme from '../../theme/themeConfig';

export default function TrackerLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

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
        minHeight: '93.1vh',
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#fff',
    };
    
    const footerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#7dbcea',
    };

    return (
        <ConfigProvider theme={theme}>
            <Layout>
                <Header style={headerStyle}>
                    <Navigation/>
                </Header>
                <Content style={contentStyle}>{children}</Content>
                <Footer style={footerStyle}>Footer</Footer>
            </Layout>
        </ConfigProvider>
    )
}
  