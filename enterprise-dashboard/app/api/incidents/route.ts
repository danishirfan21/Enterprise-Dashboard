import { NextRequest } from 'next/server';

const TYPES = ['Chemical', 'Slip', 'Fire', 'Equipment', 'Other'];
const SITES = ['Plant A', 'Plant B', 'Warehouse', 'HQ'];
const STATUS = ['Open', 'Investigating', 'Closed'];
const SEVERITY = ['Low', 'Medium', 'High'];

// Deterministic mock data
const all = Array.from({ length: 237 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return {
    id: i + 1,
    date: d.toISOString().slice(0, 10),
    site: SITES[i % SITES.length],
    type: TYPES[i % TYPES.length],
    severity: SEVERITY[i % SEVERITY.length],
    status: STATUS[i % STATUS.length],
  };
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');
  const search = (searchParams.get('search') || '').toLowerCase();
  const sort = (searchParams.get('sort') ||
    'date') as keyof (typeof all)[number];
  const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

  let items = all.filter((r) => {
    const str =
      `${r.date} ${r.site} ${r.type} ${r.severity} ${r.status}`.toLowerCase();
    return !search || str.includes(search);
  });

  items.sort((a: any, b: any) => {
    const A = a[sort];
    const B = b[sort];
    if (A < B) return order === 'asc' ? -1 : 1;
    if (A > B) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return Response.json({ items: paged, total, pages });
}
