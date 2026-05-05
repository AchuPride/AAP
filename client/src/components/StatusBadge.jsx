const STATUS_CONFIG = {
  submitted:    { label: 'Submitted',     cls: 'bg-blue-50 text-blue-700' },
  under_review: { label: 'Under Review',  cls: 'bg-yellow-50 text-yellow-700' },
  assigned:     { label: 'Assigned',      cls: 'bg-purple-50 text-purple-700' },
  investigating:{ label: 'Investigating', cls: 'bg-orange-50 text-orange-700' },
  resolved:     { label: 'Resolved',      cls: 'bg-green-50 text-green-700' },
  closed:       { label: 'Closed',        cls: 'bg-gray-100 text-gray-600' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  const textSize = size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-0.5';

  return (
    <span className={`badge font-semibold ${cfg.cls} ${textSize}`}>
      {cfg.label}
    </span>
  );
}

export { STATUS_CONFIG };
