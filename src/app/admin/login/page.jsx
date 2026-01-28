'use client';

export default function AdminLoginPage() {
  async function handleSubmit(event) {
    event.preventDefault();
    const password = event.target.password.value;

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = '/admin';
    } else {
      alert('Invalid Password');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '24px', textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>
          Admin Login
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Enter Admin Password"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '16px'
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
