import { Avatar, Button, Card, Flex, Tabs, TabsProps, List } from 'antd'
import { useSelector } from 'react-redux'
import { EditOutlined, SettingOutlined } from '@ant-design/icons'
import { useState } from 'react'

export default function Profile() {
  const { userInfo } = useSelector((state: any) => state.userInfo)
  const [activeKey, setActiveKey] = useState('1')

  const dynamicList = [
    {
      id: 1,
      title: '发布了一篇文章',
      content: '《React Hooks最佳实践》',
      time: '2024-01-10 10:23:45'
    },
    {
      id: 2,
      title: '回答了一个问题',
      content: '如何优化React性能?',
      time: '2024-01-09 15:30:22'
    }
  ]

  const answerList = [
    {
      id: 1,
      question: '如何优化React性能?',
      answer:
        '可以通过以下几种方式优化:1.使用React.memo 2.使用useCallback 3.使用useMemo...',
      time: '2024-01-09 15:30:22'
    }
  ]

  const articleList = [
    {
      id: 1,
      title: 'React Hooks最佳实践',
      desc: '本文介绍了React Hooks的使用技巧和注意事项...',
      time: '2024-01-10 10:23:45',
      views: 123,
      likes: 45
    },
    {
      id: 2,
      title: 'TypeScript入门教程',
      desc: '从零开始学习TypeScript...',
      time: '2024-01-05 14:20:33',
      views: 234,
      likes: 56
    }
  ]

  const collectionList = [
    {
      id: 1,
      title: '前端性能优化实战',
      author: '张三',
      time: '2024-01-08 09:45:12'
    },
    {
      id: 2,
      title: 'Vue3源码解析',
      author: '李四',
      time: '2024-01-07 16:33:21'
    }
  ]

  const likesList = [
    {
      id: 1,
      title: 'Vue3组件库开发实战',
      author: '王五',
      time: '2024-01-11 13:24:56'
    },
    {
      id: 2,
      title: 'React Native入门指南',
      author: '赵六',
      time: '2024-01-10 09:15:30'
    }
  ]

  const topicsList = [
    {
      id: 1,
      name: 'React技术栈',
      followers: 1234,
      posts: 89
    },
    {
      id: 2,
      name: '前端工程化',
      followers: 2345,
      posts: 156
    }
  ]

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '动态',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={dynamicList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <div>{item.content}</div>
                    <div className="text-gray-400">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: '2',
      label: '回答',
      children: (
        <List
          itemLayout="vertical"
          dataSource={answerList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.question}
                description={
                  <div>
                    <div>{item.answer}</div>
                    <div className="text-gray-400">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: '3',
      label: '文章',
      children: (
        <List
          itemLayout="vertical"
          dataSource={articleList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <span key="views">浏览 {item.views}</span>,
                <span key="likes">点赞 {item.likes}</span>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <div>{item.desc}</div>
                    <div className="text-gray-400">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: '4',
      label: '收藏',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={collectionList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <div>作者: {item.author}</div>
                    <div className="text-gray-400">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: '5',
      label: '喜欢',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={likesList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={
                  <div>
                    <div>作者: {item.author}</div>
                    <div className="text-gray-400">{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: '6',
      label: '关注话题',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={topicsList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={
                  <div>
                    <span className="mr-4">关注者: {item.followers}</span>
                    <span>文章数: {item.posts}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )
    }
  ]

  return (
    <div className="w-full">
      <Card
        cover={
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74"
              className={`h-[200px] w-full object-cover`}
              alt="cover"
            />
            <Button
              icon={<EditOutlined />}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px'
              }}
            >
              设置封面
            </Button>
            <Avatar
              size={100}
              src={userInfo.icon}
              style={{
                position: 'absolute',
                bottom: '-50px',
                left: '24px',
                border: '4px solid white'
              }}
            />
          </div>
        }
      >
        <Flex
          justify="space-between"
          style={{ marginLeft: '124px' }} // 为头像留出空间
        >
          <div>
            <div className="text-2xl font-bold mb-2">{userInfo.nickName}</div>
            <div className="text-gray-500">这个人很懒,什么都没写...</div>
          </div>
          <Flex gap={10}>
            <Button
              type="primary"
              icon={<EditOutlined />}
            >
              编辑个人资料
            </Button>
            <Button icon={<SettingOutlined />}>设置</Button>
          </Flex>
        </Flex>
      </Card>

      <Card className="mt-4">
        <Tabs
          activeKey={activeKey}
          items={items}
          onChange={(key) => setActiveKey(key)}
        />
      </Card>
    </div>
  )
}
