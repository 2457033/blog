import { Modal, Form, Input, Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import { useState } from 'react'

interface Props {
  open: boolean
  onCancel: () => void
  onOk: (values: any) => void
  loading?: boolean
}

export default function CreateTopicModal({
  open,
  onCancel,
  onOk,
  loading
}: Props) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      onOk({ ...values, cover: fileList[0]?.response?.url })
    } catch (error) {
      console.error('Validate Failed:', error)
    }
  }

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  return (
    <Modal
      title="创建话题"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="话题名称"
          rules={[{ required: true, message: '请输入话题名称' }]}
        >
          <Input placeholder="请输入话题名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="话题描述"
          rules={[{ required: true, message: '请输入话题描述' }]}
        >
          <Input.TextArea
            placeholder="请输入话题描述"
            rows={4}
          />
        </Form.Item>

        <Form.Item
          name="cover"
          label="话题封面"
          rules={[{ required: true, message: '请上传话题封面' }]}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={beforeUpload}
            maxCount={1}
          >
            {fileList.length === 0 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="tags"
          label="话题标签"
          rules={[{ required: true, message: '请输入话题标签' }]}
        >
          <Input placeholder="请输入标签，用逗号分隔" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
