import { Avatar, Card, Divider, Tag, Tooltip } from 'antd'
import {
  GithubOutlined,
  MailOutlined,
  WechatOutlined,
  QqOutlined,
  CodeOutlined,
  BookOutlined,
  TrophyOutlined,
  HeartOutlined
} from '@ant-design/icons'
import { useState } from 'react'

interface Skill {
  name: string
  level: number
  color: string
}

interface Project {
  name: string
  description: string
  link: string
  tags: string[]
}

export default function AboutPage() {
  const [skills] = useState<Skill[]>([
    { name: 'React', level: 90, color: '#61dafb' },
    { name: 'Vue', level: 85, color: '#42b883' },
    { name: 'TypeScript', level: 85, color: '#3178c6' },
    { name: 'Node.js', level: 80, color: '#339933' },
    { name: 'Next.js', level: 75, color: '#000000' },
    { name: 'Webpack', level: 70, color: '#8dd6f9' }
  ])

  const [projects] = useState<Project[]>([
    {
      name: '个人博客系统',
      description: '基于 React + TypeScript + Node.js 的全栈博客系统',
      link: 'https://github.com/yourusername/blog',
      tags: ['React', 'TypeScript', 'Node.js']
    },
    {
      name: '在线商城',
      description: '基于 Vue3 + Vite + TypeScript 的电商平台',
      link: 'https://github.com/yourusername/shop',
      tags: ['Vue3', 'Vite', 'TypeScript']
    }
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 个人简介卡片 */}
      <Card className="mb-8 overflow-hidden">
        <div className="relative">
          {/* 背景图 */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-r from-blue-500 to-purple-500" />

          {/* 个人信息 */}
          <div className="relative pt-32 pb-4 text-center">
            <Avatar
              size={128}
              src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
              className="border-4 border-white shadow-lg"
            />
            <h1 className="text-2xl font-bold mt-4">前端开发工程师</h1>
            <p className="text-gray-600 mt-2">
              热爱编程，热爱开源，致力于创造优秀的用户体验
            </p>

            {/* 社交链接 */}
            <div className="flex justify-center gap-4 mt-4">
              <Tooltip title="Github">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  <GithubOutlined />
                </a>
              </Tooltip>
              <Tooltip title="邮箱">
                <a
                  href="mailto:your.email@example.com"
                  className="text-2xl text-gray-600 hover:text-gray-800"
                >
                  <MailOutlined />
                </a>
              </Tooltip>
              <Tooltip title="微信">
                <span className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer">
                  <WechatOutlined />
                </span>
              </Tooltip>
              <Tooltip title="QQ">
                <span className="text-2xl text-gray-600 hover:text-gray-800 cursor-pointer">
                  <QqOutlined />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>

      {/* 关于我 */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CodeOutlined className="text-xl" />
            <span>关于我</span>
          </div>
        }
        className="mb-8"
      >
        <p className="text-gray-600 leading-relaxed">
          你好！我是一名前��开发工程师，有着3年的开发经验。我热爱技术，喜欢探索新事物，
          同时也热衷于技术分享和开源社区。在工作中，我注重代码质量和用户体验，
          追求编写优雅且高效的代码。
        </p>
      </Card>

      {/* 技能特长 */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <TrophyOutlined className="text-xl" />
            <span>技能特长</span>
          </div>
        }
        className="mb-8"
      >
        <div className="grid grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-gray-500">{skill.level}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: skill.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 项目经历 */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <BookOutlined className="text-xl" />
            <span>项目经历</span>
          </div>
        }
        className="mb-8"
      >
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.name}>
              <h3 className="text-lg font-medium mb-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500"
                >
                  {project.name}
                </a>
              </h3>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <div className="flex gap-2">
                {project.tags.map((tag) => (
                  <Tag
                    key={tag}
                    color="blue"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
              <Divider style={{ margin: '16px 0' }} />
            </div>
          ))}
        </div>
      </Card>

      {/* 个人爱好 */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <HeartOutlined className="text-xl" />
            <span>个人爱好</span>
          </div>
        }
      >
        <div className="text-gray-600 leading-relaxed">
          <p>除了编程之外，我还喜欢：</p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>阅读技术博客和书籍</li>
            <li>参与开源项目</li>
            <li>写技术博客分享经验</li>
            <li>探索新技术和工具</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
