import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function AuditLogsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  );

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {logs?.map((log) => (
            <li key={log.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    <span className="uppercase font-bold text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                      {log.action}
                    </span>
                    {log.entity_type} <span className="text-gray-500">#{log.entity_id}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Admin ID: {log.admin_user_id}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
              {/* Diff View (Simplified) */}
              <div className="mt-2 text-xs font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                 {JSON.stringify(log.after_json || log.before_json || { note: 'No data details' })}
              </div>
            </li>
          ))}
          {(!logs || logs.length === 0) && (
            <li className="p-4 text-center text-gray-500">No logs found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
