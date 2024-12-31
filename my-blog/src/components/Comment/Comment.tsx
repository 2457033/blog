import { CommonRow } from '@/api/article/common'
import { RootState } from '@/redux'
import { filterCommentTime } from '@/shared/common'
import { Avatar, Button, Input, List, message, Tag } from 'antd'
import { useSelector } from 'react-redux'
import UploadText from '../Upload/UploadText'
import { DownOutlined, PictureOutlined, UpOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

type CommonProps = {
  // 列表加载态
  loading?: boolean
  // 作者id
  authorId?: string
  // 评论数据源
  dataSource?: CommonRow[]
  // 加载更多
  loadMore?: React.ReactNode
  // 回复内容
  replyMessageVal?: string
  // 展开评论加载态
  expandLoading?: boolean
  // 回复评论加载态
  replyLoading?: boolean
  // 存储每个评论的完整子评论数据
  commentReplies?: {
    [key: number]: CommonRow[]
  }
  // 回复内容改变回调
  replyChange?: (val: string) => void
  // 回复评论回调
  replyAdd?: (item: CommonRow) => void
  // 扩展评论
  expandClick?: (item: CommonRow) => void
  // 收起评论
  retractClick?: (id: number) => void
}

export const CommentPage = (props: CommonProps) => {
  const {
    loading,
    authorId,
    loadMore,
    dataSource,
    replyMessageVal,
    expandLoading,
    commentReplies,
    replyLoading,
    replyChange,
    replyAdd,
    expandClick,
    retractClick
  } = props
  const { token } = useSelector((state: RootState) => state.userInfo)

  const messageClick = (item: CommonRow) => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (replyLoading) return
    const updateMessageState = (list: CommonRow[]): CommonRow[] => {
      return list
        .map((s) => {
          const updatedChildren = s.children
            ? updateMessageState(s.children)
            : []
          return { ...s, isMessage: false, children: updatedChildren }
        })
        .map((s) => {
          if (s.id === item.id) {
            return { ...s, isMessage: true }
          }
          return s
        })
    }
    setData((prevCommon) => updateMessageState(prevCommon))
  }

  const unMessageClick = (item: CommonRow) => {
    const updateMessageState = (list: CommonRow[]): CommonRow[] => {
      return list.map((s) => {
        if (s.id === item.id) {
          return { ...s, isMessage: false }
        }
        if (s.children) {
          return { ...s, children: updateMessageState(s.children) }
        }
        return s
      })
    }
    setData((prevCommon) => updateMessageState(prevCommon))
  }

  const onReplyChange = (e: any) => {
    replyChange?.(e.target.value)
  }

  /** 回复评论 */
  const onReplyAdd = async (item: CommonRow) => {
    replyAdd?.(item)
  }

  const [data, setData] = useState<CommonRow[]>([])

  const onExpandClick = (item: CommonRow) => {
    expandClick?.(item)
  }

  const onRetractClick = (id: number) => {
    retractClick?.(id)
  }

  useEffect(() => {
    setData(dataSource || [])
  }, [dataSource])

  const CommentList = (dataSource: CommonRow[], level: number = 0) => {
    return (
      <List
        className="mt-4"
        loading={loading}
        itemLayout="vertical"
        dataSource={dataSource}
        locale={{ emptyText: '暂无评论数据' }}
        loadMore={level === 0 ? loadMore : null}
        renderItem={(item) => {
          return (
            <List.Item
              key={item.id}
              style={{
                border: level === 0 ? '' : 'none'
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.icon} />}
                title={
                  <div className="flex items-center gap-2">
                    <span className="text-[#515767]">{item.nickName}</span>
                    {item.userId === authorId ? (
                      <Tag color="geekblue">作者</Tag>
                    ) : null}
                  </div>
                }
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
                        {filterCommentTime(item.createTime!)}
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
                          onPressEnter={(e) => {
                            e.preventDefault()
                            onReplyAdd(item)
                          }}
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
                              loading={replyLoading}
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
                  ? CommentList(item.children, level + 1)
                  : null}
                {item.children &&
                  (item.children.length < (item.commonCount || 0) ||
                    (commentReplies![item.id!]?.length || 0) <
                      (item.commonCount || 0)) && (
                    <Button
                      type="link"
                      onClick={() => onExpandClick(item)}
                      className="text-[#999]"
                      icon={<DownOutlined />}
                      iconPosition="end"
                      loading={expandLoading}
                    >
                      展开
                      {item.children.length > 0
                        ? '更多'
                        : (item.commonCount || 0) + '条回复'}
                    </Button>
                  )}
                {item.children &&
                  item.children.length >= item.commonCount! &&
                  item.commonCount! > 0 && (
                    <Button
                      type="link"
                      onClick={() => onRetractClick(item.id!)}
                      className="text-[#999]"
                      icon={<UpOutlined />}
                      iconPosition="end"
                    >
                      收起
                    </Button>
                  )}
              </div>
            </List.Item>
          )
        }}
      />
    )
  }

  return <div className="min-h-[200px]">{CommentList(data)}</div>
}
