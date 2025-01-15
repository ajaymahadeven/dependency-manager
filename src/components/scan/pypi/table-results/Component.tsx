import Link from 'next/link';
import type { PackageVersion } from '@/types/interfaces/scan/pypi/types';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TableResultsComponent({
  packageData,
  isAnalyzing,
  fileType,
  downloadUpdatedFile,
}: {
  packageData: PackageVersion[] | null;
  isAnalyzing: boolean;
  fileType: string | null;
  downloadUpdatedFile: (type: 'latest' | 'recommended') => void;
}) {
  return (
    <>
      {packageData && !isAnalyzing && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Found {packageData.length} packages in {fileType}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => downloadUpdatedFile('latest')}
              >
                <Download className="mr-2 h-4 w-4" />
                Latest Versions
              </Button>
              <Button
                type="button"
                onClick={() => downloadUpdatedFile('recommended')}
              >
                <Download className="mr-2 h-4 w-4" />
                Recommended Versions
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Latest</TableHead>
                    <TableHead>Recommended</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packageData.map((pkg) => (
                    <TableRow key={pkg.name}>
                      <TableCell className="font-medium">
                        <Link
                          href={`https://pypi.org/project/${pkg.name}`}
                          target="_blank"
                        >
                          {pkg.name}
                        </Link>
                      </TableCell>
                      <TableCell>{pkg.current}</TableCell>
                      <TableCell>{pkg.latest}</TableCell>
                      <TableCell>{pkg.recommended}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            pkg.status === 'up-to-date'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                              : pkg.status === 'outdated'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                          }`}
                        >
                          {pkg.status.replace('-', ' ')}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
