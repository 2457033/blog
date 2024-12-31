import {
  getArticleDetail,
  postArticleDetailCollection,
  postArticleDetailLike,
  postArticleDetailUnCollection,
  postArticleDetailUnLike,
  postArticleDetailVisit,
  Row
} from '@/api/article'
import Common from '@/components/Comment'
import { RootState } from '@/redux'
import { filterCommentTime } from '@/shared/common'
import {
  HeartFilled,
  HeartTwoTone,
  StarFilled,
  StarTwoTone
} from '@ant-design/icons'
import { Avatar, Card, message, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default function Article() {
  const { id } = useParams()
  const [detail, setDetail] = useState({} as Row)
  const [loading, setLoading] = useState(false)

  const { userInfo, token } = useSelector((state: RootState) => state.userInfo)

  const getArticleDetailApi = async () => {
    try {
      setLoading(true)
      const res = await getArticleDetail(Number(id))
      setDetail(res.data)
      getUserLike(res.data)
      getUserCollection(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getArticleDetailApi()
  }, [id, userInfo])

  /** 点赞 */
  const [likeState, setLikeState] = useState(false)
  /** 当前用户是否点赞 */
  const getUserLike = (detail: Row) => {
    const like = detail.likedUserIds?.find((s) => s === userInfo.id)
    if (like) {
      setLikeState(true)
    } else {
      setLikeState(false)
    }
  }

  /** 点赞操作 */
  const likeClick = async () => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (likeState) {
      await postArticleDetailUnLike({
        blogId: Number(id),
        id: userInfo.id
      })
      message.success('已取消点赞')
      setLikeState(false)
    } else {
      await postArticleDetailLike({
        blogId: Number(id),
        id: userInfo.id
      })
      message.success('已点赞')
      setLikeState(true)
    }
  }

  /** 收藏 */
  const [collectionState, setCollectionState] = useState(false)
  /** 当前用户是否收藏 */
  const getUserCollection = (detail: Row) => {
    const collection = detail.collectionUserIds?.find((s) => s === userInfo.id)
    if (collection) {
      setCollectionState(true)
    } else {
      setCollectionState(false)
    }
  }
  /** 收藏操作 */
  const collectionClick = async () => {
    if (!token) {
      message.warning('请先登录')
      return
    }
    if (collectionState) {
      await postArticleDetailUnCollection({
        blogId: Number(id),
        id: userInfo.id
      })
      message.success('已取消收藏')
      setCollectionState(false)
    } else {
      await postArticleDetailCollection({
        blogId: Number(id),
        id: userInfo.id
      })
      message.success('已收藏')
      setCollectionState(true)
    }
  }

  /** 访问 */
  const [visitLoading, setVisitLoading] = useState(false)
  const visit = async () => {
    if (visitLoading) {
      return
    }
    try {
      setVisitLoading(true)
      await postArticleDetailVisit(Number(id))
      setVisitLoading(false)
    } catch (err) {
      setVisitLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      visit()
    }
  }, [detail])

  return (
    <>
      {loading ? (
        <Card loading={loading} />
      ) : (
        <Card className="shadow-lg rounded-xl">
          <div className="text-[32px] font-bold text-gray-800">
            {detail.title}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar
                size={40}
                src={detail.publishIcon}
              />
              <div className="ml-3">
                <div className="text-[16px] font-medium">
                  {detail.publishName}
                </div>
                <div className="text-gray-500 text-[14px]">
                  {filterCommentTime(detail.createTime)}
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="mt-6 p-6 rounded-xl bg-gray-50 text-gray-700">
            {detail.text}
          </div>

          <div
            className="mt-6 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: detail.detail }}
          ></div>

          <div className="mt-10 flex justify-center space-x-12">
            <div
              className="flex flex-col items-center cursor-pointer transition-all hover:scale-110"
              onClick={likeClick}
            >
              {likeState ? (
                <HeartFilled
                  className="text-[32px]"
                  style={{ color: '#ff4d4f' }}
                />
              ) : (
                <HeartTwoTone
                  className="text-[32px]"
                  twoToneColor="#ff4d4f"
                />
              )}
              <span className="mt-2 text-[16px] text-gray-600">
                {likeState ? '已点赞' : '点赞'}
              </span>
            </div>

            <div
              className="flex flex-col items-center cursor-pointer transition-all hover:scale-110"
              onClick={collectionClick}
            >
              {collectionState ? (
                <StarFilled
                  className="text-[32px]"
                  style={{ color: '#faad14' }}
                />
              ) : (
                <StarTwoTone
                  className="text-[32px]"
                  twoToneColor="#faad14"
                />
              )}
              <span className="mt-2 text-[16px] text-gray-600">
                {collectionState ? '已收藏' : '收藏'}
              </span>
            </div>
          </div>

          <Divider />

          <div className="mt-8">
            <Common
              authorId={detail.userId}
              articleId={Number(id)}
            />
          </div>
        </Card>
      )}
    </>
  )
}
