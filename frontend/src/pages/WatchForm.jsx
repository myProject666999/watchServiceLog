import { useState, useEffect } from 'react'
import { Form, Input, DatePicker, InputNumber, Button, message, Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { watchAPI } from '../api'

export default function WatchForm() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      fetchWatch()
    }
  }, [id])

  const fetchWatch = async () => {
    try {
      setFetching(true)
      const res = await watchAPI.get(id)
      const data = res.data || res
      form.setFieldsValue({
        ...data,
        purchaseDate: data.purchaseDate ? dayjs(data.purchaseDate) : null,
        warrantyEnd: data.warrantyEnd ? dayjs(data.warrantyEnd) : null,
      })
    } catch (err) {
      message.error('获取信息失败')
    } finally {
      setFetching(false)
    }
  }

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const payload = {
        ...values,
        purchaseDate: values.purchaseDate ? dayjs(values.purchaseDate).format('YYYY-MM-DD') : null,
        warrantyEnd: values.warrantyEnd ? dayjs(values.warrantyEnd).format('YYYY-MM-DD') : null,
      }
      if (isEdit) {
        await watchAPI.update(id, payload)
        message.success('更新成功')
      } else {
        await watchAPI.create(payload)
        message.success('创建成功')
      }
      navigate('/watches')
    } catch (err) {
      message.error(isEdit ? '更新失败' : '创建失败')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ color: '#D4A853', marginBottom: 24 }}>
        {isEdit ? '编辑表' : '新增表'}
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ maintenanceIntervalMonths: 36 }}
      >
        <Form.Item
          label="品牌"
          name="brand"
          rules={[{ required: true, message: '请输入品牌' }]}
        >
          <Input placeholder="如：Omega" />
        </Form.Item>

        <Form.Item
          label="型号"
          name="model"
          rules={[{ required: true, message: '请输入型号' }]}
        >
          <Input placeholder="如：Speedmaster" />
        </Form.Item>

        <Form.Item label="机芯" name="movement">
          <Input placeholder="如：Cal.1861" />
        </Form.Item>

        <Form.Item label="年份" name="year">
          <InputNumber
            min={1800}
            max={dayjs().year()}
            style={{ width: '100%' }}
            placeholder="如：2020"
          />
        </Form.Item>

        <Form.Item label="入手日期" name="purchaseDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="保修截止日期" name="warrantyEnd">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="保养间隔(月)" name="maintenanceIntervalMonths">
          <InputNumber
            min={1}
            max={120}
            style={{ width: '100%' }}
            placeholder="默认36个月"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 12 }}>
            {isEdit ? '更新' : '创建'}
          </Button>
          <Button onClick={() => navigate('/watches')}>取消</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
