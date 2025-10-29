"use client";
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DataTable() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data, error, isLoading } = useSWR(
    `/api/incidents?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(
      search
    )}`,
    fetcher
  );

  if (error) return <div className="card card-pad">Failed to load</div>;
  return (
    <div>
      <div className="flex gap-2 items-center mb-3">
        <input
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="text-sm text-slate-400">Page {page}</div>
      </div>

      <div className="card card-pad">
        {isLoading ? (
          'Loading...'
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th className="w-16">ID</th>
                  <th>Date</th>
                  <th>Site</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.length ? (
                  data.items.map((r: any) => (
                    <tr key={r.id}>
                      <td className="mono">{r.id}</td>
                      <td>{r.date}</td>
                      <td>{r.site}</td>
                      <td>{r.type}</td>
                      <td>{r.severity}</td>
                      <td>{r.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-slate-400 py-6 text-center">
                      No incidents
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Showing {data?.items?.length || 0} of {data?.total || 0}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <button
                  className="btn"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (data?.pages || 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
'use client';
import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<
    'date' | 'severity' | 'status' | 'type' | 'site'
  >('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sort,
    order,
  });
  const { data, isLoading } = useSWR(
    `/api/incidents?${qs.toString()}`,
    fetcher
  );

  const toggleSort = (key: any) => {
    if (sort === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSort(key);
      setOrder('asc');
    }
  };

  return (
    <div className="card card-pad">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
        <input
          placeholder="Filter incidents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="text-xs text-slate-400">
          {isLoading
            ? 'Loading...'
            : `Showing ${data?.items.length || 0} of ${data?.total || 0}`}
        </div>
      </div>
      <div className="overflow-auto">
        <table>
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => toggleSort('date')}>
                Date
              </th>
              <th className="cursor-pointer" onClick={() => toggleSort('site')}>
                Site
              </th>
              <th className="cursor-pointer" onClick={() => toggleSort('type')}>
                Type
              </th>
              <th
                className="cursor-pointer"
                onClick={() => toggleSort('severity')}
              >
                Severity
              </th>
              <th
                className="cursor-pointer"
                onClick={() => toggleSort('status')}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((row: any) => (
              <tr key={row.id}>
                <td>{row.date}</td>
                <td>{row.site}</td>
                <td>{row.type}</td>
                <td>{row.severity}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} / {data?.pages || 1}
          </span>
          <button
            className="btn"
            onClick={() => setPage(Math.min(data?.pages || 1, page + 1))}
            disabled={page === data?.pages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
