import { getArticleDetail, Row } from '@/api/article'
import {
  CommonRow,
  postArticleCommonAdd,
  postArticleCommonList
} from '@/api/article/common'
import Common from '@/components/Comment'
import Like from '@/components/Icon/Like'
import { RootState } from '@/redux'
import { HeartTwoTone } from '@ant-design/icons'
import { Avatar, Button, Card, message } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function Article() {
  const { id } = useParams()
  const [detail, setDetail] = useState({} as Row)
  const [loading, setLoading] = useState(false)

  const { userInfo } = useSelector((state: RootState) => state.userInfo)

  const [commonQuery, setCommonQuery] = useState({
    pageSize: 5,
    pageNum: 1,
    blogId: Number(id)!
  })

  const [commonLoading, setCommonLoading] = useState(false)
  const [common, setCommon] = useState({
    list: [] as CommonRow[],
    total: 0
  })

  /** 新增评论 */
  const [commonAddLoading, setCommonAddLoading] = useState(false)
  const [commonAddQuery] = useState({
    fId: null,
    toUserId: '',
    blogId: Number(id)!
  })
  const [messageVal, setMessageVal] = useState('')
  const [replyMessageVal, setReplyMessageVal] = useState('')

  /** 获取文章数据 */
  const getArticleDetailApi = async () => {
    try {
      setLoading(true)
      const res = await getArticleDetail(Number(id))
      setDetail(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  /** 获取评论列表 */
  const postArticleCommonListApi = async () => {
    try {
      setCommonLoading(true)
      const res = await postArticleCommonList(commonQuery)
      setCommon({
        list: common.list.concat(res.data.row),
        total: res.data.total
      })
      setCommonLoading(false)
    } catch (err) {
      setCommonLoading(false)
    }
  }

  /** 增加评论 */
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

  const onChange = (e: any) => {
    setMessageVal(e.target.value)
  }

  const onReplyChange = (e: any) => {
    setReplyMessageVal(e.target.value)
  }

  /** 回复评论 */
  const onReplyAdd = async (item: CommonRow) => {
    try {
      setCommon((prevCommon) => ({
        ...prevCommon,
        list: prevCommon.list.map((s) =>
          s.id === item.id ? { ...s, replyLoading: true } : s
        )
      }))
      await postArticleCommonAdd({
        ...commonAddQuery,
        toUserId: item.userId!,
        fId: item.fId ?? item.id!,
        message: replyMessageVal
      })
      message.success('评论成功')
      setReplyMessageVal('')
      setCommonQuery({
        ...commonQuery,
        pageNum: 1,
        pageSize: commonQuery.pageNum * commonQuery.pageSize
      })
      setCommon({
        ...common,
        list: []
      })
    } catch (err) {
      setCommon((prevCommon) => ({
        ...prevCommon,
        list: prevCommon.list.map((s) =>
          s.id === item.id ? { ...s, replyLoading: false } : s
        )
      }))
    }
  }

  const onLoadMore = async () => {
    setCommonQuery({ ...commonQuery, pageNum: commonQuery.pageNum + 1 })
  }

  const messageClick = (item: CommonRow) => {
    const updateMessageState = (list: CommonRow[]): CommonRow[] => {
      return list
        .map((s) => {
          // 每次都将 isMessage 设为 false
          const updatedChildren = s.children
            ? updateMessageState(s.children)
            : []

          return { ...s, isMessage: false, children: updatedChildren } // 设置所有项的 isMessage 为 false
        })
        .map((s) => {
          // 再次映射，只有当当前项是被点击的项时，将其 isMessage 设为 true
          if (s.id === item.id) {
            return { ...s, isMessage: true } // 仅当前项为 true
          }
          return s // 返回当前项（其余项 isMessage 为 false）
        })
    }
    setCommon((prevCommon) => ({
      ...prevCommon,
      list: updateMessageState(prevCommon.list)
    }))
  }

  const unMessageClcik = (item: CommonRow) => {
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
    setReplyMessageVal('')
    setCommon((prevCommon) => ({
      ...prevCommon,
      list: updateMessageState(prevCommon.list)
    }))
  }

  useEffect(() => {
    postArticleCommonListApi()
  }, [commonQuery])

  useEffect(() => {
    getArticleDetailApi()
  }, [id])

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

  /** 当前用户是否点赞 */
  const getUserLike = (detail: Row) => {
    const like = detail.likedUserIds?.find((s) => s === userInfo.id)
    if (like) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      {loading ? (
        <Card loading={loading} />
      ) : (
        <Card>
          <div className="text-[30px]">{detail.title}</div>
          <div className="mt-2">
            <Avatar src={detail.publishIcon} />
            <span className="ml-1">{detail.publishName}</span>
            <span className="ml-4 text-[#999] text-[12px]">
              发布时间 {detail.createTime}
            </span>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-[#999]">{detail.text}</div>
          <div
            className="mt-2 text-[25px]"
            dangerouslySetInnerHTML={{ __html: detail.detail }}
          ></div>
          {/* 点赞等 */}
          <div className="mt-8">
            <div className="text-[25px] flex-col cursor-pointer flex items-center">
              {getUserLike(detail) ? (
                <>
                  <Like />
                  <span className="mr-2 text-[20px]">已点赞</span>
                </>
              ) : (
                <>
                  <HeartTwoTone twoToneColor="#eb2f96" />
                  <span className="mr-2 text-[20px]">赞一个</span>
                </>
              )}
            </div>
          </div>
          <div className="mt-10">
            <Common
              loading={commonLoading}
              total={common.total}
              commonLoading={commonAddLoading}
              dataSource={common.list}
              loadMore={loadMore}
              messageVal={messageVal}
              replyMessageVal={replyMessageVal}
              sendComment={messageClick}
              unSendComment={unMessageClcik}
              change={onChange}
              replyAdd={onReplyAdd}
              replyChange={onReplyChange}
              add={onAdd}
            />
          </div>
        </Card>
      )}
    </>
  )
}
