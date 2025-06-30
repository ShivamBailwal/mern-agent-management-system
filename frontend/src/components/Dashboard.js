import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalDistributions: 0,
    totalRecordsProcessed: 0
  });
  const [recentDistributions, setRecentDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch agents
      const agentsResponse = await axios.get('/api/agents');
      const agents = agentsResponse.data;

      // Fetch distributions
      const distributionsResponse = await axios.get('/api/upload/distributions');
      const distributions = distributionsResponse.data;

      // Calculate stats
      const totalAgents = agents.length;
      const activeAgents = agents.filter(agent => agent.isActive).length;
      const totalDistributions = distributions.length;
      const totalRecordsProcessed = distributions.reduce((sum, dist) => sum + dist.totalRecords, 0);

      setStats({
        totalAgents,
        activeAgents,
        totalDistributions,
        totalRecordsProcessed
      });

      // Get recent distributions (last 5)
      setRecentDistributions(distributions.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <h1 className="mb-4">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="stat-item">
            <div className="stat-number">{stats.totalAgents}</div>
            <div className="stat-label">Total Agents</div>
          </div>
        </div>

        <div className="card">
          <div className="stat-item">
            <div className="stat-number">{stats.activeAgents}</div>
            <div className="stat-label">Active Agents</div>
          </div>
        </div>

        <div className="card">
          <div className="stat-item">
            <div className="stat-number">{stats.totalDistributions}</div>
            <div className="stat-label">Total Distributions</div>
          </div>
        </div>

        <div className="card">
          <div className="stat-item">
            <div className="stat-number">{stats.totalRecordsProcessed}</div>
            <div className="stat-label">Records Processed</div>
          </div>
        </div>
      </div>

      {/* Recent Distributions */}
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Recent Distributions</h2>

        {recentDistributions.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: '#666' }}>
            <p>No distributions yet. Upload a CSV file to get started!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Total Records</th>
                  <th>Agents</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDistributions.map((distribution) => (
                  <tr key={distribution._id}>
                    <td>{distribution.fileName}</td>
                    <td>{distribution.totalRecords}</td>
                    <td>{distribution.distributedData.length}</td>
                    <td>{formatDate(distribution.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card mt-4">
        <h2 style={{ marginBottom: '20px' }}>Quick Actions</h2>
        <div className="grid grid-2">
          <a href="/agents" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Manage Agents
          </a>
          <a href="/upload" className="btn btn-success" style={{ textDecoration: 'none' }}>
            Upload & Distribute
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
