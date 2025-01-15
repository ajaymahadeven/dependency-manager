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
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <p>Analyzing package.json and checking for updates...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
