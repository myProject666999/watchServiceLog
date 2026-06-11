import { useState, useEffect } from 'react'
import { Table, Button, Tag, Space, message, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { watchAPI } from '../api'

export default function WatchList() {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWatches()
  }, [])

  const fetchWatches = async () => {
    try {
      setLoading(true)
      const res = await watchAPI.list()
      setWatches(Array.isArray(res) ? res : res.data || [])
    } catch (err) {
      message.error('获取列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await watchAPI.delete(id)
      message.success('删除成功')
      fetchWatches()
    } catch (err) {
      message.error('删除失败')
    }
  }

  const columns = [
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      render: (text, record) => (
        <a onClick={() => navigate(`/watches/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '机芯',
      dataIndex: 'movement',
      key: 'movement',
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: '入手日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (val) => val ? dayjs(val).format('YYYY-MM-DD') : '-',
    },
    {
      title: '保修截止',
      dataIndex: 'warrantyEnd',
      key: 'warrantyEnd',
      render: (val) => {
        if (!val) return '-'
        const isExpired = dayjs(val).isBefore(dayjs(), 'day')
        return isExpired ? (
          <Tag color="red">{dayjs(val).format('YYYY-MM-DD')}</Tag>
        ) : (
          dayjs(val).format('YYYY-MM-DD')
        )
      },
    },
    {
      title: '上次保养',
      dataIndex: 'lastMaintenanceDate',
      key: 'lastMaintenanceDate',
      render: (val) => val ? dayjs(val).format('YYYY-MM-DD') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/watches/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这块表吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#D4A853', margin: 0 }}>我的表</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/watches/new')}
        >
          新增
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={watches}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}
