import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistribution, setSelectedDistribution] = useState(null);

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/upload/distributions');
      setDistributions(response.data);
    } catch (error) {
      console.error('Error fetching distributions:', error);
      toast.error('Failed to load distributions');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      toast.error('Please select a valid file (CSV, XLSX, or XLS)');
      return;
    }

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('File uploaded and distributed successfully!');
      fetchDistributions(); // Refresh the distributions list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: uploading
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewDistributionDetails = (distribution) => {
    setSelectedDistribution(distribution);
  };

  const closeDetails = () => {
    setSelectedDistribution(null);
  };

  if (loading) {
    return <div className="loading">Loading distributions...</div>;
  }

  return (
    <div className="container">
      <h1 className="mb-4">Upload & Distribute Lists</h1>

      {/* File Upload Section */}
      <div className="card mb-4">
        <h2 style={{ marginBottom: '20px' }}>Upload CSV/Excel File</h2>

        <div className="alert alert-info">
          <strong>File Format Requirements:</strong>
          <ul style={{ marginBottom: 0, marginTop: '8px', paddingLeft: '20px' }}>
            <li>Supported formats: CSV, XLSX, XLS</li>
            <li>Required columns: FirstName, Phone, Notes</li>
            <li>Maximum file size: 5MB</li>
            <li>Data will be distributed equally among active agents</li>
          </ul>
        </div>

        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
          style={{
            opacity: uploading ? 0.6 : 1,
            cursor: uploading ? 'not-allowed' : 'pointer'
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div>
              <p style={{ fontSize: '18px', color: '#666' }}>
                Uploading and distributing file...
              </p>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #007bff',
                borderRadius: '50%',
                margin: '20px auto',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : isDragActive ? (
            <p style={{ fontSize: '18px', color: '#007bff' }}>
              Drop the file here...
            </p>
          ) : (
            <div>
              <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                Drag & drop a file here, or click to select
              </p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Supported formats: CSV, XLSX, XLS
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Distributions History */}
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Distribution History</h2>

        {distributions.length === 0 ? (
          <div className="text-center" style={{ padding: '40px', color: '#666' }}>
            <p>No distributions yet. Upload a file to get started!</p>
          </div>
        ) : (
          <div className="grid">
            {distributions.map((distribution) => (
              <div key={distribution._id} className="distribution-card">
                <div className="distribution-header">
                  <h3 style={{ margin: 0 }}>{distribution.fileName}</h3>
                  <small style={{ color: '#666' }}>
                    {formatDate(distribution.createdAt)}
                  </small>
                </div>

                <div className="distribution-stats">
                  <div className="stat-item">
                    <div className="stat-number">{distribution.totalRecords}</div>
                    <div className="stat-label">Total Records</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{distribution.distributedData.length}</div>
                    <div className="stat-label">Agents</div>
                  </div>
                </div>

                <div className="agent-records">
                  {distribution.distributedData.map((agentData, index) => (
                    <div key={index} className="agent-record">
                      <span className="agent-name">{agentData.agentName}</span>
                      <span className="record-count">{agentData.records.length} records</span>
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: '16px', width: '100%' }}
                  onClick={() => viewDistributionDetails(distribution)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distribution Details Modal */}
      {selectedDistribution && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Distribution Details: {selectedDistribution.fileName}</h2>
              <button className="btn btn-secondary" onClick={closeDetails}>
                Close
              </button>
            </div>

            {selectedDistribution.distributedData.map((agentData, index) => (
              <div key={index} style={{ marginBottom: '24px' }}>
                <h3 style={{
                  backgroundColor: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '12px'
                }}>
                  {agentData.agentName} ({agentData.records.length} records)
                </h3>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Phone</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentData.records.map((record, recordIndex) => (
                        <tr key={recordIndex}>
                          <td>{record.firstName}</td>
                          <td>{record.phone}</td>
                          <td>{record.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add keyframes for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Upload;
