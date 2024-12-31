import { useEffect, useState } from 'react'
import { Card, Avatar, Image, Tag, Spin, Empty } from 'antd'
import {
  CalendarOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined
} from '@ant-design/icons'

interface LifePost {
  id: number
  content: string
  location: string
  createTime: string
  images: string[]
  likes: number
  comments: number
  isLiked: boolean
  tags: string[]
  author: {
    name: string
    avatar: string
  }
}

export default function LifePage() {
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<LifePost[]>([
    {
      id: 1,
      content:
        '周末去爬山,看到了很美的日出。生活就是要多出去走走,感受大自然的美好。分享一下今天拍的照片,希望大家也能感受到这份美好~',
      location: '泰山',
      createTime: '2024-01-15 06:30:00',
      images: [
        'https://images.unsplash.com/photo-1501908734255-16579c18c25f?w=800',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
        'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800'
      ],
      likes: 86,
      comments: 12,
      isLiked: false,
      tags: ['旅行', '摄影', '日出'],
      author: {
        name: '摄影师小王',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
      }
    },
    {
      id: 2,
      content:
        '今天尝试了一下烘焙,做了一个草莓蛋糕。虽然是第一次做,但还挺成功的。烘焙真的很有趣,既能让人专注又能获得成就感。',
      location: '我的小厨房',
      createTime: '2024-01-14 14:20:00',
      images: [
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'
      ],
      likes: 156,
      comments: 28,
      isLiked: true,
      tags: ['美食', '烘焙', '蛋糕'],
      author: {
        name: '美食达人',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah'
      }
    },
    {
      id: 3,
      content:
        '养了一只小猫咪,每天回家都特别期待见到它。今天带它去做了绝育手术,希望它能快点恢复健康。',
      location: '宠物医院',
      createTime: '2024-01-13 18:15:00',
      images: [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800',
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800'
      ],
      likes: 245,
      comments: 42,
      isLiked: false,
      tags: ['宠物', '猫咪', '日常'],
      author: {
        name: '猫咪铲屎官',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucy'
      }
    }
  ])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      // const res = await getLifePosts()
      // setPosts(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        }
        return post
      })
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-3xl font-bold text-center mb-8">生活记录</div>
      <Spin spinning={loading}>
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
                bodyStyle={{ padding: '24px' }}
              >
                <div className="flex items-center mb-4">
                  <Avatar
                    src={post.author.avatar}
                    size={48}
                  />
                  <div className="ml-3">
                    <div className="font-medium text-lg">
                      {post.author.name}
                    </div>
                    <div className="flex items-center text-gray-500 text-sm space-x-4">
                      <span className="flex items-center">
                        <CalendarOutlined className="mr-1" />
                        {post.createTime}
                      </span>
                      <span className="flex items-center">
                        <EnvironmentOutlined className="mr-1" />
                        {post.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-gray-700 text-[16px] leading-relaxed mb-4">
                  {post.content}
                </div>

                {post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Image.PreviewGroup>
                      {post.images.map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          alt={`生活照���${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <Tag
                        key={tag}
                        color="processing"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-gray-500">
                    <button
                      className="flex items-center hover:text-pink-500 transition-colors"
                      onClick={() => handleLike(post.id)}
                    >
                      {post.isLiked ? (
                        <HeartFilled className="text-pink-500 mr-1" />
                      ) : (
                        <HeartOutlined className="mr-1" />
                      )}
                      {post.likes}
                    </button>
                    <button className="flex items-center hover:text-blue-500 transition-colors">
                      <MessageOutlined className="mr-1" />
                      {post.comments}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="暂无生活记录" />
        )}
      </Spin>
    </div>
  )
}
