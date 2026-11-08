import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Account overview skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-32 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>

      {/* Password skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-64 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-36" />
        </CardContent>
      </Card>

      {/* Subscription skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-56 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20 mt-1" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone skeleton */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <div>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-56 mt-1" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
