import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Rungsted Havn Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Velkommen til Rungsted Havn admin dashboard
          </p>
          <div className="space-y-2">
            <Link href="/admin/rungsted-havn" className="w-full">
              <Button className="w-full">
                Gå til Admin Dashboard
              </Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              <p>For at teste med mock data, sæt USE_MOCK=true i .env.local</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}






