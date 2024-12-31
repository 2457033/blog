import { useEffect, useState } from 'react'
import { Card, Avatar, Tag, Spin, Empty, Pagination } from 'antd'
import { CalendarOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons'

interface EssayItem {
  id: number
  content: string
  createTime: string
  views: number
  likes: number
  tags: string[]
  images?: string[]
  author: {
    name: string
    avatar: string
  }
}

export default function EssayPage() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 模拟随笔数据
  const [essays] = useState<EssayItem[]>([
    {
      id: 1,
      content:
        '今天学习了Vue3的新特性,组合式API确实比选项式API更灵活。可以更好地复用逻辑,代码也更容易维护。不过刚开始用还是需要适应一下思维方式的转变...',
      createTime: '2024-01-15 14:30:00',
      views: 128,
      likes: 36,
      tags: ['Vue3', '学习笔记'],
      images: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2'
      ],
      author: {
        name: '前端小王',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
      }
    },
    {
      id: 2,
      content:
        '分享一个React性能优化的小技巧: 在使用useCallback时,要注意依赖数组的设置。如果依赖项没有正确设置,可能会导致不必要的重渲染,反而影响性能...',
      createTime: '2024-01-14 16:20:00',
      views: 256,
      likes: 48,
      tags: ['React', '性能优化', '技术分享'],
      author: {
        name: '程序员小李',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John'
      }
    },
    {
      id: 3,
      content:
        '推荐一个很好用的Node.js性能监控工具: clinic.js。它可以帮助分析Node.js应用的CPU使用率、内存泄漏等问题,生成的报告很直观...',
      createTime: '2024-01-13 10:15:00',
      views: 192,
      likes: 42,
      tags: ['Node.js', '工具推荐'],
      images: ['https://picsum.photos/400/300?random=3'],
      author: {
        name: '全栈工程师',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tom'
      }
    }
  ])

  useEffect(() => {
    fetchEssays()
  }, [currentPage])

  const fetchEssays = async () => {
    try {
      setLoading(true)
      // const res = await getEssayList({ page: currentPage, pageSize })
      // setEssays(res.data.list)
      // setTotal(res.data.total)
      setTotal(100) // 模拟总数
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-3xl font-bold text-center mb-8">随笔记录</div>
      <Spin spinning={loading}>
        {essays.length > 0 ? (
          <div className="space-y-6">
            {essays.map((essay) => (
              <Card
                key={essay.id}
                hoverable
                className="overflow-hidden"
              >
                <div className="flex items-center mb-4">
                  <Avatar
                    src={essay.author.avatar}
                    size={40}
                  />
                  <div className="ml-3">
                    <div className="font-medium">{essay.author.name}</div>
                    <div className="text-gray-400 text-sm flex items-center">
                      <CalendarOutlined className="mr-1" />
                      {essay.createTime}
                    </div>
                  </div>
                </div>

                <div className="text-gray-700 mb-4 text-[15px] leading-relaxed">
                  {essay.content}
                </div>

                {essay.images && essay.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {essay.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`随笔图片${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {essay.tags.map((tag) => (
                      <Tag
                        key={tag}
                        color="blue"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center">
                      <EyeOutlined className="mr-1" />
                      {essay.views}
                    </span>
                    <span className="flex items-center">
                      <LikeOutlined className="mr-1" />
                      {essay.likes}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="暂无随笔" />
        )}

        {total > pageSize && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Spin>
    </div>
  )
}
