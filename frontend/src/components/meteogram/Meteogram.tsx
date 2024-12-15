import { useEffect, useRef } from 'react';
import { Color, Scale } from 'chroma-js';

import { forecastData, useForecastStore } from '@store/useForecastStore';
import Canvas, { chart } from '@utils/canvasTools';
import { useUnitStore } from '@store/useUnitsStore';
import './Meteogram.css';

const yChart:chart = {
  min: 0,
  max: 5500,
  displayed: [ 100, 500, 1000, 1500, 2000, 3000, 4000, 5000 ],
  chartMargin: 40
};
// xChart is dynamic


export default function MetoGram() {
  const containerRef = useRef(null);
  const forecast = useForecastStore.use.forecast();
  const { scale } = useUnitStore.use.wind();
  const { time:forecastTime } = useForecastStore.use.userSettings();


  useEffect(() => {
    if (!containerRef.current || !forecast || !forecastTime) return;

    const meteogram = containerRef.current;
    const timeRange = getTimeRange(forecast, forecastTime);
    if (!timeRange) return;
    
    const canvas = new Canvas(meteogram, timeRange.chart, yChart);
    canvas.addRenderer(drawChart);
    canvas.addRenderer(drawMeteogram, {
      colorScale: scale.colorScale,
      forecast,
      hour: timeRange.hour
    });
    
    // cleanup canvas
    return () => {
      canvas.clear();
    };
  }, [forecast, scale, forecastTime]);

  return (
    <div className='meteogram' ref={containerRef}></div>
  )
}

function getTimeRange(forecast:forecastData, time:string) {
  const hourIndex = forecast.data.findIndex(data => data.time === time); // actual selected forecast
  if (hourIndex === -1) return null;

  const selectedDay = new Date(time).getDay();
  const hours = forecast.data
    .filter(data => new Date(data.time).getDay() === selectedDay)
    .map(data => new Date(data.time).getHours());

  // aim to display 16h of forecast (a bit more than a flying day)
  let startTime = Math.max(hourIndex - 8, 0);
  let endTime = hourIndex <= 8 ? 15 : hourIndex + 8;
  if (endTime >= hours.length) {
    startTime = Math.max(startTime - (endTime - (hours.length - 1)), 0);
    endTime = hours.length - 1;
  }

  // convert iso time to hours
  return {
    chart: {
      min: hours[startTime] - 0.5,
      max: hours[endTime] + 0.5,
      // displayed: hours.slice(startTime, endTime + 1),
      displayed: hours,
      chartMargin: 40
    } as chart,
    hour: hours[hourIndex],
  };
}

function drawChart(canvas:Canvas) {
  canvas.yChart.displayed.forEach(value => {
    const coord = canvas.getCoord(0, value, canvas.xChart, canvas.yChart);
    canvas.drawText(canvas.xChart.chartMargin/2, coord.y, String(value/100));
  });

  canvas.xChart.displayed.forEach(value => {
    const textCoord = canvas.getCoord(value, 0, canvas.xChart, canvas.yChart);
    const lineCoord = canvas.getCoord(value + 0.5, 0, canvas.xChart, canvas.yChart);
    canvas.drawLine(lineCoord.x, 0, lineCoord.x, canvas.size.height - canvas.yChart.chartMargin);
    canvas.drawText(textCoord.x, canvas.size.height - canvas.yChart.chartMargin/2, String(value));
  })
}

function drawMeteogram(canvas: Canvas, {colorScale, forecast, hour}: {colorScale: Scale<Color>, forecast:forecastData, hour:number}) {
  const size = 25;
  // ground layer
  canvas.drawRectangle({ top: forecast.level, }, "#959695a0", canvas.xChart, canvas.yChart);
  canvas.drawRectangle({ left:hour-0.5, right:hour+0.5 }, "#bbbbbba1", canvas.xChart, canvas.yChart);

  forecast.data.forEach((forecastHour) => {
    const time = new Date(forecastHour.time).getHours(); // simulate time cause i don't have the full forecast for now
    if (time <= canvas.xChart.min || time >= canvas.xChart.max) return;
    
    // boundary layer
    canvas.drawRectangle({ top: forecastHour.bl, left: time-0.5, right: time+0.5, bottom: forecast.level }, "#FFc300A2", canvas.xChart, canvas.yChart);
    // winds levels
    forecastHour.z.forEach((z, i) => {
      let { x, y } = canvas.getCoord(time, z, canvas.xChart, canvas.yChart);
      canvas.drawWindArrow(
        x-size/2,
        y-size/2,
        size,
        forecastHour.wdir[i],
        forecastHour.wspd[i],
        colorScale
      );
      canvas.ctx.fillRect(x,y,1,1);

      canvas.drawText(x, y, String(Math.round(forecastHour.wspd[i])), { maxWidth:size });
    });
  })
}
