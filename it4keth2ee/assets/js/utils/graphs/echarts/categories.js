import { colorHash } from "@ctfdio/ctfd-js/ui";
import { mergeObjects } from "../../objects";

export function getOption(solves, optionMerge) {
  let option = {
    backgroundColor: 'transparent',
    title: {
      left: "center",
      text: "Category Breakdown",
      textStyle: {
        color: '#00ffff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadow: '0 0 10px #00ffff',
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#00ffff',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
      },
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
      },
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      top: "middle",
      right: 0,
      textStyle: {
        color: '#ffffff',
      },
      data: [],
    },
    series: [
      {
        name: "Category Breakdown",
        type: "pie",
        radius: ["30%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        itemStyle: {
          borderWidth: 2,
          borderColor: 'rgba(10, 10, 20, 0.8)',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 255, 255, 0.5)',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 255, 255, 0.8)',
          },
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
            color: '#ffffff',
          },
        },
        labelLine: {
          show: false,
        },
        data: [],
      },
    ],
  };
  const categories = [];

  for (let i = 0; i < solves.length; i++) {
    categories.push(solves[i].challenge.category);
  }

  const keys = categories.filter((elem, pos) => {
    return categories.indexOf(elem) == pos;
  });

  const counts = [];
  for (let i = 0; i < keys.length; i++) {
    let count = 0;
    for (let x = 0; x < categories.length; x++) {
      if (categories[x] == keys[i]) {
        count++;
      }
    }
    counts.push(count);
  }

  keys.forEach((category, index) => {
    option.legend.data.push(category);
    option.series[0].data.push({
      value: counts[index],
      name: category,
      itemStyle: { color: colorHash(category) },
    });
  });

  if (optionMerge) {
    option = mergeObjects(option, optionMerge);
  }
  return option;
}