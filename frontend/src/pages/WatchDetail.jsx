import { useState, useEffect } from 'react'
import { Descriptions, Card, Button, Space, Spin, Tag, message } from 'antd'
import {
  EditOutlined,
  ClockCircleOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { watchAPI, timekeepingAPI } from '../api'
import DeviationChart from '../components/DeviationChart'

export default function WatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [watch, setWatch] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [watchRes, tkRes] = await Promise.all([
        watchAPI.get(id),
        timekeepingAPI.listByWatch(id),
      ])
      setWatch(watchRes.data || watchRes)
      const records = Array.isArray(tkRes) ? tkRes : tkRes.data || []
      const sorted = [...records].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
      setRecentRecords(sorted.slice(0, 30).map((r) => ({
        date: dayjs(r.date).format('YYYY-MM-DD'),
        deviation: r.deviationSeconds,
      })).reverse())
    } catch (err) {
      message.error('获取数据失败')
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

  if (!watch) {
    return <div>未找到该表</div>
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#D4A853', margin: 0 }}>
          {watch.brand} {watch.model}
        </h2>
        <Space>
          <Button
            icon={<ClockCircleOutlined />}
            onClick={() => navigate(`/watches/${id}/timekeeping`)}
          >
            走时记录
          </Button>
          <Button
            icon={<ToolOutlined />}
            onClick={() => navigate(`/watches/${id}/maintenance`)}
          >
            保养记录
          </Button>
          <Button
            icon={<UserOutlined />}
            onClick={() => navigate(`/watches/${id}/wearing`)}
          >
            佩戴记录
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/watches/${id}/edit`)}
          >
            编辑
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
          <Descriptions.Item label="品牌">{watch.brand}</Descriptions.Item>
          <Descriptions.Item label="型号">{watch.model}</Descriptions.Item>
          <Descriptions.Item label="机芯">{watch.movement || '-'}</Descriptions.Item>
          <Descriptions.Item label="年份">{watch.year || '-'}</Descriptions.Item>
          <Descriptions.Item label="入手日期">
            {watch.purchaseDate ? dayjs(watch.purchaseDate).format('YYYY-MM-DD') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="保修截止">
            {watch.warrantyEnd ? (
              dayjs(watch.warrantyEnd).isBefore(dayjs(), 'day') ? (
                <Tag color="red">{dayjs(watch.warrantyEnd).format('YYYY-MM-DD')} (已过期)</Tag>
              ) : (
                dayjs(watch.warrantyEnd).format('YYYY-MM-DD')
              )
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="上次保养">
            {watch.lastMaintenanceDate ? dayjs(watch.lastMaintenanceDate).format('YYYY-MM-DD') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="保养间隔">
            {watch.maintenanceIntervalMonths ? `${watch.maintenanceIntervalMonths} 个月` : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="最近走时偏差趋势">
        {recentRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            暂无走时记录，
            <a onClick={() => navigate(`/watches/${id}/timekeeping`)}>去记录</a>
          </div>
        ) : (
          <DeviationChart data={recentRecords} height={250} />
        )}
      </Card>
    </div>
  )
}
