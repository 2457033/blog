import { CommonRow } from '@/api/article/common'
import { RootState } from '@/redux'
import { DownOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Input, List, message } from 'antd'
import { useSelector } from 'react-redux'
import UploadText from '../Upload/UploadText'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

type CommonProps = {
  loading?: boolean
  dataSource?: CommonRow[]
  loadMore?: React.ReactNode
  messageVal?: any
  replyMessageVal?: any
  commonLoading?: boolean
  total?: number
  sendComment?: (value?: any) => void
  unSendComment?: (value?: any) => void
  change?: (e?: any) => void
  add?: () => void
  replyAdd?: (value?: any) => void
  replyChange?: (e?: any) => void
}

export default function Common({
  loading,
  dataSource,
  loadMore,
  messageVal,
  commonLoading,
  total,
  replyMessageVal,
  change = () => {},
  add = () => {},
  sendComment = () => {},
  unSendComment = () => {},
  replyAdd = () => {},
  replyChange = () => {}
}: CommonProps) {
  const { token, userInfo } = useSelector((state: RootState) => state.userInfo)

  const Navigate = useNavigate()

  const messageClick = (item: CommonRow) => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    sendComment(item)
  }

  const unMessageClick = (item: CommonRow) => {
    unSendComment(item)
  }

  const onChange = (e: any) => {
    change(e)
  }

  const onReplyChange = (e: any) => {
    replyChange(e)
  }

  const onAdd = () => {
    add()
  }

  const onReplyAdd = (item: CommonRow) => {
    replyAdd(item)
  }

  const [data, setData] = useState<CommonRow[]>([])

  const [visibleChildrenCount, setVisibleChildrenCount] = useState<{
    [key: number]: number
  }>({})

  // 监听 dataSource 的变化，并赋值给 data
  useEffect(() => {
    setData(dataSource ?? [])
  }, [dataSource])

  const CommonList = (dataSource: CommonRow[], level: number = 0) => {
    return (
      <List
        className="mt-4"
        loading={loading}
        itemLayout="vertical"
        dataSource={dataSource}
        locale={{ emptyText: '暂无评论数据' }}
        loadMore={level === 0 ? loadMore : null}
        renderItem={(item) => {
          const childDisplayCount = visibleChildrenCount[item.id!] ?? 2
          const visibleChildren =
            item.children?.slice(0, childDisplayCount) || []
          return (
            <List.Item
              key={item.id}
              style={{
                border: level === 0 ? '' : 'none'
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.icon} />}
                title={<span className="text-[#515767]">{item.nickName}</span>}
                description={
                  <>
                    {item.toNickName ? (
                      <Button
                        type="link"
                        className="text-[16px]"
                        style={{
                          padding: '4px 10px 4px 0'
                        }}
                      >
                        @{item.toNickName}
                      </Button>
                    ) : null}
                    <span className="text-[16px] text-[#252933]">
                      {item.message}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#8a919f] text-[13px]">
                        {item.createTime}
                      </span>
                      {!item.isMessage ? (
                        <Button
                          type="link"
                          className="text-[#8a919f] text-[13px]"
                          onClick={() => messageClick(item)}
                        >
                          回复
                        </Button>
                      ) : (
                        <Button
                          type="link"
                          className="text-[#8a919f] text-[13px]"
                          onClick={() => unMessageClick(item)}
                        >
                          取消回复
                        </Button>
                      )}
                    </div>
                    {item.isMessage ? (
                      <div className="w-full border-[#e5e7eb] border rounded-lg p-1 hover:border-[#1677ff]">
                        <Input.TextArea
                          value={replyMessageVal}
                          allowClear
                          placeholder="说点什么..."
                          maxLength={1000}
                          style={{
                            border: 'none',
                            boxShadow: 'none'
                          }}
                          autoSize={{
                            minRows: 6,
                            maxRows: 6
                          }}
                          onChange={onReplyChange}
                          onPressEnter={() => onReplyAdd(item)}
                        />
                        <div className="flex items-end justify-between">
                          <div className="flex items-center">
                            <div>表情</div>
                            <div className="cursor-pointer ml-4">
                              <UploadText>
                                <PictureOutlined style={{ fontSize: 18 }} />
                              </UploadText>
                            </div>
                          </div>
                          <div className="mr-4">
                            <Button
                              type="primary"
                              onClick={() => onReplyAdd(item)}
                              loading={item.replyLoading}
                            >
                              回复
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                }
              />
              <div className={level === 0 ? 'ml-10' : ''}>
                {item.children && item.children.length > 0
                  ? CommonList(visibleChildren, level + 1)
                  : null}
                {item.children && childDisplayCount < item.commonCount! && (
                  <Button
                    type="link"
                    onClick={() => {
                      setVisibleChildrenCount((prev) => ({
                        ...prev,
                        [item.id!]: (prev[item.id!] ?? 2) + 2
                      }))
                    }}
                    className="text-[#999]"
                    icon={<DownOutlined />}
                    iconPosition="end"
                  >
                    ———— 展开更多回复
                  </Button>
                )}
              </div>
            </List.Item>
          )
        }}
      />
    )
  }

  return (
    <>
      <div className="text-[24px]">评论 {total}</div>
      {token ? (
        <div className="mt-4 flex justify-between">
          {userInfo.icon ? (
            <Avatar
              size={45}
              src={userInfo.icon}
            />
          ) : (
            <Avatar
              size={45}
              icon={<UserOutlined />}
            />
          )}
          <div className="ml-4 w-full border-[#e5e7eb] border rounded-lg p-1 hover:border-[#1677ff]">
            <Input.TextArea
              value={messageVal}
              allowClear
              placeholder="说点什么..."
              maxLength={1000}
              style={{
                border: 'none',
                boxShadow: 'none'
              }}
              autoSize={{
                minRows: 6,
                maxRows: 6
              }}
              onChange={onChange}
              onPressEnter={onAdd}
            />
            <div className="flex items-end justify-between">
              <div className="flex items-center">
                <div>表情</div>
                <div className="cursor-pointer ml-4">
                  <UploadText>
                    <PictureOutlined style={{ fontSize: 18 }} />
                  </UploadText>
                </div>
              </div>
              <div className="mr-4">
                <Button
                  type="primary"
                  onClick={onAdd}
                  loading={commonLoading}
                >
                  发送
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-between">
          <Avatar
            size={45}
            icon={<UserOutlined />}
          />
          <div className="rounded-xl flex items-center justify-center ml-4 bg-[#f2f3f5] w-full h-[90px]">
            <Button
              type="primary"
              onClick={() => Navigate('/login')}
            >
              登录/注册
            </Button>
            <span className="ml-2">即可发布评论</span>
          </div>
        </div>
      )}
      <div className="min-h-[300px]">{CommonList(data)}</div>
    </>
  )
}
