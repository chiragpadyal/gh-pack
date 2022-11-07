import { Layout } from "antd";
import React from "react";
import TableLayout from "./TableLayout";
const { Header, Content } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const LayoutMain = () => {
  return (
    <Layout className="site-layout">
      <Header
        className="site-layout-background"
        style={{
          padding: 0,
        }}
      />
      <Content
        style={{
          margin: "0 16px",
        }}
      >
        <TableLayout />
      </Content>
    </Layout>
  );
};
export default LayoutMain;
