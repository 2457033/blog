import { NewInfo, Weather } from '@/api/home'
import XCard from '@/components/XCard'
import { filterCommentTime } from '@/shared/common'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  loading?: boolean
  weather?: Weather
  newInfo?: NewInfo
}

export default function Other(props: Props) {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  // 自动滚动评论
  useEffect(() => {
    if (!scrollRef.current || !props.newInfo?.comment?.length) return

    let scrollHeight = 0
    const scroll = () => {
      if (!scrollRef.current) return

      if (
        scrollHeight >=
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight
      ) {
        scrollHeight = 0
        scrollRef.current.scrollTo(0, 0)
      } else {
        scrollHeight += 1
        scrollRef.current.scrollTo(0, scrollHeight)
      }
    }

    const timer = setInterval(scroll, 30)

    return () => clearInterval(timer)
  }, [props.newInfo?.comment])

  // 跳转到文章详情
  const toArticleDetail = (id: number) => {
    navigate(`/article/${id}`)
  }

  return (
    <>
      <XCard
        className="mt-2"
        loading={props.loading}
      >
        <div className="text-[16px]">热门文章</div>
        <div className="mt-2">
          {props.newInfo?.article?.map((article) => (
            <div
              key={article.id}
              className="py-2 border-b cursor-pointer hover:text-blue-400"
              onClick={() => toArticleDetail(article.id)}
            >
              <div className="text-[14px] line-clamp-1">{article.title}</div>
              <div className="flex justify-between text-[12px] text-gray-400 mt-1">
                <span>{filterCommentTime(article.createTime)}</span>
                <span>访问 {article.visitCount}</span>
              </div>
            </div>
          ))}
        </div>
      </XCard>
      <XCard
        className="mt-2"
        loading={props.loading}
      >
        <div className="text-[16px]">最新评论</div>
        <div
          ref={scrollRef}
          className="mt-2 h-[300px] overflow-hidden"
        >
          {props.newInfo?.comment?.map((comment) => (
            <div
              key={comment.id}
              className="py-2 border-b cursor-pointer hover:text-blue-400"
              onClick={() => toArticleDetail(comment.blogId)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={comment.icon}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-[14px]">{comment.nickName}</span>
              </div>
              <div className="text-[14px] text-gray-600 mt-1">
                {comment.message}
              </div>
              <div className="text-[12px] text-gray-400 mt-1">
                <span>评论于 {comment.title}</span>
                <span className="ml-2">
                  {filterCommentTime(comment.createTime)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </XCard>
      <XCard
        className="mt-2"
        loading={props.loading}
      >
        <div className="text-[16px] mb-3">今日天气</div>
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {props.weather?.status === 200 ? (
            <>
              <div className="text-[20px] font-medium text-white mb-4">
                {props.weather.location?.province}{' '}
                {props.weather.location?.city}
                {props.weather.location?.name}
              </div>
              <div className="text-[48px] font-bold text-white mb-2">
                {props.weather.now?.temp}℃
              </div>
              <div className="flex items-center gap-4 flex-wrap text-[16px] text-white/90">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{props.weather.now?.text}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>↑ {props.weather.forecasts[0]?.high}℃</span>
                  <span>↓ {props.weather.forecasts[0]?.low}℃</span>
                </div>
              </div>
            </>
          ) : (
            <span className="text-[16px] text-white">{props.weather?.msg}</span>
          )}
        </div>
      </XCard>
    </>
  )
}
