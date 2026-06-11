import { useState, useEffect } from 'react'
import { Card, Table, Form, DatePicker, InputNumber, Input, Button, Tag, Statistic, Row, Col, Space, message, Popconfirm } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { timekeepingAPI } from '../api'
import DeviationChart from '../components/DeviationChart'

const NORMAL_MIN = -10
const NORMAL_MAX = 20

export default function TimekeepingPage() {
  const { id: watchId } = useParams()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchRecords()
  }, [watchId])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const res = await timekeepingAPI.listByWatch(watchId)
      const data = Array.isArray(res) ? res : res.data || []
      setRecords(data.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()))
    } catch (err) {
      message.error('获取走时记录失败')
    } finally {
      setLoading(false)
    }
  }

  const onAdd = async (values) => {
    try {
      await timekeepingAPI.create({
        watchId: Number(watchId),
        date: dayjs(values.date).format('YYYY-MM-DD'),
        deviationSeconds: values.deviationSeconds,
        note: values.note || '',
      })
      message.success('记录添加成功')
      form.resetFields()
      fetchRecords()
    } catch (err) {
      message.error('添加失败')
    }
  }

  const handleDelete = async (recordId) => {
    try {
      await timekeepingAPI.delete(recordId)
      message.success('删除成功')
      fetchRecords()
    } catch (err) {
      message.error('删除失败')
    }
  }

  const chartData = [...records]
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .map((r) => ({
      date: dayjs(r.date).format('YYYY-MM-DD'),
      deviation: r.deviationSeconds,
    }))

  const deviations = records.map((r) => r.deviationSeconds)
  const avg = deviations.length ? (deviations.reduce((a, b) => a + b, 0) / deviations.length).toFixed(1) : 0
  const max = deviations.length ? Math.max(...deviations) : 0
  const min = deviations.length ? Math.min(...deviations) : 0

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (val) => dayjs(val).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      defaultSortOrder: 'descend',
    },
    {
      title: '偏差(秒)',
      dataIndex: 'deviationSeconds',
      key: 'deviationSeconds',
      render: (val) => {
        const isNormal = val >= NORMAL_MIN && val <= NORMAL_MAX
        return isNormal ? (
          <Tag color="green">{val}</Tag>
        ) : (
          <Tag color="red">{val}</Tag>
        )
      },
      sorter: (a, b) => a.deviationSeconds - b.deviationSeconds,
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="确定删除此记录？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger size="small">删除</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <h2 style={{ color: '#D4A853', marginBottom: 24 }}>走时记录</h2>

      <Card title="偏差曲线" style={{ marginBottom: 16 }}>
        {chartData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>暂无数据</div>
        ) : (
          <DeviationChart data={chartData} />
        )}
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={8}>
          <Card>
            <Statistic
              title="平均偏差"
              value={avg}
              suffix="秒"
              valueStyle={{ color: avg >= NORMAL_MIN && avg <= NORMAL_MAX ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <Statistic
              title="最大偏差"
              value={max}
              suffix="秒"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: max > NORMAL_MAX ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <Statistic
              title="最小偏差"
              value={min}
              suffix="秒"
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: min < NORMAL_MIN ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="新增走时记录" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={onAdd}>
          <Form.Item
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker placeholder="日期" />
          </Form.Item>
          <Form.Item
            name="deviationSeconds"
            rules={[{ required: true, message: '请输入偏差' }]}
          >
            <InputNumber placeholder="偏差秒数" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="note">
            <Input placeholder="备注" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">添加</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="走时记录列表">
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>
    </div>
  )
}
