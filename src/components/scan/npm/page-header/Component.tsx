import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PageHeaderComponent({
  error,
}: {
  error: string | null;
}) {
  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Package.json Version Analyzer
        </h1>
        <p className="text-lg text-muted-foreground">
          Analyze your package.json dependencies and get recommendations for
          version updates.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
