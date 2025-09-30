import "./main";
import CTFd from "../compat/CTFd";
import $ from "jquery";
import echarts from "echarts/dist/echarts.common";
import { colorHash } from "../compat/styles";

const graph_configs = {
  "#solves-graph": {
    data: () => CTFd.api.get_challenge_solve_statistics(),
    format: (response) => {
      const data = response.data;
      const chals = [];
      const counts = [];
      const solves = {};
      for (let c = 0; c < data.length; c++) {
        solves[data[c]["id"]] = {
          name: data[c]["name"],
          solves: data[c]["solves"],
        };
      }

      const solves_order = Object.keys(solves).sort(function (a, b) {
        return solves[b].solves - solves[a].solves;
      });

      $.each(solves_order, function (key, value) {
        chals.push(solves[value].name);
        counts.push(solves[value].solves);
      });

      const option = {
        title: {
          left: "center",
          text: "题目解决统计",
          textStyle: {
            color: "#00ffff",
            fontSize: 18,
            fontWeight: "bold",
            textShadow: "0 0 10px #00ffff",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(10, 10, 20, 0.9)",
          borderColor: "#00ffff",
          borderWidth: 1,
          textStyle: {
            color: "#e0e0ff",
            fontSize: 12,
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(0, 255, 255, 0.3)",
            },
          },
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
          iconStyle: {
            borderColor: "#00ffff",
            color: "#00ffff",
          },
          emphasis: {
            iconStyle: {
              borderColor: "#ff00ff",
              color: "#ff00ff",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          top: "15%",
          containLabel: true,
          backgroundColor: "rgba(10, 10, 20, 0.3)",
        },
        xAxis: {
          name: "解决次数",
          nameLocation: "middle",
          nameGap: 30,
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#00ffff",
              width: 2,
            },
          },
          axisLabel: {
            color: "#e0e0ff",
            fontSize: 11,
          },
          nameTextStyle: {
            color: "#00ffff",
            fontSize: 12,
            fontWeight: "bold",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0, 255, 255, 0.2)",
              type: "dashed",
            },
          },
        },
        yAxis: {
          name: "题目名称",
          nameLocation: "middle",
          nameGap: 80,
          type: "category",
          data: chals,
          axisLine: {
            lineStyle: {
              color: "#00ffff",
              width: 2,
            },
          },
          axisLabel: {
            interval: 0,
            rotate: 0,
            color: "#e0e0ff",
            fontSize: 10,
          },
          nameTextStyle: {
            color: "#00ffff",
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        dataZoom: [
          {
            show: false,
            start: 0,
            end: 100,
          },
          {
            type: "inside",
            yAxisIndex: 0,
            show: true,
            width: 20,
            zoomLock: true,
          },
          {
            type: "slider",
            show: true,
            right: "5%",
            width: 20,
            start: 0,
            end: 100,
            backgroundColor: "rgba(10, 10, 20, 0.8)",
            dataBackground: {
              areaStyle: {
                color: "rgba(0, 255, 255, 0.3)",
              },
            },
            fillerColor: "rgba(0, 255, 255, 0.2)",
            borderColor: "#00ffff",
            textStyle: {
              color: "#e0e0ff",
            },
          },
        ],
        series: [
          {
            name: "解决次数",
            type: "bar",
            barWidth: "60%",
            data: counts,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: "#00ffff" },
                  { offset: 0.5, color: "#ff00ff" },
                  { offset: 1, color: "#ff0066" },
                ],
              },
              borderColor: "#00ffff",
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: "rgba(0, 255, 255, 0.5)",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgba(255, 0, 255, 0.8)",
              },
            },
            label: {
              show: true,
              position: "right",
              color: "#e0e0ff",
              fontSize: 10,
              fontWeight: "bold",
              formatter: "{c}",
            },
          },
        ],
        backgroundColor: "rgba(10, 10, 20, 0.5)",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
      };

      return option;
    },
  },

  "#keys-pie-graph": {
    data: () => CTFd.api.get_submission_property_counts({ column: "type" }),
    format: (response) => {
      const data = response.data;
      const solves = data["correct"];
      const fails = data["incorrect"];

      let option = {
        title: {
          left: "center",
          text: "提交统计",
          textStyle: {
            color: "#00ffff",
            fontSize: 18,
            fontWeight: "bold",
            textShadow: "0 0 10px #00ffff",
          },
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(10, 10, 20, 0.9)",
          borderColor: "#00ffff",
          borderWidth: 1,
          textStyle: {
            color: "#e0e0ff",
            fontSize: 12,
          },
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {},
          },
          iconStyle: {
            borderColor: "#00ffff",
            color: "#00ffff",
          },
          emphasis: {
            iconStyle: {
              borderColor: "#ff00ff",
              color: "#ff00ff",
            },
          },
        },
        legend: {
          orient: "vertical",
          top: "middle",
          right: 10,
          data: ["错误提交", "正确提交"],
          textStyle: {
            color: "#e0e0ff",
            fontSize: 12,
          },
        },
        series: [
          {
            name: "提交统计",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["40%", "50%"],
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: "outside",
              formatter: "{b}\n{c} ({d}%)",
              color: "#e0e0ff",
              fontSize: 11,
              fontWeight: "bold",
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 15,
              lineStyle: {
                color: "rgba(0, 255, 255, 0.5)",
              },
            },
            itemStyle: {
              borderColor: "#00ffff",
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: "rgba(0, 255, 255, 0.3)",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
                color: "#ffffff",
              },
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgba(255, 0, 255, 0.8)",
              },
            },
            data: [
              {
                value: fails,
                name: "错误提交",
                itemStyle: { 
                  color: {
                    type: "radial",
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                      { offset: 0, color: "#ff0066" },
                      { offset: 1, color: "#cc0055" }
                    ]
                  }
                },
              },
              {
                value: solves,
                name: "正确提交",
                itemStyle: { 
                  color: {
                    type: "radial",
                    x: 0.5,
                    y: 0.5,
                    r: 0.8,
                    colorStops: [
                      { offset: 0, color: "#00ff88" },
                      { offset: 1, color: "#00cc66" }
                    ]
                  }
                },
              },
            ],
          },
        ],
        backgroundColor: "rgba(10, 10, 20, 0.5)",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
      };

      return option;
    },
  },

  "#categories-pie-graph": {
    data: () => CTFd.api.get_challenge_property_counts({ column: "category" }),
    format: (response) => {
      const data = response.data;

      const categories = [];
      const count = [];

      for (let category in data) {
        if (Object.hasOwn(data, category)) {
          categories.push(category);
          count.push(data[category]);
        }
      }

      for (let i = 0; i < data.length; i++) {
        categories.push(data[i].category);
        count.push(data[i].count);
      }

      let option = {
        title: {
          left: "center",
          text: "题目分类",
          textStyle: {
            color: "#00ffff",
            fontSize: 18,
            fontWeight: "bold",
            textShadow: "0 0 10px #00ffff",
          },
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(10, 10, 20, 0.9)",
          borderColor: "#00ffff",
          borderWidth: 1,
          textStyle: {
            color: "#e0e0ff",
            fontSize: 12,
          },
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {},
          },
          iconStyle: {
            borderColor: "#00ffff",
            color: "#00ffff",
          },
          emphasis: {
            iconStyle: {
              borderColor: "#ff00ff",
              color: "#ff00ff",
            },
          },
        },
        legend: {
          type: "plain",
          orient: "horizontal",
          top: "bottom",
          data: [],
          textStyle: {
            color: "#e0e0ff",
            fontSize: 11,
          },
        },
        series: [
          {
            name: "题目分类",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "45%"],
            label: {
              show: true,
              position: "outside",
              formatter: "{b}\n{c} ({d}%)",
              color: "#e0e0ff",
              fontSize: 10,
              fontWeight: "bold",
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
              lineStyle: {
                color: "rgba(0, 255, 255, 0.5)",
              },
            },
            itemStyle: {
              borderColor: "#00ffff",
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: "rgba(0, 255, 255, 0.3)",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
                color: "#ffffff",
              },
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgba(255, 0, 255, 0.8)",
              },
            },
            data: [],
          },
        ],
        backgroundColor: "rgba(10, 10, 20, 0.5)",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
      };

      categories.forEach((category, index) => {
        option.legend.data.push(category);
        option.series[0].data.push({
          value: count[index],
          name: category,
          itemStyle: { color: colorHash(category) },
        });
      });

      return option;
    },
  },

  "#points-pie-graph": {
    data: () => {
      return CTFd.fetch(
        "/api/v1/statistics/challenges/category?function=sum&target=value",
        {
          method: "GET",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      ).then(function (response) {
        return response.json();
      });
    },
    format: (response) => {
      const data = response.data;

      const categories = [];
      const count = [];

      for (let category in data) {
        if (Object.hasOwn(data, category)) {
          categories.push(category);
          count.push(data[category]);
        }
      }

      for (let i = 0; i < data.length; i++) {
        categories.push(data[i].category);
        count.push(data[i].count);
      }

      let option = {
        title: {
          left: "center",
          text: "积分分布",
          textStyle: {
            color: "#00ffff",
            fontSize: 18,
            fontWeight: "bold",
            textShadow: "0 0 10px #00ffff",
          },
        },
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(10, 10, 20, 0.9)",
          borderColor: "#00ffff",
          borderWidth: 1,
          textStyle: {
            color: "#e0e0ff",
            fontSize: 12,
          },
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {},
          },
          iconStyle: {
            borderColor: "#00ffff",
            color: "#00ffff",
          },
          emphasis: {
            iconStyle: {
              borderColor: "#ff00ff",
              color: "#ff00ff",
            },
          },
        },
        legend: {
          type: "plain",
          orient: "horizontal",
          top: "bottom",
          data: [],
          textStyle: {
            color: "#e0e0ff",
            fontSize: 11,
          },
        },
        series: [
          {
            name: "积分分布",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "45%"],
            label: {
              show: true,
              position: "outside",
              formatter: "{b}\n{c} ({d}%)",
              color: "#e0e0ff",
              fontSize: 10,
              fontWeight: "bold",
            },
            labelLine: {
              show: true,
              length: 15,
              length2: 10,
              lineStyle: {
                color: "rgba(0, 255, 255, 0.5)",
              },
            },
            itemStyle: {
              borderColor: "#00ffff",
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: "rgba(0, 255, 255, 0.3)",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                fontWeight: "bold",
                color: "#ffffff",
              },
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgba(255, 0, 255, 0.8)",
              },
            },
            data: [],
          },
        ],
        backgroundColor: "rgba(10, 10, 20, 0.5)",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
      };

      categories.forEach((category, index) => {
        option.legend.data.push(category);
        option.series[0].data.push({
          value: count[index],
          name: category,
          itemStyle: { color: colorHash(category) },
        });
      });

      return option;
    },
  },

  "#solve-percentages-graph": {
    layout: (annotations) => ({
      title: "Solve Percentages per Challenge",
      xaxis: {
        title: "Challenge Name",
      },
      yaxis: {
        title: `Percentage of ${
          CTFd.config.userMode.charAt(0).toUpperCase() +
          CTFd.config.userMode.slice(1)
        } (%)`,
        range: [0, 100],
      },
      annotations: annotations,
    }),
    data: () => CTFd.api.get_challenge_solve_percentages(),
    format: (response) => {
      const data = response.data;

      const names = [];
      const percents = [];

      const annotations = [];

      for (let key in data) {
        names.push(data[key].name);
        percents.push(data[key].percentage * 100);

        const result = {
          x: data[key].name,
          y: data[key].percentage * 100,
          text: Math.round(data[key].percentage * 100) + "%",
          xanchor: "center",
          yanchor: "bottom",
          showarrow: false,
        };
        annotations.push(result);
      }

      const option = {
        title: {
          left: "center",
          text: "题目解决率",
          textStyle: {
            color: "#00ffff",
            fontSize: 18,
            fontWeight: "bold",
            textShadow: "0 0 10px #00ffff",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(10, 10, 20, 0.9)",
          borderColor: "#00ffff",
          borderWidth: 1,
          textStyle: {
            color: "#e0e0ff",
            fontSize: 12,
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(0, 255, 255, 0.3)",
            },
          },
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {},
          },
          iconStyle: {
            borderColor: "#00ffff",
            color: "#00ffff",
          },
          emphasis: {
            iconStyle: {
              borderColor: "#ff00ff",
              color: "#ff00ff",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          top: "15%",
          containLabel: true,
          backgroundColor: "rgba(20, 20, 40, 0.3)",
        },
        xAxis: {
          type: "category",
          data: names,
          axisLine: {
            lineStyle: {
              color: "#00ffff",
              width: 2,
            },
          },
          axisLabel: {
            color: "#e0e0ff",
            rotate: 45,
            fontSize: 10,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0, 255, 255, 0.1)",
              type: "dashed",
            },
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          axisLine: {
            lineStyle: {
              color: "#00ffff",
              width: 2,
            },
          },
          axisLabel: {
            color: "#e0e0ff",
            formatter: "{value}%",
            fontSize: 10,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(0, 255, 255, 0.1)",
              type: "dashed",
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
            backgroundColor: "rgba(10, 10, 20, 0.8)",
            dataBackground: {
              lineStyle: {
                color: "#00ffff",
              },
              areaStyle: {
                color: "rgba(0, 255, 255, 0.2)",
              },
            },
            fillerColor: "rgba(0, 255, 255, 0.1)",
            borderColor: "#00ffff",
          },
        ],
        series: [
          {
            name: "解决率",
            type: "bar",
            data: percents,
            barWidth: "60%",
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#00ffff" },
                  { offset: 0.5, color: "#ff00ff" },
                  { offset: 1, color: "#ff0066" },
                ],
              },
              borderColor: "#00ffff",
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: "rgba(0, 255, 255, 0.5)",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgba(255, 0, 255, 0.8)",
              },
            },
            label: {
              show: true,
              position: "top",
              color: "#ffffff",
              fontSize: 10,
              fontWeight: "bold",
              formatter: "{c}%",
            },
          },
        ],
        backgroundColor: "rgba(10, 10, 20, 0.5)",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
      };

      return option;
    },
  },

  "#score-distribution-graph": {
    layout: (annotations) => ({
      title: "Score Distribution",
      xaxis: {
        title: "Score Bracket",
        showticklabels: true,
        type: "category",
      },
      yaxis: {
        title: `Number of ${
          CTFd.config.userMode.charAt(0).toUpperCase() +
          CTFd.config.userMode.slice(1)
        }`,
      },
      annotations: annotations,
    }),
    data: () =>
      CTFd.fetch("/api/v1/statistics/scores/distribution").then(
        function (response) {
          return response.json();
        },
      ),
    format: (response) => {
      const data = response.data.brackets;
      const keys = [];
      const brackets = [];
      const sizes = [];

      for (let key in data) {
        keys.push(parseInt(key));
      }
      keys.sort((a, b) => a - b);

      let start = "<0";
      keys.map((key) => {
        brackets.push(`${start} - ${key}`);
        sizes.push(data[key]);
        start = key;
      });

      const option = {
        title: {
          left: "center",
          text: "分数分布",
          textStyle: {
            color: "#00ffff",
            fontSize: 18,
            fontWeight: "bold",
            textShadow: "0 0 10px #00ffff",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(10, 10, 20, 0.9)",
          borderColor: "#00ffff",
          borderWidth: 1,
          textStyle: {
            color: "#e0e0ff",
            fontSize: 12,
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(0, 255, 255, 0.3)",
            },
          },
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
          iconStyle: {
            borderColor: "#00ffff",
            color: "#00ffff",
          },
          emphasis: {
            iconStyle: {
              borderColor: "#ff00ff",
              color: "#ff00ff",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          top: "15%",
          containLabel: true,
          backgroundColor: "rgba(10, 10, 20, 0.3)",
        },
        xAxis: {
          name: "分数区间",
          nameGap: 30,
          nameLocation: "middle",
          type: "category",
          data: brackets,
          axisLine: {
            lineStyle: {
              color: "#00ffff",
              width: 2,
            },
          },
          axisLabel: {
            color: "#e0e0ff",
            fontSize: 10,
            rotate: 45,
            margin: 8,
          },
          nameTextStyle: {
            color: "#00ffff",
            fontSize: 12,
            fontWeight: "bold",
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          name: `${
            CTFd.config.userMode.charAt(0).toUpperCase() +
            CTFd.config.userMode.slice(1)
          }数量`,
          nameGap: 40,
          nameLocation: "middle",
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#00ffff",
              width: 2,
            },
          },
          axisLabel: {
            color: "#e0e0ff",
            fontSize: 11,
          },
          nameTextStyle: {
            color: "#00ffff",
            fontSize: 12,
            fontWeight: "bold",
          },
          splitLine: {
            lineStyle: {
              color: "rgba(0, 255, 255, 0.2)",
              type: "dashed",
            },
          },
        },
        dataZoom: [
          {
            show: false,
            start: 0,
            end: 100,
          },
          {
            type: "inside",
            show: true,
            start: 0,
            end: 100,
            zoomLock: true,
          },
          {
            type: "slider",
            show: true,
            bottom: "5%",
            height: 20,
            start: 0,
            end: 100,
            backgroundColor: "rgba(10, 10, 20, 0.8)",
            dataBackground: {
              areaStyle: {
                color: "rgba(0, 255, 255, 0.3)",
              },
            },
            fillerColor: "rgba(0, 255, 255, 0.2)",
            borderColor: "#00ffff",
            textStyle: {
              color: "#e0e0ff",
            },
          },
        ],
        series: [
          {
            name: "用户数量",
            type: "bar",
            barWidth: "70%",
            data: sizes,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "#00ffff" },
                  { offset: 0.5, color: "#ff00ff" },
                  { offset: 1, color: "#ff0066" },
                ],
              },
              borderColor: "#00ffff",
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: "rgba(0, 255, 255, 0.5)",
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgba(255, 0, 255, 0.8)",
              },
            },
            label: {
              show: true,
              position: "top",
              color: "#e0e0ff",
              fontSize: 10,
              fontWeight: "bold",
              formatter: "{c}",
            },
          },
        ],
        backgroundColor: "rgba(10, 10, 20, 0.5)",
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
      };

      return option;
    },
  },
};

const createGraphs = () => {
  for (let key in graph_configs) {
    const cfg = graph_configs[key];

    const $elem = $(key);
    $elem.empty();

    let chart = echarts.init(document.querySelector(key));

    cfg
      .data()
      .then(cfg.format)
      .then((option) => {
        chart.setOption(option);
        $(window).on("resize", function () {
          if (chart != null && chart != undefined) {
            chart.resize();
          }
        });
      });
  }
};

function updateGraphs() {
  for (let key in graph_configs) {
    const cfg = graph_configs[key];
    let chart = echarts.init(document.querySelector(key));
    cfg
      .data()
      .then(cfg.format)
      .then((option) => {
        chart.setOption(option);
      });
  }
}

$(() => {
  createGraphs();
  setInterval(updateGraphs, 300000);
});