'use client';
import Navbar from "@/components/navbar/navbar";
export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}