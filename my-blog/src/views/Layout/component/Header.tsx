import Logo from '@/components/logo/Logo'
import { FileTextOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Flex, MenuProps, Popover } from 'antd'
import { nanoid } from 'nanoid'
import styles from './index.module.less'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo, logoOut } from '@/redux/userInfo'
import { AppDispatch } from '@/redux'

export default function Header() {
  const location = useLocation()
  const Navigate = useNavigate()

  const { token, userInfo } = useSelector((state: any) => state.userInfo)
  const dispatch: AppDispatch = useDispatch()

  const items: MenuProps['items'] = [
    {
      key: nanoid(),
      label: <Button type="link">个人资料</Button>
    },
    {
      key: nanoid(),
      label: (
        <Button
          type="link"
          onClick={() => dispatch(logoOut())}
        >
          退出登录
        </Button>
      )
    }
  ]

  const list = [
    { id: nanoid(), label: '首页', path: '/home', icon: <HomeOutlined /> },
    {
      id: nanoid(),
      label: '文章',
      path: '/article',
      icon: <FileTextOutlined />
    },
    { id: nanoid(), label: '时间轴', path: '/timeline' },
    { id: nanoid(), label: '标签', path: '/tag' },
    { id: nanoid(), label: '随笔', path: '/essay' },
    { id: nanoid(), label: '生活', path: '/life' },
    { id: nanoid(), label: '相册', path: '/photoalbum' },
    { id: nanoid(), label: '关于', path: '/about' }
  ]

  useEffect(() => {
    if (token) {
      dispatch(getUserInfo())
    }
  }, [token, dispatch])

  return (
    <div className="w-full z-[999] h-[60px] flex items-center justify-evenly bg-white shadow-[0px_8px_10px_rgba(0,0,0,0.1)]">
      <Flex align="center">
        <Logo
          width={40}
          height={40}
        />
        <span className={styles.logoSpan}>个人博客</span>
      </Flex>
      <Flex align="center">
        {list.map((item) => (
          <div
            key={item.id}
            className={`mx-1 cursor-pointer  ${
              location.pathname === item.path
                ? 'text-black'
                : 'text-[#606266] hover:text-[#1677ff]'
            }`}
            onClick={() => Navigate(item.path)}
          >
            {item.icon}
            <span className="ml-1 text-[18px]">{item.label}</span>
          </div>
        ))}
      </Flex>
      <Flex align="center">
        {token ? (
          <Dropdown
            menu={{ items }}
            arrow
          >
            <div className="cursor-pointer mr-[100px]">
              <Avatar
                size={40}
                src={userInfo.icon}
              />
              <span className="ml-2">{userInfo.nickName}</span>
            </div>
          </Dropdown>
        ) : (
          <Popover
            style={{
              marginTop: '10px'
            }}
            content={
              <>
                <div className="flex flex-col">
                  <div>登录网站，获取以下权益</div>
                  <div className="flex items-center">
                    <span>参与互动评论</span>
                    <span>发表优质文章</span>
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <Button
                      type="primary"
                      onClick={() => Navigate('/login')}
                    >
                      立即登录
                    </Button>
                  </div>
                </div>
              </>
            }
          >
            <div className="cursor-pointer">
              <Avatar
                size={40}
                icon={<UserOutlined />}
              />
            </div>
          </Popover>
        )}
      </Flex>
    </div>
  )
}
