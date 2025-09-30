import { colorHash } from "@ctfdio/ctfd-js/ui";
import { mergeObjects } from "../../objects";
import { cumulativeSum } from "../../math";
import dayjs from "dayjs";

export function getOption(mode, places, optionMerge) {
  let option = {
    backgroundColor: 'transparent',
    title: {
      left: "center",
      text: "Top 10 " + (mode === "teams" ? "Teams" : "Users"),
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
      bottom: 35,
      textStyle: {
        color: '#ffffff',
      },
      data: [],
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
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
        type: "time",
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

  const teams = Object.keys(places);
  for (let i = 0; i < teams.length; i++) {
    const team_score = [];
    const times = [];
    for (let j = 0; j < places[teams[i]]["solves"].length; j++) {
      team_score.push(places[teams[i]]["solves"][j].value);
      const date = dayjs(places[teams[i]]["solves"][j].date);
      times.push(date.toDate());
    }

    const total_scores = cumulativeSum(team_score);
    let scores = times.map(function (e, i) {
      return [e, total_scores[i]];
    });

    option.legend.data.push(places[teams[i]]["name"]);

    const data = {
      name: places[teams[i]]["name"],
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
        color: colorHash(places[teams[i]]["name"] + places[teams[i]]["id"]),
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
      },
      data: scores,
    };
    option.series.push(data);
  }

  if (optionMerge) {
    option = mergeObjects(option, optionMerge);
  }
  return option;
}