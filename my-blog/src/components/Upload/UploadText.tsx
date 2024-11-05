import { Upload } from 'antd'

interface UploadTextProps {
  children?: React.ReactNode
}

export default function UploadText({ children }: UploadTextProps) {
  const beforeUpload = (file: any, _fileList: any) => {
    console.log(file)
  }
  const cutsomRequest = () => {}
  return (
    <Upload
      customRequest={cutsomRequest}
      beforeUpload={beforeUpload}
    >
      {children}
    </Upload>
  )
}
