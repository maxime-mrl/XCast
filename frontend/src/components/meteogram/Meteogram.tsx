import Canvas, { chart } from '@utils/canvasTools';
import { useEffect, useRef } from 'react';
import { useForecastStore } from '@store/useForecastStore';
import './Meteogram.css';
import { useUnitStore } from '@store/useUnitsStore';
import chroma, { Color, Scale } from 'chroma-js';

const xChart:chart = {
  min: 4.5,
  max: 22.5,
  displayed: [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ],
  chartMargin: 40
};
const yChart:chart = {
  min: 0,
  max: 5500,
  displayed: [ 100, 500, 1000, 1500, 2000, 3000, 4000, 5000 ],
  chartMargin: 40
};


export default function MetoGram() {
  const containerRef = useRef(null);
  const forecast = useForecastStore.use.forecast();
  const windUnits = useUnitStore.use.wind();
  const colorScale = chroma.scale(windUnits.scale.colors).domain(windUnits.scale.levels)

  useEffect(() => {
    const meteogram = containerRef.current;
    if (!meteogram || !forecast) return;
    const canvas = new Canvas(meteogram);
    canvas.addRenderer(drawChart);
    canvas.addRenderer(drawMeteogram, colorScale);
  }, [forecast, colorScale])

  return (
    <div className='meteogram' ref={containerRef}></div>
  )
}


function drawChart(canvas:Canvas) {
  if (!canvas.ctx) return;
  const ctx = canvas.ctx;
  
  ctx.font = "20px system-ui";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.strokeStyle = "gray"

  yChart.displayed.forEach(value => {
    const coord = canvas.getCoord(0, value, xChart, yChart);
    ctx.fillText(String(value/100), xChart.chartMargin/2, coord.y);
  })

  xChart.displayed.forEach(value => {
    const textCoord = canvas.getCoord(value, 0, xChart, yChart);
    const lineCoord = canvas.getCoord(value + 0.5, 0, xChart, yChart);
    ctx.beginPath();
    ctx.moveTo(lineCoord.x, 0);
    ctx.lineTo(lineCoord.x, canvas.size.height - yChart.chartMargin);
    ctx.stroke();
    ctx.closePath();
    ctx.fillText(String(value), textCoord.x, canvas.size.height - yChart.chartMargin/2);
  })
}

function drawMeteogram(canvas: Canvas, colorScale:Scale<Color>) {
  canvas.drawWindArrow(200, 200, 30, 55, 20, colorScale);
}
