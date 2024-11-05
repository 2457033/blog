import { Card } from 'antd'
import React from 'react'

interface XCardProps {
  children?: React.ReactNode
  className?: string
  loading?: boolean
}

export default function XCard({
  children,
  className = '',
  loading = false
}: XCardProps) {
  return (
    <Card
      style={{ borderRadius: '12px' }}
      className={className}
      loading={loading}
    >
      <Card.Grid style={{ width: '100%', borderRadius: '12px' }}>
        {children}
      </Card.Grid>
    </Card>
  )
}
