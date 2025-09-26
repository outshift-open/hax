export const DATA_VISUALIZER_DESCRIPTION =
  `Use data visualizers to create charts and graphs for displaying quantitative data and trends. Best for showing relationships, comparisons, distributions, and patterns in numerical data. Supports all Chart.js chart types including line, bar, pie, doughnut, radar, scatter, and polar area charts.

Choose chart types based on your data: line charts for trends over time, bar charts for comparisons, pie/doughnut for parts of a whole, scatter for correlations, radar for multi-dimensional comparisons. Always include proper axis labels and legends for clarity. Use responsive design by setting maintainAspectRatio: false in options.

Provide data in Chart.js format with datasets array containing data points and styling. Include meaningful labels for axes and data points. Use consistent color schemes and avoid more than 6-8 data series per chart to maintain readability. Set appropriate scales and tick intervals based on your data range.

Common pitfalls: Don't use pie charts for more than 5-6 categories. Avoid 3D effects or excessive animations that distract from data. Don't start bar/line charts at non-zero values without clear indication. Ensure sufficient color contrast for accessibility. Large datasets (>100 points) may cause performance issues - consider data aggregation or sampling.` as const;
