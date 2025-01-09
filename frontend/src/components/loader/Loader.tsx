import { useForecastStore } from '@store/useForecastStore';
import { useUserStore } from '@store/useUserStore';
import './Loader.css';

export default function Loader() {
  const forecastStatus = useForecastStore.use.status();
  const userStatus = useUserStore.use.status();

  if (forecastStatus !== 'loading' || userStatus !== 'loading') return null;

  return (
    <div className='loader'>
      <div className='lds-ellipsis'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
