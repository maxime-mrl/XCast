import Canvas from '@utils/canvasTools';
import { useEffect, useRef } from 'react';
import { forecastData, useForecastStore } from '@store/useForecastStore';
import './Sounding.css';
const xChart = {
  min: -35,
  max: 35,
  displayed: [ -30, -20, -10, 0, 10, 20, 30 ],
  chartMargin: 40
};
const yChart = {
  min: 0,
  max: 5500,
  displayed: [ 100, 500, 1000, 1500, 2000, 3000, 4000, 5000 ],
  chartMargin: 40
};

export default function Sounding() {
  const containerRef = useRef(null);
  const forecast = useForecastStore.use.forecast();

  useEffect(() => {
    const sounding = containerRef.current;
    if (!sounding || !forecast) return;
    const canvas = new Canvas(sounding);
    canvas.addRenderer(drawChart)
    canvas.addRenderer(drawSound, forecast)
  }, [forecast])

  return (
    <div className='sounding' ref={containerRef}></div>
  )
}

function getCoord(canvas:Canvas, x: number, y: number) {
  const xIncrement = (canvas.size.width - xChart.chartMargin) / (xChart.max - xChart.min);
  const yIncrement = (canvas.size.height - yChart.chartMargin) / (yChart.max - yChart.min);
  return {
    x: (x - xChart.min) * xIncrement + xChart.chartMargin,
    y: canvas.size.height - (y - yChart.min) * yIncrement - yChart.chartMargin, // invert to start from bottom
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
  
  ctx.fillStyle = "gray";
  ctx.fillRect(0, canvas.size.height - 40, canvas.size.width, 1);

  ctx.font = "20px system-ui";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.strokeStyle = "gray"

  yChart.displayed.forEach(value => {
    const coord = getCoord(canvas, 0, value);
    ctx.beginPath();
    ctx.moveTo(xChart.chartMargin, coord.y);
    ctx.lineTo(canvas.size.width, coord.y);
    ctx.stroke();
    ctx.closePath();
    ctx.fillText(String(value/100), xChart.chartMargin/2, coord.y);
  })

  xChart.displayed.forEach(value => {
    const coord = getCoord(canvas, value, 0);
    ctx.beginPath();
    ctx.moveTo(coord.x, 0);
    ctx.lineTo(coord.x, canvas.size.height - yChart.chartMargin);
    ctx.stroke();
    ctx.closePath();
    ctx.fillText(String(value), coord.x, canvas.size.height - yChart.chartMargin/2);
  })
}

function drawSound(canvas:Canvas, forecasts:forecastData | null) {
  if (!canvas.ctx || !forecasts) return;
  const ctx = canvas.ctx;
  const forecast = forecasts[0].forecast;
  const parsed: {
    level:number,
    temp:number,
    dew:number
  }[] = [];
  
  // convert to celcius and dew point
  for (const [level, temp] of Object.entries(forecast.t)) {
    const tempC = temp - 273.15;
    const dew = calculateDewPoint(tempC, forecast.r[level]);
    parsed.push({
      level: parseInt(level),
      temp: tempC,
      dew
    });
  }
  parsed.sort((a, b) => a.level - b.level);
  // draw
  ctx.lineWidth = 3;
  // temperature
  ctx.beginPath();
  ctx.strokeStyle = "black";
  const tempOrigin = getCoord(canvas, parsed[0].temp, parsed[0].level);
  ctx.moveTo(tempOrigin.x, tempOrigin.y);
  for (let i = 1; i < parsed.length; i++) {
    const tempCoord = getCoord(canvas, parsed[i].temp, parsed[i].level);
    ctx.lineTo(tempCoord.x, tempCoord.y);
  }
  ctx.stroke();
  ctx.closePath();
  // dew
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  const dewOrigin = getCoord(canvas, parsed[0].dew, parsed[0].level);
  ctx.moveTo(dewOrigin.x, dewOrigin.y);
  for (let i = 1; i < parsed.length; i++) {
    const dewCoord = getCoord(canvas, parsed[i].dew, parsed[i].level);
    ctx.lineTo(dewCoord.x, dewCoord.y);
  }
  ctx.stroke();
  ctx.closePath();
}