<template>
  <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-lg md:w-2/3">
    <h2 class="text-2xl font-bold text-gray-700">Resultados</h2>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { onMounted, watch, ref } from 'vue';
import Chart from 'chart.js/auto';

export default {
  props: ['data', 'chartType'],
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;
    
    const renderChart = () => {
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(chartCanvas.value, {
        type: props.chartType,
        data: {
          labels: Object.keys(props.data),
          datasets: [{
            label: 'Horas trabajadas',
            data: Object.values(props.data),
            backgroundColor: ['#3b82f6', '#f97316', '#22c55e'],
          }]
        }
      });
    };
    
    onMounted(() => renderChart());
    watch(() => props.chartType, () => renderChart());
    watch(() => props.data, () => renderChart());
    
    return { chartCanvas };
  }
};
</script>
