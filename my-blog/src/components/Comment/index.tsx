import { RootState } from '@/redux'
import { PictureOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Input, message } from 'antd'
import { useSelector } from 'react-redux'
import UploadText from '../Upload/UploadText'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  CommonRow,
  postArticleCommonAdd,
  postArticleCommonExpand,
  postArticleCommonList
} from '@/api/article/common'
import { CommentPage } from './Comment'

type CommonProps = {
  // 作者id
  authorId?: string
  // 文章id
  articleId?: number
}

export default function Common({ authorId, articleId }: CommonProps) {
  const { token, userInfo } = useSelector((state: RootState) => state.userInfo)

  const Navigate = useNavigate()

  const [messageVal, setMessageVal] = useState('')

  const onChange = (e: any) => {
    setMessageVal(e.target.value)
  }

  const [common, setCommon] = useState({
    list: [] as CommonRow[],
    total: 0
  })

  /** 新增评论 */
  const [commonAddLoading, setCommonAddLoading] = useState(false)
  const [commonQuery, setCommonQuery] = useState({
    pageSize: 5,
    pageNum: 1,
    blogId: Number(articleId)!
  })

  const [commonAddQuery] = useState({
    fId: null,
    toUserId: '',
    blogId: Number(articleId)!
  })

  const [replyMessageVal, setReplyMessageVal] = useState('')

  const [commonLoading, setCommonLoading] = useState(false)

  const [expandLoading, setExpandLoading] = useState(false)

  // 回复评论加载态
  const [replyLoading, setReplyLoading] = useState(false)

  // 存储每个评论的完整子评论数据
  const [commentReplies, setCommentReplies] = useState<{
    [key: number]: CommonRow[]
  }>({})

  /** 获取评论列表 */
  const postArticleCommonListApi = async () => {
    try {
      setCommonLoading(true)
      const res = await postArticleCommonList(commonQuery)
      setCommon({
        list: common.list.concat(
          res.data.row?.map((item: { replyNum: any; replySize: any }) => ({
            ...item,
            replyNum: item.replyNum ?? 1,
            replySize: item.replySize ?? 3
          })) ?? []
        ),
        total: res.data.total
      })
      setCommonLoading(false)
    } catch (err) {
      setCommonLoading(false)
    }
  }

  const onAdd = async () => {
    try {
      setCommonAddLoading(true)
      await postArticleCommonAdd({
        ...commonAddQuery,
        message: messageVal
      })
      message.success('评论成功')
      setCommonQuery({
        ...commonQuery,
        pageNum: 1,
        pageSize: commonQuery.pageNum * commonQuery.pageSize
      })
      setCommon({
        ...common,
        list: []
      })
      setMessageVal('')
      setCommonAddLoading(false)
    } catch (err) {
      setCommonAddLoading(false)
    }
  }

  const onLoadMore = async () => {
    setCommonQuery({ ...commonQuery, pageNum: commonQuery.pageNum + 1 })
  }

  const postArticleCommonExpandApi = async (row: CommonRow) => {
    if (!row.id) return
    try {
      setExpandLoading(true)
      const res = await postArticleCommonExpand({
        id: row.id!,
        pageSize:
          row.children!?.length > 0 ? row.replySize! + 2 : row.replySize!,
        pageNum: row.children!?.length > 0 ? row.replyNum! + 1 : row.replyNum!
      })
      // 更新完整子评论数据
      setCommentReplies((prev) => ({
        ...prev,
        [row.id!]: [...(commentReplies[row.id!] || []), ...res.data]
      }))
      setCommon((prevCommon) => ({
        ...prevCommon,
        list: prevCommon.list.map((item) => {
          if (item.id === row.id) {
            return {
              ...item,
              children: [...(item.children || []), ...res.data]
            }
          }
          return item
        })
      }))
      setExpandLoading(false)
    } catch (err) {
      console.log(err)
      setExpandLoading(false)
    }
  }

  const onExpandClick = (item: CommonRow) => {
    if (expandLoading || !item.id) return
    const replySize =
      item.children!?.length > 0 ? item.replySize! + 2 : item.replySize!
    const replyNum =
      item.children!?.length > 0 ? item.replyNum! + 1 : item.replyNum!

    setCommon((prevCommon) => ({
      ...prevCommon,
      list: prevCommon.list.map((list) => {
        if (list.id === item.id) {
          return {
            ...list,
            replySize,
            replyNum
          }
        }
        return list
      })
    }))
    postArticleCommonExpandApi(item)
  }

  const replyChange = (value: string) => {
    setReplyMessageVal(value)
  }

  const updateApplyData = async (item: CommonRow) => {
    const list = common.list.find((s) => s.id === (item.fId || item.id!))
    const size = Number(list?.children!.length!) + 1
    try {
      const res = await postArticleCommonExpand({
        id: item.fId ?? item.id!,
        pageSize: isNaN(size) ? 1 : size,
        pageNum: 1
      })
      setCommentReplies((prev) => ({
        ...prev,
        [item.fId ?? item.id!]: [
          ...(commentReplies[item.fId ?? item.id!] || []),
          ...res.data
        ]
      }))
      setCommon((prevCommon) => ({
        total: prevCommon.total + 1,
        list: prevCommon.list.map((s) => {
          if (s.id === (item.fId || item.id!)) {
            return {
              ...s,
              commonCount: s.commonCount! + 1,
              children: [...res.data]
            }
          }
          return s
        })
      }))
    } catch (err) {
      console.log(err)
    }
  }

  /** 回复评论 */
  const onReplyAdd = async (item: CommonRow) => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (!replyMessageVal.trim()) {
      message.warning('请输入评论内容')
      return
    }
    try {
      setReplyLoading(true)
      await postArticleCommonAdd({
        blogId: articleId!,
        toUserId: item.userId!,
        fId: item.fId ?? item.id!,
        message: replyMessageVal.trim()
      })
      message.success('评论成功')
      setReplyMessageVal('')
      updateApplyData(item)
      setReplyLoading(false)
    } catch (err) {
      setReplyLoading(false)
    }
  }

  const onRetractClick = (id: number) => {
    if (!id) return
    setCommon((prevCommon) => ({
      ...prevCommon,
      list: prevCommon.list.map((item) => {
        if (item.id === id) {
          // 收起时只隐藏子评论,不清空数据
          return {
            ...item,
            replyNum: 1,
            replySize: 3,
            children: []
          }
        }
        return item
      })
    }))
  }

  useEffect(() => {
    postArticleCommonListApi()
  }, [commonQuery, articleId])

  const loadMore =
    !commonLoading &&
    commonQuery.pageNum * commonQuery.pageSize < common.list.length ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px'
        }}
      >
        <Button onClick={onLoadMore}>加载更多</Button>
      </div>
    ) : null

  return (
    <>
      <div className="text-[24px]">评论 {common.total}</div>
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
                  loading={commonAddLoading}
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
      <CommentPage
        loading={commonLoading}
        authorId={authorId}
        loadMore={loadMore}
        dataSource={common.list}
        expandLoading={expandLoading}
        commentReplies={commentReplies}
        replyMessageVal={replyMessageVal}
        replyLoading={replyLoading}
        replyChange={replyChange}
        replyAdd={onReplyAdd}
        retractClick={onRetractClick}
        expandClick={onExpandClick}
      />
    </>
  )
}
