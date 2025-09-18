import "./TileAction.css";

export default function TileAction({ title, icon, color, onClick }) {
  return (
    <div
      className={`tile-card bg-gradient-to-br ${color}`}
      onClick={onClick}
    >
      <div className="tile-icon">{icon}</div>
      <div className="tile-title">{title}</div>
    </div>
  );
}
