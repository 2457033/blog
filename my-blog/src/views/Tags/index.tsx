import { useEffect, useState } from 'react'
import { Tag, Spin, Card, Row, Col, Divider } from 'antd'
import { useNavigate } from 'react-router-dom'

interface TagItem {
  name: string
  color: string
  count: number
}

interface ArticleItem {
  id: number
  title: string
  createTime: string
  tags: string[]
  description: string
}

export default function TagsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string>('')

  // 模拟标签数据
  const [tags] = useState<TagItem[]>([
    { name: 'React', color: '#61dafb', count: 8 },
    { name: 'Vue', color: '#42b883', count: 6 },
    { name: 'TypeScript', color: '#3178c6', count: 5 },
    { name: 'JavaScript', color: '#f7df1e', count: 10 },
    { name: 'Node.js', color: '#339933', count: 4 },
    { name: 'Next.js', color: '#000000', count: 3 },
    { name: 'Webpack', color: '#8dd6f9', count: 2 },
    { name: 'CSS', color: '#264de4', count: 7 },
    { name: 'HTML', color: '#e34f26', count: 5 },
    { name: '前端工程化', color: '#1890ff', count: 4 },
    { name: '性能优化', color: '#52c41a', count: 3 },
    { name: '设计模式', color: '#722ed1', count: 2 }
  ])

  // 模拟文章数据
  const [articles] = useState<ArticleItem[]>([
    {
      id: 1,
      title: 'React Hooks 最佳实践',
      createTime: '2024-01-15',
      tags: ['React', 'TypeScript'],
      description:
        '深入探讨React Hooks的使用技巧和注意事项，帮助你写出更好的React代码...'
    },
    {
      id: 2,
      title: 'Vue3组合式API详解',
      createTime: '2024-01-10',
      tags: ['Vue', 'TypeScript'],
      description:
        '全面解析Vue3组合式API的使用方法和实践技巧，助你快速掌握Vue3新特性...'
    },
    {
      id: 3,
      title: 'Node.js性能优化指南',
      createTime: '2024-01-05',
      tags: ['Node.js', '性能优化'],
      description:
        '从实践角度出发，详细讲解Node.js应用的性能优化策略和最佳实践...'
    }
  ])

  useEffect(() => {
    fetchData()
  }, [selectedTag])

  const fetchData = async () => {
    try {
      setLoading(true)
      // 这里应该调用获取标签相关的接口
      // const res = await getTagsList()
      // setTags(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTagClick = (tagName: string) => {
    setSelectedTag(tagName === selectedTag ? '' : tagName)
  }

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`)
  }

  const filteredArticles = selectedTag
    ? articles.filter((article) => article.tags.includes(selectedTag))
    : articles

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-3xl font-bold text-center mb-8">文章标签</div>
      <Spin spinning={loading}>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="text-lg font-medium mb-4">所有标签</div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Tag
                key={tag.name}
                color={selectedTag === tag.name ? tag.color : undefined}
                style={{
                  cursor: 'pointer',
                  padding: '4px 12px',
                  fontSize: '14px',
                  border:
                    selectedTag === tag.name
                      ? 'none'
                      : `1px solid ${tag.color}`,
                  color: selectedTag === tag.name ? 'white' : tag.color
                }}
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name} ({tag.count})
              </Tag>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <div className="text-lg font-medium">
              {selectedTag ? `${selectedTag}相关文章` : '最新文章'}
            </div>
            <div className="text-gray-400 text-sm ml-2">
              ({filteredArticles.length})
            </div>
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={[16, 16]}>
            {filteredArticles.map((article) => (
              <Col
                key={article.id}
                xs={24}
                sm={12}
                lg={8}
              >
                <Card
                  hoverable
                  className="h-full"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <h3 className="text-lg font-medium mb-2 line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <div className="flex gap-2">
                      {article.tags.map((tag) => (
                        <Tag
                          key={tag}
                          color={tags.find((t) => t.name === tag)?.color}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <span>{article.createTime}</span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Spin>
    </div>
  )
}
