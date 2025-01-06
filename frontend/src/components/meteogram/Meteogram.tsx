import { useEffect, useRef } from 'react';
import { Color, Scale } from 'chroma-js';

import { forecastData, useForecastStore } from '@store/useForecastStore';
import Canvas, { chart, generateYchart } from '@utils/canvasTools';
import { useUnitStore } from '@store/useUnitsStore';
import './Meteogram.css';

const yIncrements = [ 100, 500, 1000, 1500, 2000, 3000, 4000, 5000, 6500, 8000, 10000 ];
const minChartWidth = 650;

export default function MetoGram() {
  const containerRef = useRef(null); // ref for canvas
  // get stored data
  const forecast = useForecastStore.use.forecast();
  const { scale, units, selected } = useUnitStore.use.wind();
  const { time:forecastTime, maxHeight } = useForecastStore.use.userSettings();

  useEffect(() => {
    // check everything is here
    if (!containerRef.current || !forecast || !forecastTime) return;
    const meteogram = containerRef.current;
    // get the correct time range to display
    const timeRange = getTimeRange(forecast, forecastTime);
    if (!timeRange) return;
    // init canvas
    const yChart = generateYchart({
      min: forecast.level,
      max: maxHeight,
      increments: yIncrements,
    })

    const canvas = new Canvas(meteogram, timeRange.chart, yChart);
    canvas.addRenderer(drawChart);
    canvas.addRenderer(drawMeteogram, {
      colorScale: scale.colorScale,
      forecast,
      hour: timeRange.hour,
      selected,
      units
    });
    
    // cleanup canvas
    return () => {
      canvas.clear();
    };
  }, [forecast, scale, forecastTime, maxHeight, selected, units]);

  return (
    <div className='meteogram' ref={containerRef}></div>
  )
}

/* ------------- get the time range to display (array of times) ------------- */
function getTimeRange(forecast:forecastData, time:string) {
  const hourIndex = forecast.data.findIndex(data => data.time === time); // actual selected time forecast
  if (hourIndex === -1) return null; // if no time return
  // get all hours of the same day
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
      chartMargin: 40,
      minWidth: minChartWidth,
    } as chart,
    hour: hours[hourIndex],
  };
}

/* ----------------------------- draw the chart ----------------------------- */
function drawChart(canvas:Canvas) {
  canvas.yChart.displayed.forEach(value => { // y axis (height)
    const coord = canvas.getCoord(0, value);
    canvas.drawText(canvas.xChart.chartMargin/2, coord.y, String(Math.round(value)), {font:"15px system-ui"});
  });

  canvas.xChart.displayed.forEach(value => { // x axis (time)
    const coord = canvas.getCoord(value, 0);
    canvas.drawLine(value + 0.5, canvas.yChart.max, value + 0.5, canvas.yChart.min);
    canvas.drawText(coord.x, canvas.size.height - canvas.yChart.chartMargin/2, String(value));
  })
}

/* ----------- draw meteogram (wind and thermal at every heights) ----------- */
function drawMeteogram(
  { xChart, drawRectangle, drawWindArrow, drawText, canvas }: Canvas,
  {colorScale, forecast, hour, selected, units}: {
    colorScale: Scale<Color>,
    forecast:forecastData,
    hour:number,
    selected:string,
    units: { [key: string]: (base: number) => number }
  }
) {
  const textSize = canvas.width/50;
  const arrrowSize = Math.max(14, textSize); // wind arrow size
  console.log(textSize)
  // ground layer
  drawRectangle({ top: forecast.level, }, "#959695a0");
  // selected time
  drawRectangle({ left:hour-0.5, right:hour+0.5 }, "#bbbbbba1");

  // draw for every hours
  forecast.data.forEach((forecastHour) => {
    const time = new Date(forecastHour.time).getHours(); // simulate time cause i don't have the full forecast for now
    if (time <= xChart.min || time >= xChart.max) return;
    
    // boundary layer
    drawRectangle({ top: forecastHour.bl, left: time-0.5, right: time+0.5, bottom: forecast.level }, "#FFc300A2");
    // winds arrows
    forecastHour.z.forEach((z, i) => {
      drawWindArrow(
        time +0.2, z, arrrowSize,
        forecastHour.wdir[i], forecastHour.wspd[i],
        { colorScale, center:true }
      );
      // wind speed (text)
      drawText(time - 0.2, z, String(units[selected](forecastHour.wspd[i])), { pointCoordinates:true, font:`${textSize}px system-ui` });
    });
  })
}
