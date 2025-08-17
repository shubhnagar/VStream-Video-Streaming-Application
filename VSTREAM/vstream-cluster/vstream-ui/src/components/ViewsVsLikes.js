import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { getViewVsLikes } from "../http/VideoServiceUrls";

const ViewsVsLikes = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(getViewVsLikes())
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the JSON response
      })
      .then(responseData => {
        // Assuming responseData is an array of objects with 'views' and 'likes'
        const views = responseData.map(item => item.views);
        const likes = responseData.map(item => item.likes);

        console.log(views);
        console.log(likes);

        setData({
          datasets: [{
            label: 'Views vs Likes',
            data: views.map((view, index) => ({ x: view, y: likes[index] })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        });
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  // Inline styles
  const chartContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    backgroundColor: '#f8f9fa', // Light background for contrast
  };

  const chartBoxStyle = {
    width: '60%', // Width of the box containing the chart
    height: '60%', // Height of the box containing the chart
    backgroundColor: '#ffffff', // White background
    border: '1px solid #ced4da', // Light gray border
    borderRadius: '10px', // Rounded corners
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    padding: '20px', // Inner padding
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'View Count' // Label for the x-axis
        }
      },
      y: {
        title: {
          display: true,
          text: 'Like Count' // Label for the y-axis
        },
        beginAtZero: true // Ensures that the y-axis starts from 0
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            // Format the tooltip label as needed
            return `${tooltipItem.raw} likes`;
          }
        }
      }
    }
  };

  return (
    <div style={chartContainerStyle}>
      <div style={chartBoxStyle}>
        {data ? <Scatter data={data} options={options} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default ViewsVsLikes;
