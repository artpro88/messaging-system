import './globals.css'

export const metadata = {
  title: 'Messaging System',
  description: 'Omnichannel customer messaging platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

