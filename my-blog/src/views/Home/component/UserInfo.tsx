import XCard from '@/components/XCard'
import { RootState } from '@/redux'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function UserInfo() {
  const Navigate = useNavigate()
  const { userInfo, token } = useSelector((state: RootState) => state.userInfo)
  return (
    <>
      {token ? (
        <XCard>
          {/* 头像 */}
          <div className="flex flex-col items-center">
            {userInfo.icon ? (
              <Avatar
                src={userInfo.icon}
                size={100}
              />
            ) : (
              <Avatar
                size={100}
                icon={<UserOutlined />}
              />
            )}
            <div className="mt-2 text-[20px] font-bold">
              {userInfo.nickName}
            </div>
            <div className="flex justify-between w-[80%] mt-2 text-[#999]">
              {/* 文章 */}
              <div className="flex flex-col items-center">
                <span>文章</span>
                <span className="text-black">{userInfo.articleCount}</span>
              </div>
              {/* 分类 */}
              <div className="flex flex-col items-center">
                <span>点赞量</span>
                <span className="text-black">{userInfo.likeCount}</span>
              </div>
              {/* 访问量 */}
              <div className="flex flex-col items-center">
                <span>访问量</span>
                <span className="text-black">{userInfo.visitCount}</span>
              </div>
            </div>
          </div>
        </XCard>
      ) : (
        <XCard>
          {/* 头像 */}
          <div className="flex flex-col items-center">
            <Avatar
              size={100}
              icon={<UserOutlined />}
            />
            <div className="flex flex-col mt-2 gap-2 text-[15px]">
              <span>登录网站，获取以下权益</span>
              <span>参与互动评论 发表优质文章</span>
              <Button
                type="primary"
                onClick={() => Navigate('/login')}
              >
                立即登录
              </Button>
            </div>
          </div>
        </XCard>
      )}
      {/* <XCard className="mt-2">
        <div className="text-[16px]">推荐文章</div>
        <div></div>
      </XCard>
      <XCard className="mt-2">
        <div className="text-[16px]">最新评论</div>
        <div></div>
      </XCard>
      <XCard className="mt-2">
        <div className="text-[16px]">今日天气</div>
        <div></div>
      </XCard> */}
    </>
  )
}
