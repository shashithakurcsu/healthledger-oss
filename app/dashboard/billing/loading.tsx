import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function BillingLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Current plan skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-56 mt-1" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 mt-1" />
              </div>
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>

      {/* Pricing plans skeleton */}
      <div>
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <div className="space-y-1 mt-2">
                  <div className="flex items-baseline gap-1">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="flex items-start gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
