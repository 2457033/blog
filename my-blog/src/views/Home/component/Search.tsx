import XCard from '@/components/XCard'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useState } from 'react'

export default function Search(props?: any) {
  const [searchVal] = useState('')
  const onPressEnter = (e: any) => {
    props.onPressEnter(e.target.value)
  }
  return (
    <XCard className="mt-2">
      <div className="text-[16px]">搜索</div>
      <Input
        suffix={<SearchOutlined />}
        placeholder="输入关键字"
        v-model:value={searchVal}
        onPressEnter={onPressEnter}
        onBlur={onPressEnter}
      />
    </XCard>
  )
}
