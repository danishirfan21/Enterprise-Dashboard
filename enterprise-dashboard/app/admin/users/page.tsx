'use client';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function UsersPage() {
  const { data, isLoading } = useSWR('/api/users', fetcher);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Users (Admin)</h2>
      <div className="card card-pad">
        {isLoading ? (
          'Loading...'
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((u: any) => (
                <tr key={u.email}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
