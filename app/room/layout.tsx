export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-75px)] bg-white overflow-hidden">
      <div className="flex flex-col max-w-6xl mx-auto pt-6">{children}</div>
    </div>
  );
}
