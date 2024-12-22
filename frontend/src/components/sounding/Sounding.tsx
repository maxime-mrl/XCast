import { useEffect, useRef } from 'react';

import { forecastData, useForecastStore } from '@store/useForecastStore';
import Canvas, { chart, generateYchart } from '@utils/canvasTools';
import './Sounding.css';
import { useUnitStore } from '@store/useUnitsStore';

const xChart:chart = {
  min: -35,
  max: 35,
  displayed: [ -30, -20, -10, 0, 10, 20, 30 ],
  chartMargin: 40
};

const yIncrements = [ 100, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6500, 8000, 10000 ];

export default function Sounding() {
  const containerRef = useRef(null);
  const forecast = useForecastStore.use.forecast();
    const { units, selected } = useUnitStore.use.temp();
  const { time:forecastTime, maxHeight } = useForecastStore.use.userSettings();

  useEffect(() => {
    // check everything is here
    if (!containerRef.current || !forecast || !forecastTime) return;
    // get the correct time to display
    const sounding = containerRef.current;
    const forecastHour = getForecastTime(forecast, forecastTime);
    if (!forecastHour) return;
    // init canvas
    const yChart = generateYchart({
      min: forecast.level,
      max: maxHeight,
      increments: yIncrements,
    });

    const canvas = new Canvas(sounding, xChart, yChart);
    canvas.addRenderer(drawChart, {units, selected});
    canvas.addRenderer(drawSounding, forecastHour);

    // cleanup canvas
    return () => {
      canvas.clear();
    };
  }, [forecast, forecastTime, maxHeight, units, selected]);

  return (
    <div className='sounding' ref={containerRef}></div>
  )
}

/* ------------------------ get the time of forecast ------------------------ */
function getForecastTime(forecast: forecastData, time:string) {
  const forecastHour = forecast.data.find(data => data.time === time); // actual selected time forecast
  if (!forecastHour) return null;
  return {
    level: forecast.level,
    data: forecastHour
  }
}

/* ----------------------------- draw the chart ----------------------------- */
function drawChart(canvas:Canvas, { units, selected } :
  { selected:string, units: { [key: string]: (base: number) => number } }
) {
  canvas.yChart.displayed.forEach(value => { // y axis (height)
    canvas.drawLine(canvas.xChart.min, value, canvas.xChart.max, value);
    const coord = canvas.getCoord(0, value);
    canvas.drawText(canvas.xChart.chartMargin/2, coord.y, String(Math.round(value/100)));
  });

  canvas.xChart.displayed.forEach(value => { // x axis (temperature)
    canvas.drawLine(value, canvas.yChart.max, value, canvas.yChart.min);
    const coord = canvas.getCoord(value, 0);
    canvas.drawText(coord.x, canvas.size.height - canvas.yChart.chartMargin/2, String(units[selected](value)));
  })
}

/* ------------------- draw sounding graph (dew end temp) ------------------- */
function drawSounding({ drawRectangle, ctx, getCoord, drawLine }:Canvas, forecast: {
  level: number,
  data: forecastData["data"][0]
}) {
  // ground layer
  drawRectangle({ top: forecast.level, }, "#959695a0");
  // boundary layer
  drawRectangle({ top: forecast.data.bl, bottom: forecast.level }, "#FFc300A2");
  
  // parse data
  const parsed = forecast.data.z.map((z, i) => ({
    level: z,
    temp: forecast.data.t[i],
    dew: calculateDewPoint(forecast.data.t[i], forecast.data.r[i]),
  })).sort((a, b) => a.level - b.level); // Sort by level

  // draw functions
  const drawContiniousLine = (dataKey: "temp" | "dew", defindedColor?: string) => {
    // start the line
    // const origin = getCoord(parsed[0][dataKey], parsed[0].level);
    // ctx.moveTo(origin.x, origin.y);
    // draw line at each points
    for (let i = 1; i < parsed.length; i++) {
      const actual = { value: parsed[i][dataKey], level: parsed[i].level }
      const prev = { value: parsed[i-1][dataKey], level: parsed[i-1].level }
      const coord = getCoord(parsed[i][dataKey], parsed[i].level);
      const instabilityLevel = (actual.value - prev.value) / ((actual.level - prev.level) / 100);
      const color = defindedColor ? defindedColor :
      instabilityLevel <= -0.98
        ? "yellow" // absolutely unstable air
        : instabilityLevel <= -0.6
          ? "lightgreen" // conditionally unstable air
          : instabilityLevel < 0
            ? "black" // stable
            : "red"; // inversion
      drawLine(prev.value, prev.level, actual.value, actual.level, {
        width: 3,
        color,
      })
      ctx.lineTo(coord.x, coord.y);
    }
    // stroke
  };
  // draw each graphs
  drawContiniousLine("temp");
  drawContiniousLine("dew", "blue");
}

/* ------------- Get dew point from relative humidity and temps ------------- */
function calculateDewPoint(temp:number, rh:number) {
  // Magnus-Tetens approximation
  const a = 17.27; const b = 237.7; // Constants
  const alpha = Math.log(rh / 100) + (a * temp) / (b + temp);
  return (b * alpha) / (a - alpha);
}
