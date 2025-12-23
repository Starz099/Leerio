export const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
};
