import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getVideoUploadTrendUrl } from "../http/VideoServiceUrls";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VideoUploadTrend = () => {
  const [chartData, setChartData] = useState({
    labels: [], // Labels for the X-axis (time periods)
    datasets: [] // Datasets for the chart data
  });
  const [period, setPeriod] = useState("day"); // Default to 'day'

  useEffect(() => {
    const fetchUploadTrends = async () => {
      try {
        const response = await fetch(getVideoUploadTrendUrl(period));
        if (!response.ok) {
          throw new Error("Failed to fetch video upload trends.");
        }
        const result = await response.json();
        const labels = Object.keys(result);
        const values = Object.values(result);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `Videos Uploaded (${period})`,
              data: values,
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching video upload trends:", error);
      }
    };

    fetchUploadTrends();
  }, [period]);

  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <h2>Video Upload Trends</h2>
      {/* Period selection buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button 
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            backgroundColor: period === "day" ? "#4CAF50" : "#e7e7e7",
            color: period === "day" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => setPeriod("day")}
        >
          Day
        </button>
        <button 
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            backgroundColor: period === "week" ? "#4CAF50" : "#e7e7e7",
            color: period === "week" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => setPeriod("week")}
        >
          Week
        </button>
        <button 
          style={{
            margin: "0 10px",
            padding: "10px 20px",
            backgroundColor: period === "month" ? "#4CAF50" : "#e7e7e7",
            color: period === "month" ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => setPeriod("month")}
        >
          Month
        </button>
      </div>

      {/* Line Chart */}
      <div
        style={{
          width: "50%",
          height: "500px",
          margin: "0 auto",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          backgroundColor: "white"
        }}
      >
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Upload Trends',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `${tooltipItem.label}: ${tooltipItem.raw} videos`;
                  }
                }
              }
            },
            maintainAspectRatio: false // Ensures chart adapts to the container size
          }}
        />
      </div>
    </div>
  );
};

export default VideoUploadTrend;
