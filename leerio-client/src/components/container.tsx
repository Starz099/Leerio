export const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex w-screen justify-center">
      <div className="container mx-auto max-w-5xl">{children}</div>
    </div>
  );
};
