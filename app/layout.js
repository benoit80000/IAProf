import './globals.css';

export const metadata = {
  title: 'Prof IA CM1',
  description: 'Ton professeur virtuel pour réviser tes leçons !',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
