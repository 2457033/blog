import { getArticleCategory, postArticleList, Row } from '@/api/article'
import XCard from '@/components/XCard'
import { RootState } from '@/redux'
import { filterCommentTime } from '@/shared/common'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Empty, Image, Tabs, Tag } from 'antd'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const tabList = [
  { label: `最新`, key: nanoid() },
  { label: `最热`, key: nanoid() }
]
export default function ArticleList({ searchVal }: { searchVal: string }) {
  const Navigate = useNavigate()
  const [categoryList, setCategoryList] = useState(tabList)
  const { token } = useSelector((state: RootState) => state.userInfo)
  const [articleData, setArticleData] = useState({
    articleList: [] as Row[],
    loading: false
  })

  const [query, setQuery] = useState({
    pageSize: 10,
    pageNum: 1,
    category: '最新',
    searchVal
  })

  /** 高亮 */
  const highlightText = (
    searchVal: any,
    val: any,
    name = 'text-yellow-400'
  ) => {
    const regex = new RegExp(searchVal, 'gi')
    const highlightedContent = val.replace(
      regex,
      (match: any) => `<span class="${name}">${match}</span>`
    )
    return (
      <span dangerouslySetInnerHTML={{ __html: highlightedContent }}></span>
    )
  }

  /** 文章列表 */
  const postArticleListApi = async () => {
    try {
      setArticleData({ ...articleData, loading: true })
      const res = await postArticleList(query)
      setArticleData({ articleList: res.data.row, loading: false })
    } catch (err) {
      console.log(err)
      setArticleData({ ...articleData, loading: false })
    }
  }

  /** 获取分类 */
  const getArticleCategoryApi = async () => {
    try {
      const res = await getArticleCategory()
      if (res.data?.length > 0) {
        const data = res.data.map((s: { category: any; id: any }) => ({
          key: s.id,
          label: s.category
        }))
        setCategoryList([...tabList, ...data])
      }
    } catch (err) {}
  }

  const onTabChange = (key: string) => {
    const item = categoryList.find((s) => s.key === key)
    setQuery({ ...query, category: item?.label! })
  }

  useEffect(() => {
    if (token) {
      getArticleCategoryApi()
    }
  }, [token])

  useEffect(() => {
    setQuery({ ...query, searchVal })
  }, [searchVal])

  useEffect(() => {
    postArticleListApi()
  }, [query])
  return (
    <>
      <div className="mt-3">
        <div>
          <div className="text-[20px]">分类</div>
          <Tabs
            type="card"
            hideAdd
            items={categoryList}
            onChange={onTabChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {articleData.loading ? (
          <XCard loading={articleData.loading} />
        ) : articleData.articleList.length > 0 ? (
          articleData.articleList.map((item) => (
            <div
              key={item.id}
              onClick={() => Navigate(`/article/${item.id}`)}
            >
              <XCard>
                <div className="flex justify-between">
                  <div>
                    <div className="text-[20px]">
                      {highlightText(searchVal, item.title)}
                    </div>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        lineClamp: 3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {highlightText(searchVal, item.text)}
                    </div>
                  </div>
                  {item.img ? (
                    <div className="w-[160px] h-[120px] ml-4">
                      <Image
                        src={item.img}
                        width={160}
                        height={120}
                        className="rounded-xl"
                        preview={false}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center flex-wrap gap-4 mt-2">
                  {/* 用户头像 */}
                  <div>
                    {item.publishIcon ? (
                      <Avatar src={item.publishIcon} />
                    ) : (
                      <Avatar icon={<UserOutlined />} />
                    )}
                    <span className="ml-2">{item.publishName}</span>
                  </div>
                  {/* 标签 */}
                  <div>
                    {item.tags
                      ? item.tags.map((s, index) => (
                          <Tag key={index}>{highlightText(searchVal, s)}</Tag>
                        ))
                      : null}
                  </div>
                  {/* 数据量 */}
                  <div className="flex">
                    <div>访问量 {item.visitCount}</div>
                    <div className="ml-2">点赞量 {item.likeCount}</div>
                    <div className="ml-2">评论量 {item.commonCount}</div>
                  </div>
                  {/* 时间 */}
                  <div>{filterCommentTime(item.createTime)}</div>
                </div>
              </XCard>
            </div>
          ))
        ) : (
          <Empty />
        )}
      </div>
    </>
  )
}
