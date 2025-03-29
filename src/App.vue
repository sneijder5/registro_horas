<template>
  <div class="min-h-screen bg-gradient-to-r from-blue-200 to-blue-500 flex flex-col md:flex-row p-6">
    <div class="w-full md:w-1/3 p-4">
      <h1 class="text-4xl font-bold text-white mb-6 text-center">Registro de Horas</h1>
      <AttendanceForm @calculateHours="fetchWorkedHours" />
    </div>
    <div class="w-full md:w-2/3 flex justify-center items-center">
      <ChartDisplay :data="chartData" :chartType="chartType" v-if="chartData" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import AttendanceForm from './components/AttendanceForm.vue';
import ChartDisplay from './components/ChartDisplay.vue';
import { calculateHours } from './services/apiService';

export default {
  components: { AttendanceForm, ChartDisplay },
  setup() {
    const chartData = ref(null);
    const chartType = ref('bar');
    
    const fetchWorkedHours = async (formData) => {
      chartData.value = await calculateHours(formData);
      chartType.value = formData.chartType;
    };
    
    return { chartData, chartType, fetchWorkedHours };
  }
};
</script>