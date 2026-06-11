import { useState, useEffect } from 'react'
import { Card, Table, Tag, Statistic, Row, Col, Alert, Spin } from 'antd'
import {
  ToolOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { dashboardAPI } from '../api'

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await dashboardAPI.get()
      setData(res)
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  const maintenanceAlerts = data?.maintenanceAlerts || []
  const wearingAlerts = data?.wearingAlerts || []
  const deviationOverview = data?.deviationOverview || []

  const maintenanceColumns = [
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '上次保养',
      dataIndex: 'lastMaintenance',
      key: 'lastMaintenance',
      render: (val) => val ? dayjs(val).format('YYYY-MM-DD') : '-',
    },
    {
      title: '已超期(月)',
      dataIndex: 'overdueMonths',
      key: 'overdueMonths',
      render: (val) => <Tag color="red">{val}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <a onClick={() => navigate(`/watches/${record.id}/maintenance`)}>去保养</a>
      ),
    },
  ]

  const wearingColumns = [
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '上次佩戴',
      dataIndex: 'lastWorn',
      key: 'lastWorn',
      render: (val) => val ? dayjs(val).format('YYYY-MM-DD') : '-',
    },
    {
      title: '未佩戴天数',
      dataIndex: 'daysSinceLastWorn',
      key: 'daysSinceLastWorn',
      render: (val) => <Tag color="orange">{val} 天</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <a onClick={() => navigate(`/watches/${record.id}/wearing`)}>去佩戴</a>
      ),
    },
  ]

  const deviationColumns = [
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '最新偏差(秒)',
      dataIndex: 'latestDeviation',
      key: 'latestDeviation',
      render: (val) => {
        const isNormal = val >= -10 && val <= 20
        return isNormal ? (
          <Tag color="green">{val}</Tag>
        ) : (
          <Tag color="red">{val}</Tag>
        )
      },
    },
    {
      title: '记录日期',
      dataIndex: 'latestDate',
      key: 'latestDate',
      render: (val) => val ? dayjs(val).format('YYYY-MM-DD') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <a onClick={() => navigate(`/watches/${record.id}/timekeeping`)}>查看走时</a>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="我的表"
              value={data?.totalWatches || 0}
              valueStyle={{ color: '#D4A853' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="保养提醒"
              value={maintenanceAlerts.length}
              prefix={<WarningOutlined />}
              valueStyle={{ color: maintenanceAlerts.length > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="佩戴提醒"
              value={wearingAlerts.length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: wearingAlerts.length > 0 ? '#faad14' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <span>
            <ToolOutlined style={{ marginRight: 8, color: '#D4A853' }} />
            保养提醒
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        {maintenanceAlerts.length === 0 ? (
          <Alert message="暂无保养提醒，所有表状态良好" type="success" showIcon />
        ) : (
          <Table
            columns={maintenanceColumns}
            dataSource={maintenanceAlerts}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>

      <Card
        title={
          <span>
            <ClockCircleOutlined style={{ marginRight: 8, color: '#D4A853' }} />
            佩戴提醒（超过7天未佩戴）
          </span>
        }
        style={{ marginBottom: 16 }}
      >
        {wearingAlerts.length === 0 ? (
          <Alert message="所有表近期都有佩戴" type="success" showIcon />
        ) : (
          <Table
            columns={wearingColumns}
            dataSource={wearingAlerts}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>

      <Card
        title={
          <span>
            <WarningOutlined style={{ marginRight: 8, color: '#D4A853' }} />
            各表最新走时偏差概览
          </span>
        }
      >
        {deviationOverview.length === 0 ? (
          <Alert message="暂无走时记录" type="info" showIcon />
        ) : (
          <Table
            columns={deviationColumns}
            dataSource={deviationOverview}
            rowKey="id"
            pagination={false}
            size="small"
          />
        )}
      </Card>
    </div>
  )
}
