import { CSSProperties } from 'react'
import loadingImage from '@/assets/image/1445249755227857.gif'
export default function Loading() {
  const styles: CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundColor: '#fff',
    flexDirection: 'column'
  }
  return (
    <div style={styles}>
      <div>
        <img src={loadingImage} />
      </div>
      <div>Loading...</div>
    </div>
  )
}
