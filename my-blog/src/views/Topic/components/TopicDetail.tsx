import { useEffect, useState } from 'react'
import { Card, Avatar, Button, Tabs, Tag, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'
import Comment from '@/components/Comment'

interface TopicDetail {
  id: number
  name: string
  description: string
  cover: string
  followers: number
  articles: number
  isFollowing: boolean
  tags: string[]
  creator: {
    name: string
    avatar: string
  }
  createTime: string
}

export default function TopicDetailPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [topic] = useState<TopicDetail>({
    id: 1,
    name: 'React技术栈',
    description: '关于React生态的技术讨论，包括React、Redux、React Router等',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    followers: 1234,
    articles: 89,
    isFollowing: true,
    tags: ['前端', 'React', 'Web开发'],
    creator: {
      name: '前端专家',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John'
    },
    createTime: '2024-01-01'
  })

  useEffect(() => {
    fetchTopicDetail()
  }, [id])

  const fetchTopicDetail = async () => {
    try {
      setLoading(true)
      // const res = await getTopicDetail(id)
      // setTopic(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Spin spinning={loading}>
        <Card>
          <div className="relative">
            <img
              src={topic.cover}
              alt={topic.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-3xl font-bold mb-2">{topic.name}</h1>
              <div className="flex items-center gap-4">
                <Avatar src={topic.creator.avatar} />
                <span>{topic.creator.name}</span>
                <span>·</span>
                <span>{topic.createTime}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 text-gray-500">
                <span>{topic.followers} 关注者</span>
                <span>{topic.articles} 篇文章</span>
              </div>
              <div className="flex gap-4">
                <Button
                  type={topic.isFollowing ? 'default' : 'primary'}
                  onClick={() => {}}
                >
                  {topic.isFollowing ? '已关注' : '关注'}
                </Button>
                <Button icon={<EditOutlined />}>发布文章</Button>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{topic.description}</p>

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
          </div>
        </Card>

        <Card className="mt-6">
          <Tabs
            items={[
              {
                key: '1',
                label: '最新文章',
                children: <div>文章列表组件</div>
              },
              {
                key: '2',
                label: '最新动态',
                children: <div>动态列表组件</div>
              },
              {
                key: '3',
                label: '讨论区',
                children: <Comment />
              }
            ]}
          />
        </Card>
      </Spin>
    </div>
  )
}
