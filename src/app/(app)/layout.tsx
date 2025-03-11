import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f0e6ff] to-[#f8f0ff]">
      <Navbar />
      {children}
    </div>
  );
}
