import { useLayoutEffect } from 'react'
import AppRouter from './router/Router'
import { ConfigProvider, ThemeConfig, App as AppAntd } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import zhCN from 'antd/es/locale/zh_CN'
import './App.css'

function App() {
  const theme: ThemeConfig = {
    token: {
      fontFamily: 'var(--app-font-family)'
    },
    components: {
      Timeline: {
        dotBg: 'none'
      }
    }
  }

  // const { locale } = useContext(ConfigProvider.ConfigContext)

  useLayoutEffect(() => {
    ConfigProvider.config({
      holderRender: (children) => (
        <AppAntd
          message={{ maxCount: 1 }}
          notification={{ maxCount: 1 }}
        >
          {children}
        </AppAntd>
      )
    })
  })

  return (
    <div className="min-w-[375px] relative w-full h-screen flex">
      <div className="flex flex-col w-full h-full overflow-hidden bg-[#f2f3f5]">
        <ConfigProvider
          theme={theme}
          locale={zhCN}
        >
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ConfigProvider>
      </div>
    </div>
  )
}

export default App
