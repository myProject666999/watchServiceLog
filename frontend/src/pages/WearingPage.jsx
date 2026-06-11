import { useState, useEffect, useCallback } from 'react'
import { Card, Statistic, Row, Col, message, Alert } from 'antd'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { wearingAPI } from '../api'

export default function WearingPage() {
  const { id: watchId } = useParams()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(dayjs())

  useEffect(() => {
    fetchRecords()
  }, [watchId])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      const res = await wearingAPI.listByWatch(watchId)
      const data = Array.isArray(res) ? res : res.data || []
      setRecords(data)
    } catch (err) {
      message.error('获取佩戴记录失败')
    } finally {
      setLoading(false)
    }
  }

  const wearingDates = new Set(records.map((r) => dayjs(r.wearDate).format('YYYY-MM-DD')))

  const toggleWearing = useCallback(async (date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD')
    const existing = records.find((r) => dayjs(r.wearDate).format('YYYY-MM-DD') === dateStr)

    try {
      if (existing) {
        await wearingAPI.delete(existing.id)
        message.success('取消佩戴记录')
      } else {
        await wearingAPI.create({
          watchId: Number(watchId),
          wearDate: dateStr,
        })
        message.success('标记佩戴')
      }
      fetchRecords()
    } catch (err) {
      message.error('操作失败')
    }
  }, [records, watchId])

  const startOfMonth = currentMonth.startOf('month')
  const endOfMonth = currentMonth.endOf('month')
  const startDay = startOfMonth.day()
  const daysInMonth = currentMonth.daysInMonth()

  const thisMonthWearingDays = records.filter((r) => {
    const d = dayjs(r.wearDate)
    return d.isSame(currentMonth, 'month') && d.isSame(currentMonth, 'year')
  }).length

  const today = dayjs()
  const sortedDates = records
    .map((r) => dayjs(r.wearDate))
    .sort((a, b) => b.valueOf() - a.valueOf())
  const lastWornDate = sortedDates[0]
  const daysSinceLastWorn = lastWornDate ? today.diff(lastWornDate, 'day') : null

  let consecutiveNotWorn = 0
  for (let i = 0; i < 365; i++) {
    const checkDate = today.subtract(i, 'day').format('YYYY-MM-DD')
    if (wearingDates.has(checkDate)) {
      break
    }
    consecutiveNotWorn++
  }

  const weeks = []
  let currentWeek = []
  for (let i = 0; i < startDay; i++) {
    currentWeek.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }

  const weekDayNames = ['日', '一', '二', '三', '四', '五', '六']

  const isFuture = (day) => {
    if (!day) return false
    const date = currentMonth.date(day)
    return date.isAfter(today, 'day')
  }

  const isWorn = (day) => {
    if (!day) return false
    const dateStr = currentMonth.date(day).format('YYYY-MM-DD')
    return wearingDates.has(dateStr)
  }

  return (
    <div>
      <h2 style={{ color: '#D4A853', marginBottom: 24 }}>佩戴记录</h2>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={8}>
          <Card>
            <Statistic
              title="本月佩戴天数"
              value={thisMonthWearingDays}
              suffix={`/ ${daysInMonth} 天`}
              valueStyle={{ color: '#D4A853' }}
            />
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <Statistic
              title="连续未佩戴天数"
              value={consecutiveNotWorn}
              suffix="天"
              valueStyle={{ color: consecutiveNotWorn > 7 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={8}>
          <Card>
            <Statistic
              title="上次佩戴"
              value={lastWornDate ? lastWornDate.format('YYYY-MM-DD') : '无记录'}
              valueStyle={{ color: '#e0e0e0', fontSize: lastWornDate ? 24 : 16 }}
            />
          </Card>
        </Col>
      </Row>

      {consecutiveNotWorn > 7 && (
        <Alert
          message={`已连续 ${consecutiveNotWorn} 天未佩戴此表，建议定期佩戴以保持机芯运转`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} style={{ cursor: 'pointer', color: '#D4A853', fontSize: 16 }}>
              ◀
            </span>
            <span>{currentMonth.format('YYYY年MM月')}</span>
            <span onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} style={{ cursor: 'pointer', color: '#D4A853', fontSize: 16 }}>
              ▶
            </span>
          </div>
        }
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {weekDayNames.map((name) => (
                <th
                  key={name}
                  style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    color: '#999',
                    borderBottom: '1px solid #333',
                    fontSize: 13,
                  }}
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => (
                  <td
                    key={di}
                    onClick={() => day && !isFuture(day) && toggleWearing(currentMonth.date(day))}
                    style={{
                      padding: '8px 4px',
                      textAlign: 'center',
                      cursor: day && !isFuture(day) ? 'pointer' : 'default',
                      borderRadius: 6,
                      background: isWorn(day) ? 'rgba(212, 168, 83, 0.25)' : 'transparent',
                      color: isFuture(day) ? '#555' : isWorn(day) ? '#D4A853' : '#e0e0e0',
                      fontWeight: isWorn(day) ? 'bold' : 'normal',
                      transition: 'background 0.2s',
                      fontSize: 14,
                    }}
                  >
                    {day || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, color: '#999', fontSize: 12 }}>
          点击日期可标记/取消佩戴
        </div>
      </Card>
    </div>
  )
}
