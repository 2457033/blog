import { useEffect, useState } from 'react'
import { Image, Card, Spin, Empty, Button, Modal } from 'antd'
import {
  CameraOutlined,
  CalendarOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons'

interface PhotoAlbum {
  id: number
  title: string
  description: string
  cover: string
  createTime: string
  photos: Photo[]
  likes: number
  isLiked: boolean
}

interface Photo {
  id: number
  url: string
  description?: string
}

export default function PhotoAlbumPage() {
  const [loading, setLoading] = useState(false)
  const [currentAlbum, setCurrentAlbum] = useState<PhotoAlbum | null>(null)
  const [showModal, setShowModal] = useState(false)

  // 模拟相册数据
  const [albums, setAlbums] = useState<PhotoAlbum[]>([
    {
      id: 1,
      title: '旅行日记',
      description: '记录每一次旅行的美好瞬间',
      cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      createTime: '2024-01-15',
      likes: 128,
      isLiked: false,
      photos: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
          description: '山川壮丽'
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
          description: '日落时分'
        },
        {
          id: 3,
          url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
          description: '湖光山色'
        }
      ]
    },
    {
      id: 2,
      title: '美食记录',
      description: '品味生活中的美味时刻',
      cover: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327',
      createTime: '2024-01-10',
      likes: 96,
      isLiked: true,
      photos: [
        {
          id: 4,
          url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327',
          description: '精致早餐'
        },
        {
          id: 5,
          url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
          description: '下午茶'
        }
      ]
    },
    {
      id: 3,
      title: '日常生活',
      description: '捕捉生活中的美好瞬间',
      cover: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27',
      createTime: '2024-01-05',
      likes: 156,
      isLiked: false,
      photos: [
        {
          id: 6,
          url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27',
          description: '阳光午后'
        },
        {
          id: 7,
          url: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8',
          description: '宁静时光'
        }
      ]
    }
  ])

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      setLoading(true)
      // const res = await getPhotoAlbums()
      // setAlbums(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = (albumId: number) => {
    setAlbums(
      albums.map((album) => {
        if (album.id === albumId) {
          return {
            ...album,
            isLiked: !album.isLiked,
            likes: album.isLiked ? album.likes - 1 : album.likes + 1
          }
        }
        return album
      })
    )
  }

  const openAlbum = (album: PhotoAlbum) => {
    setCurrentAlbum(album)
    setShowModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-3xl font-bold text-center mb-8">我的相册</div>
      <Spin spinning={loading}>
        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Card
                key={album.id}
                hoverable
                cover={
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="text-white text-lg font-medium">
                        {album.title}
                      </div>
                      <div className="text-white/80 text-sm">
                        {album.description}
                      </div>
                    </div>
                  </div>
                }
                actions={[
                  <Button
                    type="text"
                    icon={<CameraOutlined />}
                    onClick={() => openAlbum(album)}
                  >
                    {album.photos.length}张照片
                  </Button>,
                  <Button
                    type="text"
                    icon={
                      album.isLiked ? (
                        <HeartFilled className="text-pink-500" />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={() => handleLike(album.id)}
                  >
                    {album.likes}
                  </Button>
                ]}
              >
                <Card.Meta
                  description={
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="flex items-center">
                        <CalendarOutlined className="mr-1" />
                        {album.createTime}
                      </span>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="暂无相册" />
        )}
      </Spin>

      <Modal
        title={currentAlbum?.title}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={1000}
      >
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Image.PreviewGroup>
            {currentAlbum?.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group"
              >
                <Image
                  src={photo.url}
                  alt={photo.description}
                  className="rounded-lg"
                />
                {photo.description && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.description}
                  </div>
                )}
              </div>
            ))}
          </Image.PreviewGroup>
        </div>
      </Modal>
    </div>
  )
}
