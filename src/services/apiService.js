export async function calculateHours(data) {
  const response = await fetch('https://corsproxy.io/?https://falconcloud.co/site_srv10_ph/site/api/qserv.php/13465-770721', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attendanceIn: data.attendanceIn,
      attendanceOut: data.attendanceOut,
      concepts: data.concepts
    })
  });
  return response.ok ? await response.json() : {};
}