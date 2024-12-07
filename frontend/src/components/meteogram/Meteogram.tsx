import Canvas from '@utils/canvasTools';
import { useEffect, useRef } from 'react';
import { useForecastStore } from '@store/useForecastStore';
import './Meteogram.css';


export default function MetoGram() {
  const containerRef = useRef(null);
  const forecast = useForecastStore.use.forecast();

  useEffect(() => {
    const meteogram = containerRef.current;
    if (!meteogram || !forecast) return;
    const canvas = new Canvas(meteogram);
  }, [forecast])

  return (
    <div className='meteogram' ref={containerRef}></div>
  )
}
