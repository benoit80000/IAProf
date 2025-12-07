export const metadata = {
  title: "Apprendre le CM1",
  description: "Ton professeur virtuel pour apprendre le CM1 !",
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
