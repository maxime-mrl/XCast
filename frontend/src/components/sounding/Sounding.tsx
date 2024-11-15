import Canvas from '@utils/canvasTools';
import './Sounding.css';
import { useEffect, useRef } from 'react';

export default function Sounding() {
  const containerRef = useRef(null)

  useEffect(() => {
    const sounding = containerRef.current
    console.log(sounding)
    if (!sounding) return;
    new Canvas(sounding)
  }, [])

  return (
    <div className='sounding' ref={containerRef}>
    </div>
  )
}
