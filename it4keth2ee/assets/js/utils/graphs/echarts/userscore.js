import { colorHash } from "@ctfdio/ctfd-js/ui";
import { cumulativeSum } from "../../math";
import { mergeObjects } from "../../objects";
import dayjs from "dayjs";

export function getOption(id, name, solves, awards, optionMerge) {
  let option = {
    backgroundColor: 'transparent',
    title: {
      left: "center",
      text: "Score over Time",
      textStyle: {
        color: '#00ffff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadow: '0 0 10px #00ffff',
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00ffff',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
      },
      axisPointer: {
        type: "cross",
        lineStyle: {
          color: '#00ffff',
          width: 1,
        },
      },
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      align: "left",
      bottom: 0,
      textStyle: {
        color: '#ffffff',
      },
      data: [name],
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      containLabel: true,
      borderColor: 'rgba(0, 255, 255, 0.3)',
      borderWidth: 1,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 255, 255, 0.5)',
            width: 2,
          },
        },
        axisLabel: {
          color: '#cccccc',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 255, 255, 0.1)',
            type: 'dashed',
          },
        },
        data: [],
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 255, 255, 0.5)',
            width: 2,
          },
        },
        axisLabel: {
          color: '#cccccc',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 255, 255, 0.1)',
            type: 'dashed',
          },
        },
      },
    ],
    dataZoom: [
      {
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "filter",
        height: 20,
        top: 35,
        fillerColor: "rgba(0, 255, 255, 0.2)",
        borderColor: 'rgba(0, 255, 255, 0.3)',
        textStyle: {
          color: '#ffffff',
        },
      },
    ],
    series: [],
  };

  const times = [];
  const scores = [];
  const total = solves.concat(awards);

  total.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  for (let i = 0; i < total.length; i++) {
    const date = dayjs(total[i].date);
    times.push(date.toDate());
    try {
      scores.push(total[i].challenge.value);
    } catch (e) {
      scores.push(total[i].value);
    }
  }

  times.forEach(time => {
    option.xAxis[0].data.push(time);
  });

  option.series.push({
    name: name,
    type: "line",
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    lineStyle: {
      width: 3,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 255, 255, 0.5)',
    },
    itemStyle: {
      color: colorHash(name + id),
      borderWidth: 2,
      borderColor: '#ffffff',
      shadowBlur: 10,
      shadowColor: 'rgba(0, 255, 255, 0.5)',
    },
    emphasis: {
      lineStyle: {
        width: 4,
        shadowBlur: 15,
        shadowColor: 'rgba(0, 255, 255, 0.8)',
      },
      itemStyle: {
        shadowBlur: 15,
        shadowColor: 'rgba(0, 255, 255, 0.8)',
      },
    },
    areaStyle: {
      opacity: 0.3,
      color: colorHash(name + id),
    },
    data: cumulativeSum(scores),
  });

  if (optionMerge) {
    option = mergeObjects(option, optionMerge);
  }
  return option;
}