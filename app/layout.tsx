import './globals.scss'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from '../lib/AntdRegistry';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Spaze Tracker',
  description: 'Track The SpaZe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>  
      </body>
    </html>
  )
}
