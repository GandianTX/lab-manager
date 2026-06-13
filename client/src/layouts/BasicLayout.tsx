import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, theme } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ExperimentOutlined,
  ToolOutlined,
  ScheduleOutlined,
  AlertOutlined,
  NotificationOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../utils/useAuth';

const { Header, Sider, Content } = Layout;

/** admin 菜单 */
const adminMenuItems = [
  { key: '/dashboard',   icon: <DashboardOutlined />,   label: '首页' },
  { key: '/user',        icon: <TeamOutlined />,         label: '用户管理' },
  { key: '/lab',         icon: <ExperimentOutlined />,   label: '实验室管理' },
  { key: '/device',      icon: <ToolOutlined />,         label: '设备管理' },
  { key: '/reservation', icon: <ScheduleOutlined />,     label: '预约管理' },
  { key: '/repair',      icon: <AlertOutlined />,        label: '报修管理' },
  { key: '/notice',      icon: <NotificationOutlined />, label: '公告管理' },
];

/** student 菜单 */
const studentMenuItems = [
  { key: '/dashboard',   icon: <DashboardOutlined />,   label: '首页' },
  { key: '/profile',     icon: <UserOutlined />,         label: '个人信息' },
  { key: '/lab',         icon: <ExperimentOutlined />,   label: '实验室浏览' },
  { key: '/device',      icon: <ToolOutlined />,         label: '设备浏览' },
  { key: '/reservation', icon: <ScheduleOutlined />,     label: '我的预约' },
  { key: '/repair',      icon: <AlertOutlined />,        label: '我的报修' },
  { key: '/notice',      icon: <NotificationOutlined />, label: '公告浏览' },
];

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token: themeToken } = theme.useToken();

  const { user, isAdmin } = useAuth();
  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const userMenuDropdownItems = [
    { key: 'role', label: `角色：${isAdmin ? '管理员' : '学生'}`, disabled: true },
    { type: 'divider' as const },
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
          <Dropdown menu={{ items: userMenuDropdownItems, onClick: ({ key }) => key === 'logout' && handleLogout() }}>
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
};

export default BasicLayout;
