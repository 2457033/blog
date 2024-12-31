import { Button, Card, Divider, Form, FormProps, Input, message } from 'antd'
import { useState } from 'react'
import { postLogin } from '@/api/login/login'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { updateToken } from '@/redux/userInfo'

import css from './index.module.less'

type FieldType = {
  username?: string
  password?: string
  nickName?: string
  registName?: string
  registPassword?: string
}

export default function Login() {
  const Navigate = useNavigate()
  const [key, setKey] = useState('login')
  const [query] = useState({
    userName: '',
    password: '',
    code: ''
  })
  const dispatch = useDispatch()
  const [loginLoading, setLoginLoading] = useState(false)
  const loginFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setLoginLoading(true)
      const res = await postLogin({
        ...query,
        userName: values.username!,
        password: values.password!
      })
      const { token } = res.data
      if (!token) {
        message.error('登录失败，请重新登录')
        return
      }
      localStorage.setItem('user_token', token)
      dispatch(updateToken(token))
      message.success('登录成功')
      setLoginLoading(false)
      Navigate(-1)
    } catch (err) {
      setLoginLoading(false)
    }
  }

  return (
    <div className={`h-full w-full flex items-center justify-center ${css.bg}`}>
      <Card className="w-[500px]">
        <div className="text-[25px]">{key === 'login' ? '登录' : '注册'}</div>
        {key === 'login' ? (
          <>
            <Form
              className="mt-2"
              onFinish={loginFinish}
            >
              <Form.Item<FieldType>
                name="username"
                rules={[{ required: true, message: '请输入账号/手机号/邮箱' }]}
              >
                <Input placeholder="请输入账号/手机号/邮箱" />
              </Form.Item>
              <Form.Item<FieldType>
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  placeholder="请输入密码"
                  maxLength={16}
                />
              </Form.Item>
              <Form.Item
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Button
                  className="w-[100px]"
                  type="primary"
                  htmlType="submit"
                  loading={loginLoading}
                  disabled={loginLoading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
            <div className="flex items-center justify-between">
              <Button
                type="link"
                className="text-[#999]"
                onClick={() => setKey('regist')}
              >
                账号注册
              </Button>
              <Button
                type="link"
                className="text-[#999]"
              >
                忘记密码
              </Button>
            </div>
            <div>
              <Divider>社交登录</Divider>
              <div>
                <span>qqq</span>
                <span>wxx</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <Form className="mt-2">
              <Form.Item<FieldType>
                name="registName"
                rules={[{ required: true, message: '请输入账号/手机号/邮箱' }]}
              >
                <Input placeholder="请输入账号/手机号/邮箱" />
              </Form.Item>
              <Form.Item<FieldType>
                name="nickName"
                rules={[{ required: true, message: '请输入昵称' }]}
              >
                <Input placeholder="请输入昵称" />
              </Form.Item>
              <Form.Item<FieldType>
                name="registPassword"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input placeholder="请输入密码" />
              </Form.Item>
              <Form.Item
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Button
                  className="w-[100px]"
                  type="primary"
                  htmlType="submit"
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
            <div className="mt-4 flex items-center">
              已有账号
              <Button
                type="link"
                onClick={() => setKey('login')}
              >
                去登录
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
