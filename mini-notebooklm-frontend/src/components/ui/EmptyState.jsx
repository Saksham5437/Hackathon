export default function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="emptyState">
      {Icon && <Icon size={28} />}
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
