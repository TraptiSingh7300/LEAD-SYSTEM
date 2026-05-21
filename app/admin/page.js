
'use client';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to download system metrics.');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleResetSpecific = async (providerId, providerName) => {
    if (!confirm(`Reset quota back to 10 for ${providerName} only?`)) return;
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId })
      });
      if (res.ok) {
        fetchStats(); 
      } else {
        alert("Failed to reset provider.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleResetGlobal = async () => {
    if (!confirm("Wipe ALL lead history logs and restore ALL provider quotas to 10?")) return;
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      if (res.ok) {
        alert("Entire system refreshed successfully!");
        fetchStats();
      } else {
        alert("Failed to reset system balances.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif', color: '#666' }}>Loading System Analytics...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>Error: {error}</div>;

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto', color: '#333' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eaeaea', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fafafa' }}>Lead System Operations Room</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Live monitoring dashboard — Refreshes automatically</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={handleResetGlobal}
            style={{ padding: '8px 16px', background: '#374151', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Reset All System Quotas
          </button>
          <span style={{ padding: '8px 16px', background: '#e0f2fe', color: '#0369a1', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>● System Active</span>
        </div>
      </header>

      {}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Total Processed Leads</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#0070f3' }}>{stats.totalLeads}</p>
        </div>
        <div style={{ padding: '20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Active Providers</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.totalProviders}</p>
        </div>
        <div style={{ padding: '20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Capped Providers (Quota 0)</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: stats.depletedProviders > 0 ? '#ef4444' : '#6b7280' }}>{stats.depletedProviders}</p>
        </div>
      </section>

      {}
      <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
        <h2 style={{ padding: '20px', margin: 0, background: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '18px' }}>Provider Registry & Distribution Status</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 20px', color: '#4b5563', fontSize: '14px' }}>ID</th>
                <th style={{ padding: '12px 20px', color: '#4b5563', fontSize: '14px' }}>Provider Name</th>
                <th style={{ padding: '12px 20px', color: '#4b5563', fontSize: '14px' }}>Registered Services</th>
                <th style={{ padding: '12px 20px', color: '#4b5563', fontSize: '14px' }}>Remaining Quota</th>
                <th style={{ padding: '12px 20px', color: '#4b5563', fontSize: '14px' }}>Leads Received</th>
                <th style={{ padding: '12px 20px', color: '#4b5563', fontSize: '14px' }}>Last Assigned Stamp</th>
                <th style={{ padding: '12px 20px', color: '#4b5563', fontSize: '14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.providers.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#6b7280' }}>{p.id}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 'bold', color: '#111' }}>{p.name}</td>
                  <td style={{ padding: '16px 20px' }}>
                    {p.services.map(s => (
                      <span key={s} style={{ display: 'inline-block', padding: '3px 8px', background: '#f3f4f6', borderRadius: '4px', fontSize: '12px', marginRight: '5px', color: '#4b5563' }}>{s}</span>
                    ))}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: p.remainingQuota === 0 ? '#ef4444' : '#111' }}>{p.remainingQuota} / 10</strong>
                      <div style={{ width: '80px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.remainingQuota * 10}%`, height: '100%', background: p.remainingQuota === 0 ? '#ef4444' : p.remainingQuota <= 3 ? '#f59e0b' : '#10b981' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#059669', fontWeight: 'bold' }}>{p.leadsReceivedCount}</td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: p.lastAssignedAt ? '#333' : '#9ca3af' }}>
                    {p.lastAssignedAt ? new Date(p.lastAssignedAt).toLocaleTimeString() : 'Never'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => handleResetSpecific(p.id, p.name)}
                      style={{ padding: '5px 10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
