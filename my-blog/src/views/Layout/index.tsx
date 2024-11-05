import Header from './component/Header'
import { Outlet } from 'react-router-dom'

import css from './index.module.less'

export default function Layout() {
  return (
    <>
      <Header />
      <div className={`flex-1 overflow-auto ${css.Scroll}`}>
        <div className="w-[70%] my-0 mx-auto py-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}
