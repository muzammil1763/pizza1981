'use client'

import { useSession } from 'next-auth/react'

export default function TestSessionPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Status:</p>
            <p className="bg-gray-100 p-2 rounded">{status}</p>
          </div>

          <div>
            <p className="font-semibold">Session Data:</p>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div>
            <p className="font-semibold">User Role:</p>
            <p className="bg-gray-100 p-2 rounded">{session?.user?.role || 'No role'}</p>
          </div>

          <div>
            <p className="font-semibold">Is Admin:</p>
            <p className="bg-gray-100 p-2 rounded">{session?.user?.isAdmin ? 'YES' : 'NO'}</p>
          </div>

          <div>
            <p className="font-semibold">Check (role === 'ADMIN'):</p>
            <p className="bg-gray-100 p-2 rounded">{session?.user?.role === 'ADMIN' ? 'TRUE' : 'FALSE'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
