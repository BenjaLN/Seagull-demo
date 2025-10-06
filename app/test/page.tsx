export default function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">✅ Server is Working!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Next.js development server is running successfully
        </p>
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Status:</strong> All systems operational
          </div>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <strong>Admin Dashboard:</strong> 
            <a href="/admin/rungsted-havn" className="underline ml-2">
              /admin/rungsted-havn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}






