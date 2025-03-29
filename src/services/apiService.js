export async function calculateHours(data) {
  const response = await fetch("/api/proxy", {  // 🔹 Llama a tu API en Vercel
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
});

return response.ok ? await response.json() : {};

}
// import {classifyAttendances} from '../utils/commons.js';
// export  function calculateHours(data) {
//     console.log(classifyAttendances(data.concepts, data.attendanceIn, data.attendanceOut ));
//     console.log(data);
    
//     return classifyAttendances(data.concepts, data.attendanceIn, data.attendanceOut );
// }