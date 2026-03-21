export default function RootLayout({ children }) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: "Inter" }}>
        {children}
      </body>
    </html>
  );
}
