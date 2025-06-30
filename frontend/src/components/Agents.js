import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/agents');
      setAgents(response.data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      if (editingAgent) {
        // Update existing agent
        await axios.put(`/api/agents/${editingAgent._id}`, {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile
        });
        toast.success('Agent updated successfully');
      } else {
        // Create new agent
        await axios.post('/api/agents', formData);
        toast.success('Agent created successfully');
      }

      setFormData({ name: '', email: '', mobile: '', password: '' });
      setShowForm(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save agent';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      password: '' // Don't pre-fill password for security
    });
    setShowForm(true);
  };

  const handleDelete = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axios.delete(`/api/agents/${agentId}`);
        toast.success('Agent deleted successfully');
        fetchAgents();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete agent';
        toast.error(errorMessage);
      }
    }
  };

  const toggleAgentStatus = async (agentId, currentStatus) => {
    try {
      await axios.put(`/api/agents/${agentId}`, {
        isActive: !currentStatus
      });
      toast.success(`Agent ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchAgents();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update agent status';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', mobile: '', password: '' });
    setShowForm(false);
    setEditingAgent(null);
  };

  if (loading) {
    return <div className="loading">Loading agents...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Agents Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Agent'}
        </button>
      </div>

      {/* Add/Edit Agent Form */}
      {showForm && (
        <div className="card mb-4">
          <h2>{editingAgent ? 'Edit Agent' : 'Add New Agent'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter agent name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number with country code"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editingAgent ? "Leave empty to keep current password" : "Enter password (min 6 characters)"}
                  required={!editingAgent}
                  minLength="6"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-success">
                {editingAgent ? 'Update Agent' : 'Create Agent'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Agents List */}
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Agents List ({agents.length})</h2>

        {agents.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: '#666' }}>
            <p>No agents found. Add your first agent to get started!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.mobile}</td>
                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: agent.isActive ? '#28a745' : '#dc3545',
                          color: 'white'
                        }}
                      >
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleEdit(agent)}
                        >
                          Edit
                        </button>
                        <button
                          className={`btn ${agent.isActive ? 'btn-secondary' : 'btn-success'}`}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => toggleAgentStatus(agent._id, agent.isActive)}
                        >
                          {agent.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleDelete(agent._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;
