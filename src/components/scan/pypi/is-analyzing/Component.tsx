import { RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function IsAnalyzingComponent({
  isAnalyzing,
}: {
  isAnalyzing: boolean;
}) {
  return (
    <>
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <p className="text-sm">
                Analyzing dependencies and checking for vulnerabilities...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
