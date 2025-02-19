'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PackageStats {
  total: number;
  analyzed: number;
  upToDate: number;
  majorUpdate: number;
  outdated: number;
}

export default function IsAnalyzingComponent({
  isAnalyzing,
  packageStats,
}: {
  isAnalyzing: boolean;
  packageStats: PackageStats;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isAnalyzing && packageStats.total > 0) {
      const percentage = (packageStats.analyzed / packageStats.total) * 100;
      setProgress(percentage);
    } else {
      setProgress(0);
    }
  }, [isAnalyzing, packageStats.analyzed, packageStats.total]);

  if (!isAnalyzing) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="text-primary h-5 w-5 animate-spin" />
          Analyzing Dependencies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analyzing packages...</span>
            <span className="font-medium">
              {packageStats.analyzed} / {packageStats.total} packages
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-card flex items-center gap-2 rounded-lg border p-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Up to Date</p>
              <p className="text-2xl font-bold">{packageStats.upToDate}</p>
            </div>
          </div>

          <div className="bg-card flex items-center gap-2 rounded-lg border p-3">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Major Updates</p>
              <p className="text-2xl font-bold">{packageStats.majorUpdate}</p>
            </div>
          </div>

          <div className="bg-card flex items-center gap-2 rounded-lg border p-3">
            <XCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium">Outdated</p>
              <p className="text-2xl font-bold">{packageStats.outdated}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
