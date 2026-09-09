/** Small indeterminate spinner for in-button loading states. See globals.css. */
export function M3Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Chargement"
      className={`m3-circular-progress ${className ?? ""}`}
    >
      <span className="m3-cp-progress">
        <span className="m3-cp-spinner">
          <span className="m3-cp-left">
            <span className="m3-cp-circle" />
          </span>
          <span className="m3-cp-right">
            <span className="m3-cp-circle" />
          </span>
        </span>
      </span>
    </span>
  );
}
