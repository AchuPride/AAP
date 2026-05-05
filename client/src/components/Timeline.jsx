import { format } from 'date-fns';
import StatusBadge from './StatusBadge';
import { HiCheckCircle, HiUserAdd, HiDocumentAdd, HiAnnotation } from 'react-icons/hi';

const ICON_MAP = {
  status_change:  <HiCheckCircle  className="w-5 h-5 text-primary" />,
  assignment:     <HiUserAdd      className="w-5 h-5 text-purple-500" />,
  evidence_added: <HiDocumentAdd  className="w-5 h-5 text-calm" />,
  note:           <HiAnnotation   className="w-5 h-5 text-warm" />,
};

export default function Timeline({ updates = [], showNotes = false }) {
  if (!updates.length) {
    return <p className="text-sm text-gray-400 italic">No updates yet.</p>;
  }

  return (
    <ol className="relative border-l-2 border-primary/20 ml-3 space-y-6">
      {updates.map((u, i) => (
        <li key={i} className="ml-6">
          <span className="absolute -left-[1.1rem] flex items-center justify-center w-8 h-8 bg-white border-2 border-primary/20 rounded-full">
            {ICON_MAP[u.update_type] || ICON_MAP.note}
          </span>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {u.new_status && <StatusBadge status={u.new_status} />}
              {u.updated_by_name && (
                <span className="text-xs text-gray-400">by {u.updated_by_name}</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {format(new Date(u.created_at), 'dd MMM yyyy, HH:mm')}
              </span>
            </div>

            {u.public_message && (
              <p className="text-sm text-gray-700 mt-1">{u.public_message}</p>
            )}

            {showNotes && u.note && (
              <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                <p className="text-xs font-medium text-yellow-700 mb-0.5">Internal Note</p>
                <p className="text-sm text-yellow-900">{u.note}</p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
