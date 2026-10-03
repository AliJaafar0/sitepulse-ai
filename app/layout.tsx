import './globals.css';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'SitePulse AI — Website Health Monitor',description:'Deep website health monitoring, analytics and AI recommendations.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
