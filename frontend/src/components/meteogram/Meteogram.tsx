import Canvas, { chart } from '@utils/canvasTools';
import { useEffect, useRef } from 'react';
import { forecastData, useForecastStore } from '@store/useForecastStore';
import './Meteogram.css';
import { useUnitStore } from '@store/useUnitsStore';
import chroma, { Color, Scale } from 'chroma-js';

const yChart:chart = {
  min: 0,
  max: 5500,
  displayed: [ 100, 500, 1000, 1500, 2000, 3000, 4000, 5000 ],
  chartMargin: 40
};


export default function MetoGram() {
  const containerRef = useRef(null);
  const forecast = useForecastStore.use.forecast();
  const { scale: windScale } = useUnitStore.use.wind();
  const { time:forecastTime } = useForecastStore.use.userSettings();
  const colorScale = chroma.scale(windScale.colors).domain(windScale.levels);

  useEffect(() => {
    const meteogram = containerRef.current;
    if (!meteogram || !forecast || !forecastTime) return;
    const timeRange = getTimeRange(forecast, forecastTime);
    if (!timeRange) return;
    console.log(timeRange)
    const canvas = new Canvas(meteogram, timeRange.chart, yChart);
    canvas.addRenderer(drawChart);
    canvas.addRenderer(drawMeteogram, {
      colorScale,
      forecast,
      hour: timeRange.hour
    });
  }, [forecast, colorScale, forecastTime])

  return (
    <div className='meteogram' ref={containerRef}></div>
  )
}

function getTimeRange(forecast:forecastData, time:string) {
  const hour = forecast.data.findIndex(data => data.time === time); // actual selected forecast
  const selectedDay = new Date(time).getDay()
  let hours: string[] | number[] = forecast.data.map(data => data.time);
  hours = hours.filter(h => new Date(h).getDay() === selectedDay);
  hours = hours.map(h => new Date(h).getHours());
  if (!hour) return null;
  // aim to display 16h of forecast (a bit more than a flying day)
  let startTime = Math.max(hour - 8, 0);
  let endTime = hour <= 8 ? 15 : hour + 8;
  if (endTime >= hours.length) {
    startTime = Math.max(startTime - (endTime - (hours.length - 1)), 0)
    endTime = hours.length - 1;
  }
  console.log(startTime, hour, endTime)
  // convert iso time to hours
  return {
    chart: {
      min: hours[startTime] - 0.5,
      max: hours[endTime] + 0.5,
      // displayed: hours.slice(startTime, endTime + 1),
      displayed: hours,
      chartMargin: 40
    } as chart,
    hour: hours[hour],
  };
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
    const coord = canvas.getCoord(0, value, canvas.xChart, yChart);
    ctx.fillText(String(value/100), canvas.xChart.chartMargin/2, coord.y);
  })

  canvas.xChart.displayed.forEach(value => {
    const textCoord = canvas.getCoord(value, 0, canvas.xChart, yChart);
    const lineCoord = canvas.getCoord(value + 0.5, 0, canvas.xChart, yChart);
    ctx.beginPath();
    ctx.moveTo(lineCoord.x, 0);
    ctx.lineTo(lineCoord.x, canvas.size.height - yChart.chartMargin);
    ctx.stroke();
    ctx.closePath();
    ctx.fillText(String(value), textCoord.x, canvas.size.height - yChart.chartMargin/2);
  })
}

function drawMeteogram(canvas: Canvas, {colorScale, forecast, hour}: {colorScale: Scale<Color>, forecast:forecastData, hour:number}) {
  const size = 25;
  // ground layer
  canvas.drawRectangle({ top: forecast.level, }, "#959695a0", canvas.xChart, yChart);

  canvas.drawRectangle({ left:hour-0.5, right:hour+0.5 }, "#bbbbbba1", canvas.xChart, yChart)

  forecast.data.forEach((forecastHour, i) => {
    const time = new Date(forecastHour.time).getHours(); // simulate time cause i don't have the full forecast for now
    if (time <= canvas.xChart.min || time >= canvas.xChart.max) return;
    
    // boundary layer
    canvas.drawRectangle({ top: forecastHour.bl, left: time-0.5, right: time+0.5, bottom: forecast.level }, "#FFc300A2", canvas.xChart, yChart);
    // winds levels
    forecastHour.z.forEach((z, i) => {
      let { x, y } = canvas.getCoord(time, z, canvas.xChart, yChart);
      canvas.drawWindArrow(
        x-size/2,
        y-size/2,
        size,
        forecastHour.wdir[i],
        forecastHour.wspd[i],
        colorScale
      );
      canvas.ctx.fillRect(x,y,1,1)

      canvas.ctx.font = "20px system-ui";
      canvas.ctx.textBaseline = "middle";
      canvas.ctx.textAlign = "center";
      canvas.ctx.fillStyle = "black";
      canvas.ctx.fillText(String(Math.round(forecastHour.wspd[i])), x, y, size)
    })
  })
}
