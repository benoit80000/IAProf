export const metadata = {
  title: 'Prof IA CM1',
  description: 'Ton professeur virtuel pour réviser tes leçons !',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
