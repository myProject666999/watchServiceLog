import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './App.css'

const customTheme = {
  token: {
    colorPrimary: '#D4A853',
    colorBgContainer: '#1a1a1a',
    colorBgElevated: '#222222',
    colorBgLayout: '#141414',
    colorBorder: '#333333',
    colorText: '#e0e0e0',
    colorTextSecondary: '#999999',
    borderRadius: 6,
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        ...customTheme,
        algorithm: theme.darkAlgorithm,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
)
