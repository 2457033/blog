import { Weather } from '@/api/home'
import XCard from '@/components/XCard'

type Props = {
  loading?: boolean
  weather?: Weather
}

export default function Other(props: Props) {
  return (
    <>
      <XCard className="mt-2">
        <div className="text-[16px]">推荐文章</div>
        <div></div>
      </XCard>
      <XCard className="mt-2">
        <div className="text-[16px]">最新评论</div>
        <div></div>
      </XCard>
      <XCard
        className="mt-2"
        loading={props.loading}
      >
        <div className="text-[16px]">今日天气</div>
        <div
          style={{
            background: 'linear-gradient(to right, #00a1ff, #00ff8f, #00a1ff)',
            borderRadius: '12px',
            padding: '8px',
            margin: '0 -8px'
          }}
        >
          {props.weather?.status === 200 ? (
            <>
              <div className="text-[18px]">
                {props.weather.location?.province}{' '}
                {props.weather.location?.city}
                {props.weather.location?.name}
              </div>
              <div className="text-[35px]">
                <span>{props.weather.now?.temp}℃</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[16px]">
                <span>{props.weather.now?.text}</span>
                <span>最高{props.weather.forecasts[0]?.high}℃</span>
                <span>最低{props.weather.forecasts[0]?.low}℃</span>
              </div>
            </>
          ) : (
            <span className="text-[16px]">{props.weather?.msg}</span>
          )}
        </div>
      </XCard>
    </>
  )
}
