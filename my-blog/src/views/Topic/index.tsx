import { useEffect, useState } from 'react'
import { Card, Tag, Button, Input, Pagination } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface Topic {
  id: number
  name: string
  description: string
  cover: string
  followers: number
  articles: number
  isFollowing: boolean
  tags: string[]
}

export default function TopicPage() {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  console.log(searchValue)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(9)
  const [total, setTotal] = useState(0)

  // 模拟话题数据
  const [topics] = useState<Topic[]>([
    {
      id: 1,
      name: 'React技术栈',
      description: '关于React生态的技术讨论，包括React、Redux、React Router等',
      cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      followers: 1234,
      articles: 89,
      isFollowing: true,
      tags: ['前端', 'React', 'Web开发']
    },
    {
      id: 2,
      name: '前端工程化',
      description: '探讨前端工程化实践，包括构建工具、CI/CD、性能优化等',
      cover: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
      followers: 2345,
      articles: 156,
      isFollowing: false,
      tags: ['前端', '工程化', 'DevOps']
    },
    {
      id: 3,
      name: '算法与数据结构',
      description: '分享编程算法与数据结构相关的知识和实践',
      cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
      followers: 3456,
      articles: 234,
      isFollowing: false,
      tags: ['算法', '数据结构', '编程基础']
    }
  ])

  useEffect(() => {
    // 设置总数据量
    setTotal(topics.length)
  }, [topics])

  const handleFollow = (topicId: number) => {
    // 处理关注/取消关注逻辑
    console.log(topicId)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    // 处理搜索逻辑
  }

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page)
    setPageSize(size)
    // 这里可以添加获取对应页数据的逻辑
  }

  // 计算当前页显示的数据
  const currentTopics = topics.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-3xl font-bold">话题广场</div>
        <div className="flex gap-4">
          <Input.Search
            placeholder="搜索话题"
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
          >
            创建话题
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTopics.map((topic) => (
          <Card
            key={topic.id}
            cover={
              <img
                alt={topic.name}
                src={topic.cover}
                className="h-48 object-cover"
              />
            }
            hoverable
            onClick={() => navigate(`/topic/${topic.id}`)}
          >
            <Card.Meta
              title={
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{topic.name}</span>
                  <Button
                    type={topic.isFollowing ? 'default' : 'primary'}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFollow(topic.id)
                    }}
                  >
                    {topic.isFollowing ? '已关注' : '关注'}
                  </Button>
                </div>
              }
              description={
                <div className="space-y-3">
                  <p className="text-gray-600 line-clamp-2">
                    {topic.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topic.tags.map((tag) => (
                      <Tag
                        key={tag}
                        color="blue"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>{topic.followers} 关注者</span>
                    <span>{topic.articles} 篇文章</span>
                  </div>
                </div>
              }
            />
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `共 ${total} 条`}
        />
      </div>
    </div>
  )
}
