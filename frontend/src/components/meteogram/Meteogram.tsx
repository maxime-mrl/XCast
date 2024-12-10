import Canvas, { chart } from '@utils/canvasTools';
import { useEffect, useRef } from 'react';
import { forecastData, useForecastStore } from '@store/useForecastStore';
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
    canvas.addRenderer(drawMeteogram, {
      colorScale,
      forecast
    });
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

function drawMeteogram(canvas: Canvas, {colorScale, forecast}: {colorScale: Scale<Color>, forecast:forecastData}) {
  const size = 25;
  console.log(forecast)
  forecast.forEach((forecastHour, i) => {
    const time = i + 5; // simulate time cause i don't have the full forecast for now
    for (const [level, u] of Object.entries(forecastHour.forecast.u)) {
      const { wspd, wdir } = uvToWspdWdir(u, forecastHour.forecast.v[level]);
      let { x, y } = canvas.getCoord(time, parseInt(level), xChart, yChart)
      canvas.drawWindArrow(x-size/2, y-size/2, size, wdir, wspd, colorScale);
      canvas.ctx.fillRect(x,y,1,1)
      canvas.ctx.fillStyle = "#000000cc"
      canvas.ctx.fillText(String(Math.round(wspd)), x, y, size)
    }
  })
}

function uvToWspdWdir(u:number, v:number) {
  // Calculate wind speed (pythagore)
  const wspd = (u**2 + v**2)**0.5;

  // Calculate wind direction in degrees
  let wdir = Math.atan2(-u, -v) * (180 / Math.PI); // atan2 uses (-U, -V)
  if (wdir < 0) wdir += 360; // Ensure the direction is in the range [0, 360]

  return {
    wspd,
    wdir
  };
}
