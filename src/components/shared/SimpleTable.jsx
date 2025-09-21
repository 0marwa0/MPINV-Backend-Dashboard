export default function SimpleTable({ columns = [], rows = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-black/10 overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="text-gray-500">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold border-b border-black/10">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-4 text-gray-500" colSpan={columns.length}>
                No data
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-gray-800">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

