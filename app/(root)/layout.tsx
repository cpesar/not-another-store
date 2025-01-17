export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      ROOT LAYOUT
      <main className="flex-1 wrapper">{children}</main>
    </div>
  );
}
