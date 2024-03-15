export function generateHeartRateData(numPoints = 30, minValue = 60, maxValue = 170) {
  const labels = [];
  const data = [];

  for (let i = 0; i < numPoints; i++) {
    const timestamp = new Date(Date.now() - (numPoints - i - 1) * 60000); // Simulate timestamps from 30 minutes ago
    labels.push(timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })); // Format timestamps for x-axis

    const heartRate = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    data.push(heartRate);
  }


  return {
    labels,
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data,
        fill: false, // Avoid filling the area below the line
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Semi-transparent red
        borderColor: 'rgba(255, 99, 132, 1)', // Red line
        pointRadius: 3, // Adjust point size
        pointHitRadius: 10, // Increase clickable area for points
      },
    ],
  };
}