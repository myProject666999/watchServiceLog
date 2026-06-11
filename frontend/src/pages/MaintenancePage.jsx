import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Form,
  DatePicker,
  Select,
  InputNumber,
  Input,
  Button,
  Tag,
  Statistic,
  Row,
  Col,
  message,
  Popconfirm,
} from 'antd'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { maintenanceAPI } from '../api'

const MAINTENANCE_TYPES = [
  { value: 'WASH_OIL', label: '洗油' },
  { value: 'REPLACE_HAIRSPRING', label: '换游丝' },
  { value: 'REPLACE_MAINSPRING', label: '换发条' },
  { value: 'POLISH', label: '抛光' },
  { value: 'OTHER', label: '其他' },
]

const typeLabelMap = Object.fromEntries(MAINTENANCE_TYPES.map((t) => [t.value, t.label]))

export default function MaintenancePage() {
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
      const res = await maintenanceAPI.listByWatch(watchId)
      const data = Array.isArray(res) ? res : res.data || []
      setRecords(data.sort((a, b) => dayjs(b.maintenanceDate).valueOf() - dayjs(a.maintenanceDate).valueOf()))
    } catch (err) {
      message.error('获取保养记录失败')
    } finally {
      setLoading(false)
    }
  }

  const onAdd = async (values) => {
    try {
      await maintenanceAPI.create({
        watchId: Number(watchId),
        maintenanceDate: dayjs(values.date).format('YYYY-MM-DD'),
        maintenanceType: values.type,
        serviceProvider: values.provider || '',
        cost: values.cost || 0,
        note: values.note || '',
      })
      message.success('保养记录添加成功')
      form.resetFields()
      fetchRecords()
    } catch (err) {
      message.error('添加失败')
    }
  }

  const handleDelete = async (recordId) => {
    try {
      await maintenanceAPI.delete(recordId)
      message.success('删除成功')
      fetchRecords()
    } catch (err) {
      message.error('删除失败')
    }
  }

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0)

  const typeCostMap = {}
  records.forEach((r) => {
    const label = typeLabelMap[r.maintenanceType] || r.maintenanceType
    typeCostMap[label] = (typeCostMap[label] || 0) + (r.cost || 0)
  })

  const columns = [
    {
      title: '日期',
      dataIndex: 'maintenanceDate',
      key: 'maintenanceDate',
      render: (val) => dayjs(val).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.maintenanceDate).valueOf() - dayjs(b.maintenanceDate).valueOf(),
      defaultSortOrder: 'descend',
    },
    {
      title: '类型',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
      render: (val) => <Tag color="#D4A853">{typeLabelMap[val] || val}</Tag>,
      filters: MAINTENANCE_TYPES.map((t) => ({ text: t.label, value: t.value })),
      onFilter: (value, record) => record.maintenanceType === value,
    },
    {
      title: '服务商',
      dataIndex: 'serviceProvider',
      key: 'serviceProvider',
    },
    {
      title: '费用',
      dataIndex: 'cost',
      key: 'cost',
      render: (val) => val != null ? `¥${val}` : '-',
      sorter: (a, b) => (a.cost || 0) - (b.cost || 0),
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
      <h2 style={{ color: '#D4A853', marginBottom: 24 }}>保养记录</h2>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="总费用"
              value={totalCost}
              prefix="¥"
              valueStyle={{ color: '#D4A853' }}
            />
          </Card>
        </Col>
        {Object.entries(typeCostMap).map(([type, cost]) => (
          <Col xs={12} sm={6} key={type}>
            <Card>
              <Statistic
                title={`${type}费用`}
                value={cost}
                prefix="¥"
                valueStyle={{ color: '#e0e0e0' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="新增保养记录" style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" onFinish={onAdd}>
          <Form.Item
            name="date"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker placeholder="日期" />
          </Form.Item>
          <Form.Item
            name="type"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select placeholder="保养类型" style={{ width: 120 }} options={MAINTENANCE_TYPES} />
          </Form.Item>
          <Form.Item name="provider">
            <Input placeholder="服务商" style={{ width: 140 }} />
          </Form.Item>
          <Form.Item name="cost">
            <InputNumber placeholder="费用" min={0} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item name="note">
            <Input placeholder="备注" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">添加</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="保养记录列表">
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
