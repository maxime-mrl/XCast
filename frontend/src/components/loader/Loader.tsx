import { useForecastStore } from '@store/useForecastStore';
import './Loader.css';

export default function Loader() {
  const forecastStatus = useForecastStore.use.status();

  if (forecastStatus !== 'loading') return null;

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
