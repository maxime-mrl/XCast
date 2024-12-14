import { useEffect, useRef } from 'react';

import { forecastData, useForecastStore } from '@store/useForecastStore';
import Canvas, { chart } from '@utils/canvasTools';
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
    if (!containerRef.current || !forecast || !forecastTime) return;

    const sounding = containerRef.current;
    const forecastHour = getForecastTime(forecast, forecastTime);
    if (!forecastHour) return;

    const canvas = new Canvas(sounding, xChart, yChart);
    canvas.addRenderer(drawChart);
    canvas.addRenderer(drawSounding, forecastHour);

    // cleanup canvas
    return () => {
      canvas.clear();
    };
  }, [forecast, forecastTime]);

  return (
    <div className='sounding' ref={containerRef}></div>
  )
}

function getForecastTime(forecast: forecastData, time:string) {
  const forecastHour = forecast.data.find(data => data.time === time);
  if (!forecastHour) return null;
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
  canvas.yChart.displayed.forEach(value => {
    const coord = canvas.getCoord(0, value, canvas.xChart, canvas.yChart);
    canvas.drawLine(canvas.xChart.chartMargin, coord.y, canvas.size.width, coord.y);
    canvas.drawText(canvas.xChart.chartMargin/2, coord.y, String(value/100));
  });

  canvas.xChart.displayed.forEach(value => {
    const coord = canvas.getCoord(value, 0, canvas.xChart, canvas.yChart);
    canvas.drawLine(coord.x, 0, coord.x, canvas.size.height - canvas.yChart.chartMargin);
    canvas.drawText(coord.x, canvas.size.height - canvas.yChart.chartMargin/2, String(value));
  })
}

function drawSounding(canvas:Canvas, forecast: {
  level: number,
  data: forecastData["data"][0]
}) {
  // ground layer
  canvas.drawRectangle({ top: forecast.level, }, "#959695a0", xChart, yChart);
  // boundary layer
  canvas.drawRectangle({ top: forecast.data.bl, bottom: forecast.level }, "#FFc300A2", xChart, yChart);
  
  // parse data
  const parsed = forecast.data.z.map((z, i) => ({
    level: z,
    temp: forecast.data.t[i],
    dew: calculateDewPoint(forecast.data.t[i], forecast.data.r[i]),
  })).sort((a, b) => a.level - b.level); // Sort by level

  // draw
  const drawLine = (dataKey: "temp" | "dew", color: string) => {
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = 3;
    canvas.ctx.strokeStyle = color;

    const origin = canvas.getCoord(parsed[0][dataKey], parsed[0].level, xChart, yChart);
    canvas.ctx.moveTo(origin.x, origin.y);

    for (let i = 1; i < parsed.length; i++) {
      const coord = canvas.getCoord(parsed[i][dataKey], parsed[i].level, xChart, yChart);
      canvas.ctx.lineTo(coord.x, coord.y);
    }

    canvas.ctx.stroke();
    canvas.ctx.closePath();
  };
  drawLine("temp", "black");
  drawLine("dew", "blue");
}

