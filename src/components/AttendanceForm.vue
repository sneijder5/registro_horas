<template>
  <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
    <label class="block text-gray-700 font-semibold">Hora de Entrada:</label>
    <input v-model="attendanceIn" type="time" class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
    <p v-if="errors.attendanceIn" class="text-red-500 text-sm">{{ errors.attendanceIn }}</p>

    <label class="block text-gray-700 font-semibold mt-4">Hora de Salida:</label>
    <input v-model="attendanceOut" type="time" class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
    <p v-if="errors.attendanceOut" class="text-red-500 text-sm">{{ errors.attendanceOut }}</p>

    <div v-for="(concept, index) in concepts" :key="index" class="mt-4">
      <label class="block text-gray-700 font-semibold">{{ concept.name }} Inicio:</label>
      <input v-model="concept.start" type="time" class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
      <p v-if="errors[`concept${index}Start`]" class="text-red-500 text-sm">{{ errors[`concept${index}Start`] }}</p>

      <label class="block text-gray-700 font-semibold">{{ concept.name }} Fin:</label>
      <input v-model="concept.end" type="time" class="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
      <p v-if="errors[`concept${index}End`]" class="text-red-500 text-sm">{{ errors[`concept${index}End`] }}</p>
    </div>

    <label class="block text-gray-700 font-semibold mt-4">Selecciona el tipo de gráfico:</label>
    <div class="flex space-x-4 mt-2">
      <button type="button" @click="chartType = 'bar'" class="p-2 border rounded-lg" :class="{'bg-blue-300': chartType === 'bar'}">
        📊 Barras
      </button>
      <button type="button" @click="chartType = 'pie'" class="p-2 border rounded-lg" :class="{'bg-blue-300': chartType === 'pie'}">
        🥧 Pastel
      </button>
      <button type="button" @click="chartType = 'line'" class="p-2 border rounded-lg" :class="{'bg-blue-300': chartType === 'line'}">
        📈 Línea
      </button>
    </div>

    <button type="submit" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-all">Calcular</button>
  </form>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['calculateHours'],
  setup(_, { emit }) {
    const attendanceIn = ref('');
    const attendanceOut = ref('');
    const chartType = ref('bar');
    const errors = ref({});
    const concepts = ref([
      { id: 'HO', name: 'HO', start: '08:00', end: '17:59' },
      { id: 'HED', name: 'HED', start: '18:00', end: '20:59' },
      { id: 'HEN', name: 'HEN', start: '21:00', end: '05:59' }
    ]);

    const validateForm = () => {
      errors.value = {};

      if (!attendanceIn.value) errors.value.attendanceIn = 'La hora de entrada es obligatoria.';
      if (!attendanceOut.value) errors.value.attendanceOut = 'La hora de salida es obligatoria.';

      concepts.value.forEach((concept, index) => {
        if (!concept.start) errors.value[`concept${index}Start`] = `El inicio de ${concept.name} es obligatorio.`;
        if (!concept.end) errors.value[`concept${index}End`] = `El fin de ${concept.name} es obligatorio.`;
      });

      return Object.keys(errors.value).length === 0;
    };

    const submitForm = () => {
      if (!validateForm()) return;
      emit('calculateHours', { attendanceIn: attendanceIn.value, attendanceOut: attendanceOut.value, concepts: concepts.value, chartType: chartType.value });
    };

    return { attendanceIn, attendanceOut, concepts, submitForm, chartType, errors };
  }
};
</script>
