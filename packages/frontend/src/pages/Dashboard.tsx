import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  token: string;
}

const Dashboard: React.FC<Props> = ({ token }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    try {
      const resp = await axios.get('/api/recommendations');
      setRecommendations(resp.data.recommendations);
    } catch (err) {
      console.error('Error fetching recommendations', err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      <h2>Dashboard</h2>
      <p>Welcome to your Commerce Dashboard!</p>
      <div>
        <h3>Recommended Products for You</h3>
        {recommendations.map((prod) => (
          <div key={prod.id} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
            <strong>{prod.title}</strong><br />
            {prod.description}<br />
            ${prod.price}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
