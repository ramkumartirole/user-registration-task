const GIFVanLoader = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#e5e7eb' // Light gray text color
    }}>
      <img
        src="/loader.gif"
        alt="Moving Van"
        style={{ width: '50%' }}
      />
      <p style={{
        fontSize: '0.875rem', // 14px (text-sm equivalent)
        color: '#9ca3af',
        marginTop: '-20px' // Slightly darker gray
      }}>
        Loading your adventure...
      </p>
    </div>
  );
};

export default GIFVanLoader;