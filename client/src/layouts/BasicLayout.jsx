import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, theme } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ToolOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/dashboard',  icon: <DashboardOutlined />,  label: '首页' },
  { key: '/user',       icon: <TeamOutlined />,        label: '用户管理' },
  { key: '/resource',   icon: <ToolOutlined />,         label: '资源管理' },
  { key: '/borrow',     icon: <ScheduleOutlined />,     label: '借用管理' },
  { key: '/notice',     icon: <NotificationOutlined />, label: '公告管理' },
];

export default function BasicLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: themeToken } = theme.useToken();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const userMenuItems = [
    { key: 'role', label: `角色：${user.role === 'admin' ? '管理员' : '普通用户'}`, disabled: true },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: collapsed ? 16 : 18, fontWeight: 600,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          {collapsed ? 'LR' : '实验资源管理'}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}
          items={menuItems} onClick={({ key }) => navigate(key)} />
      </Sider>
      <Layout>
        <Header style={{
          background: themeToken.colorBgContainer, padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
        }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)} />
          <Dropdown menu={{ items: userMenuItems, onClick: ({ key }) => key === 'logout' && handleLogout() }}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserOutlined style={{ fontSize: 18 }} />
              <span>{user.username}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: themeToken.colorBgContainer, borderRadius: 8, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
