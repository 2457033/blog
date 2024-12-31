// import { Carousel, Image, Skeleton } from 'antd'
import UserInfo from './component/UserInfo'
import ArticleList from './component/ArticleList'
import Search from './component/Search'
import Other from './component/Other'
import { getHomeList, getNewInfo, HomeListD, NewInfo } from '@/api/home'
import { useEffect, useState } from 'react'
import { Carousel, Skeleton, Image } from 'antd'

export default function Home() {
  const [list, setList] = useState({} as HomeListD)
  const [newInfo, setNewInfo] = useState({} as NewInfo)
  const [loading, setLoading] = useState(false)

  /** 搜素数据 */
  const [searchVal, setSearchVal] = useState('')
  const getHomeListApi = async () => {
    if (loading) return
    try {
      setLoading(true)
      const res = await getHomeList()
      setList({ swipers: res.data.swipers, weather: res.data.weather })
      const newInfo = await getNewInfo()
      setNewInfo({
        article: newInfo.data.article,
        comment: newInfo.data.comment
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const onPressEnter = (value: string) => {
    setSearchVal(value)
  }

  useEffect(() => {
    getHomeListApi()
  }, [])

  return (
    <div className="flex justify-between w-full flex-wrap gap-4">
      {/* 个人信息 */}
      <div className="w-[26%]">
        <UserInfo />
        <Search onPressEnter={onPressEnter} />
        <Other
          loading={loading}
          weather={list.weather}
          newInfo={newInfo}
        />
      </div>
      {/* 走马灯 */}
      <div className="w-[70%]">
        <Carousel
          arrows
          style={{
            width: '100%'
          }}
          autoplay
          autoplaySpeed={2000}
          draggable
          fade
          dotPosition="top"
        >
          {loading ? (
            <div className="w-full h-[300px]">
              <Skeleton.Image
                active
                style={{
                  width: '100%',
                  height: '300px',
                  position: 'absolute'
                }}
              />
            </div>
          ) : (
            list.swipers?.map((s) => (
              <div
                key={s.id}
                className="w-full"
              >
                <Image
                  className="rounded-xl"
                  src={s.img}
                  preview={false}
                  width="100%"
                  height={300}
                  placeholder
                />
              </div>
            ))
          )}
        </Carousel>

        <ArticleList searchVal={searchVal} />
      </div>
    </div>
  )
}
