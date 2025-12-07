const ITEMS = [
  { id: "home", label: "Accueil", icon: "🏠" },
  { id: "missions", label: "Missions", icon: "🎯" },
  { id: "mini-games", label: "Mini-jeux", icon: "🎮" },
  { id: "profile", label: "Profil", icon: "🏆" }
];

export default function Navbar({ current, onChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={
              "nav-item" + (current === item.id ? " active" : "")
            }
            onClick={() => onChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
