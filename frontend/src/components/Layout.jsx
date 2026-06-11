import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/watches',
    icon: <FieldTimeOutlined />,
    label: '我的表',
  },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = menuItems.find((item) =>
    location.pathname === item.key || (item.key !== '/' && location.pathname.startsWith(item.key))
  )?.key || '/'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: '#1a1a1a',
          borderRight: '1px solid #333',
        }}
      >
        <div
          style={{
            height: 48,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #333',
            paddingBottom: 16,
          }}
        >
          <span
            style={{
              color: '#D4A853',
              fontSize: collapsed ? 18 : 20,
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {collapsed ? '⚙' : '🕐 表管家'}
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: '#1a1a1a', border: 'none' }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#1a1a1a',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
          }}
        >
          <h1
            style={{
              color: '#D4A853',
              fontSize: 18,
              fontWeight: 600,
              margin: 0,
              letterSpacing: 2,
            }}
          >
            机械表保养与走时记录
          </h1>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#1a1a1a',
            borderRadius: 8,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
