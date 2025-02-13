import { ArrowUpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { statuses } from '@/data/docs/package-status/data';

export default function PackageStatusInfoComponent() {
  return (
    <>
      <div className="flex min-h-full items-center justify-center">
        <div className="container mx-auto max-w-4xl p-6">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">
              Package Status Information
            </h1>
            <p className="text-muted-foreground">
              Understanding the different status indicators in the package
              dependency scanner
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {statuses.map((item) => (
              <Card key={item.status} className="relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 h-full w-2 ${item.bgColor}`}
                />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className={`${item.textColor}`}>{item.icon}</span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {item.title}
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.bgColor} ${item.textColor}`}
                        >
                          {item.status}
                        </span>
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <h3 className="mb-1 font-semibold">Description</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Recommendation</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/50 mt-8 rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <ArrowUpCircle className="text-muted-foreground h-5 w-5" />
              <h2 className="font-semibold">Pro Tip</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Regular package updates are important for security and
              performance, but always review changelogs and test updates in a
              development environment before applying them to production.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
