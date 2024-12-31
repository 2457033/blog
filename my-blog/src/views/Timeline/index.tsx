import { useEffect, useState } from 'react'
import { Timeline, Spin } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface TimelineItem {
  id: number
  title: string
  content: string
  createTime: string
  month: string
  year: string
  tags: string[]
}

export default function TimelinePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [timelineData] = useState<TimelineItem[]>([
    {
      id: 1,
      title: 'Vue3 + TypeScript 从零到一',
      content: '本文将介绍如何使用 Vue3 和 TypeScript 搭建一个完整的项目...',
      createTime: '2024-01-15 14:30:00',
      month: '一月',
      year: '2024',
      tags: ['Vue3', 'TypeScript']
    },
    {
      id: 2,
      title: 'React18 Hooks最佳实践',
      content: '深入探讨 React18 中 Hooks 的使用技巧和注意事项...',
      createTime: '2024-01-10 16:20:00',
      month: '一月',
      year: '2024',
      tags: ['React', 'Hooks']
    },
    {
      id: 3,
      title: 'Node.js进阶指南',
      content: '从实践角度出发，讲解 Node.js 的高级特性和性能优化...',
      createTime: '2023-12-25 10:00:00',
      month: '十二月',
      year: '2023',
      tags: ['Node.js', '后端']
    }
  ])

  useEffect(() => {
    fetchTimelineData()
  }, [])

  const fetchTimelineData = async () => {
    try {
      setLoading(true)
      // const res = await getTimelineList()
      // setTimelineData(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`)
  }

  // 用于跟踪年份显示
  let currentYear = ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-3xl font-bold text-center mb-12">文章时间轴</div>
      <Spin spinning={loading}>
        <Timeline
          mode="left"
          items={timelineData.map((item) => {
            const showYear = currentYear !== item.year
            if (showYear) {
              currentYear = item.year
            }

            return {
              label: (
                <div className="text-gray-500">
                  {showYear && (
                    <div className="text-xl font-bold mb-2">{item.year}</div>
                  )}
                  <div className="text-sm">{item.createTime}</div>
                </div>
              ),
              dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
              children: (
                <div
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-6"
                  onClick={() => handleArticleClick(item.id)}
                >
                  <div className="text-lg font-medium text-gray-800 mb-2">
                    {item.title}
                  </div>
                  <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.content}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )
            }
          })}
        />
      </Spin>
    </div>
  )
}
