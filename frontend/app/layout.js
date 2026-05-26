import Navbar from './components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#f3f4f6' }}>
        <Navbar />

        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '20px',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}