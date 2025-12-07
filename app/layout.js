import "./globals.css";

export const metadata = {
  title: "Prof IA CM1 – Refonte",
  description: "Ton professeur virtuel CM1 avec mini-jeux, missions et prof IA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
