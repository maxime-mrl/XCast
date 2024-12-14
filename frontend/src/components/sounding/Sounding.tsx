import Canvas, { chart } from '@utils/canvasTools';
import { useEffect, useRef } from 'react';
import { forecastData, useForecastStore } from '@store/useForecastStore';
import './Sounding.css';

const xChart:chart = {
  min: -35,
  max: 35,
  displayed: [ -30, -20, -10, 0, 10, 20, 30 ],
  chartMargin: 40
};
const yChart:chart = {
  min: 0,
  max: 5500,
  displayed: [ 100, 500, 1000, 1500, 2000, 3000, 4000, 5000 ],
  chartMargin: 40
};

export default function Sounding() {
  const containerRef = useRef(null);
  const forecast = useForecastStore.use.forecast();
  const { time:forecastTime } = useForecastStore.use.userSettings();

  useEffect(() => {
    const sounding = containerRef.current;
    if (!sounding || !forecast || !forecastTime) return;
    const canvas = new Canvas(sounding, xChart, yChart);
    canvas.addRenderer(drawChart);
    canvas.addRenderer(drawSounding, getForecastTime(forecast, forecastTime));
  }, [forecast, forecastTime])

  return (
    <div className='sounding' ref={containerRef}></div>
  )
}

function getForecastTime(forecast: forecastData, time:string) {
  const forecastHour = forecast.data.find(data => data.time === time);
  return {
    level: forecast.level,
    data: forecastHour
  }
}

function calculateDewPoint(temp:number, rh:number) {
  // Magnus-Tetens approximation
  const a = 17.27; const b = 237.7; // Constants
  const alpha = Math.log(rh / 100) + (a * temp) / (b + temp);
  return (b * alpha) / (a - alpha);
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
    ctx.beginPath();
    ctx.moveTo(xChart.chartMargin, coord.y);
    ctx.lineTo(canvas.size.width, coord.y);
    ctx.stroke();
    ctx.closePath();
    ctx.fillText(String(value/100), xChart.chartMargin/2, coord.y);
  })

  xChart.displayed.forEach(value => {
    const coord = canvas.getCoord(value, 0, xChart, yChart);
    ctx.beginPath();
    ctx.moveTo(coord.x, 0);
    ctx.lineTo(coord.x, canvas.size.height - yChart.chartMargin);
    ctx.stroke();
    ctx.closePath();
    ctx.fillText(String(value), coord.x, canvas.size.height - yChart.chartMargin/2);
  })
}

function drawSounding({ctx, getCoord, drawRectangle}:Canvas, forecast: {
  level: number,
  data: forecastData["data"][0] | undefined
}) {
  if (!forecast.data) return;
  const forecastData = forecast.data; // without local one typescript is mad
  
  const parsed: {
    level:number,
    temp:number,
    dew:number
  }[] = [];
  
  // ground layer
  drawRectangle({ top: forecast.level, }, "#959695a0", xChart, yChart);
  // boundary layer
  drawRectangle({ top: forecastData.bl, bottom: forecast.level }, "#FFc300A2", xChart, yChart);
  
  // convert to celcius and dew point
  forecastData.z.forEach((z, i) => {
    const dew = calculateDewPoint(forecastData.t[i], forecastData.r[i]);
    parsed.push({
      level: z,
      temp: forecastData.t[i],
      dew
    });
  })
  parsed.sort((a, b) => a.level - b.level);
  // draw
  ctx.lineWidth = 3;
  // temperature
  ctx.beginPath();
  ctx.strokeStyle = "black";
  const tempOrigin = getCoord(parsed[0].temp, parsed[0].level, xChart, yChart);
  ctx.moveTo(tempOrigin.x, tempOrigin.y);
  for (let i = 1; i < parsed.length; i++) {
    const tempCoord = getCoord(parsed[i].temp, parsed[i].level, xChart, yChart);
    ctx.lineTo(tempCoord.x, tempCoord.y);
  }
  ctx.stroke();
  ctx.closePath();
  // dew
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  const dewOrigin = getCoord(parsed[0].dew, parsed[0].level, xChart, yChart);
  ctx.moveTo(dewOrigin.x, dewOrigin.y);
  for (let i = 1; i < parsed.length; i++) {
    const dewCoord = getCoord(parsed[i].dew, parsed[i].level, xChart, yChart);
    ctx.lineTo(dewCoord.x, dewCoord.y);
  }
  ctx.stroke();
  ctx.closePath();
}
