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
        <script src="/meeujs/Astro.js" defer></script>
        <script src="/meeujs/Astro.Coord.js" defer></script>
        <script src="/meeujs/Astro.DeltaT.js" defer></script>
        <script src="/meeujs/Astro.Globe.js" defer></script>
        <script src="/meeujs/Astro.JulianDay.js" defer></script>
        <script src="/meeujs/Astro.Math.js" defer></script>
        <script src="/meeujs/Astro.Nutation.js" defer></script>
        <script src="/meeujs/Astro.Parallax.js" defer></script>
        <script src="/meeujs/Astro.Sidereal.js" defer></script>
        <script src="/meeujs/Astro.Solar.js" defer></script> 
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>  
      </body>
    </html>
  )
}
