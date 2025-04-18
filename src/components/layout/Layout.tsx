import { FC, PropsWithChildren } from 'react';
import { Layout as AntLayout } from 'antd';
import "./Layout.css";

const { Header, Content, Sider } = AntLayout;

interface LayoutProps extends PropsWithChildren {
  sidebarCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Layout: FC<LayoutProps> = ({ children, sidebarCollapsed, onCollapse }) => {
  return (
    <AntLayout>
      <Sider collapsible collapsed={sidebarCollapsed} onCollapse={onCollapse}>
        {/* Sidebar content here */}
      </Sider>
      <AntLayout>
        <Header>
          {/* Header content here */}
        </Header>
        <Content>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;