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
      <head>
        <script src="/meeujs/Astro.js"></script>
        <script src="/meeujs/Astro.Coord.js"></script>
        <script src="/meeujs/Astro.DeltaT.js"></script>
        <script src="/meeujs/Astro.Globe.js"></script>
        <script src="/meeujs/Astro.JulianDay.js"></script>
        <script src="/meeujs/Astro.Math.js"></script>
        <script src="/meeujs/Astro.Nutation.js"></script>
        <script src="/meeujs/Astro.Parallax.js"></script>
        <script src="/meeujs/Astro.Sidereal.js"></script>
        <script src="/meeujs/Astro.Solar.js"></script> 
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>  
      </body>
    </html>
  )
}
