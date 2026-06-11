import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

export default function DeviationChart({ data = [], height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="date"
          stroke="#999"
          tick={{ fill: '#999', fontSize: 12 }}
        />
        <YAxis
          stroke="#999"
          tick={{ fill: '#999', fontSize: 12 }}
          label={{ value: '偏差(秒)', angle: -90, position: 'insideLeft', fill: '#999' }}
        />
        <Tooltip
          contentStyle={{
            background: '#222',
            border: '1px solid #444',
            borderRadius: 6,
            color: '#e0e0e0',
          }}
          formatter={(value) => [`${value} 秒`, '偏差']}
          labelFormatter={(label) => `日期: ${label}`}
        />
        <ReferenceArea y1={-10} y2={20} fill="#2a5a2a" fillOpacity={0.3} />
        <ReferenceLine y={0} stroke="#D4A853" strokeDasharray="3 3" strokeWidth={1} />
        <Line
          type="monotone"
          dataKey="deviation"
          stroke="#D4A853"
          strokeWidth={2}
          dot={{ fill: '#D4A853', r: 3 }}
          activeDot={{ r: 5, fill: '#fff', stroke: '#D4A853', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
