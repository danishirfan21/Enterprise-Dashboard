"use client";
import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DataTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'date' | 'severity' | 'status' | 'type' | 'site'>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const qs = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    sort,
    order,
  });

  const { data, isLoading, error } = useSWR(`/api/incidents?${qs.toString()}`, fetcher);

  const toggleSort = (key: typeof sort) => {
    if (sort === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSort(key);
      setOrder('asc');
    }
    setPage(1);
  };

  if (error) return <div className="card card-pad">Failed to load</div>;

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
          {isLoading ? 'Loading...' : `Showing ${data?.items?.length || 0} of ${data?.total || 0}`}
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
              <th className="cursor-pointer" onClick={() => toggleSort('severity')}>
                Severity
              </th>
              <th className="cursor-pointer" onClick={() => toggleSort('status')}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((row: any) => (
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
          <button className="btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            Prev
          </button>
          <span className="text-sm">Page {page} / {data?.pages || 1}</span>
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
