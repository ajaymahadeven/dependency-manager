'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState } from 'react';
import Link from 'next/link';
import type { PackageVersion } from '@/types/interfaces/scan/npm/types';
import { Download, FileText } from 'lucide-react';
import PDFReport from '@/components/pdf-export/Component';
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
  downloadUpdatedPackage,
}: {
  packageData: PackageVersion[] | null;
  isAnalyzing: boolean;
  downloadUpdatedPackage: () => void;
}) {
  const [scannedTime] = useState(new Date().toLocaleString());

  const packageStats = packageData
    ? {
        total: packageData.length,
        upToDate: packageData.filter((pkg) => pkg.status === 'up-to-date')
          .length,
        outdated: packageData.filter((pkg) => pkg.status === 'outdated').length,
        majorUpdate: packageData.filter((pkg) => pkg.status === 'major-update')
          .length,
      }
    : { total: 0, upToDate: 0, outdated: 0, majorUpdate: 0 };

  return (
    <>
      {packageData && !isAnalyzing && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Review the recommended updates for your dependencies
              </CardDescription>
            </div>
            <div className="space-x-2">
              {/* <Button type="button" onClick={downloadUpdatedPackage}>
                <Download className="mr-2 h-4 w-4" />
                Download Package.json (Latest)
              </Button> */}
              <PDFDownloadLink
                document={
                  <PDFReport
                    fileName="dependency-manager-report.pdf"
                    scannedTime={scannedTime}
                    packageData={packageData}
                    packageStats={packageStats}
                  />
                }
                fileName="package.json"
              >
                {({ blob, url, loading, error }) => (
                  <Button disabled={loading} type="button">
                    <FileText className="mr-2 h-4 w-4" />
                    {loading ? 'Generating PDF...' : 'Download PDF Report'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Current Version</TableHead>
                  <TableHead>Latest Version</TableHead>
                  <TableHead>Recommended Version</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packageData.map((pkg) => (
                  <TableRow key={pkg.name}>
                    <TableCell className="font-medium">
                      <Link
                        href={`https://www.npmjs.com/package/${pkg.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
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
                            ? 'bg-green-100 text-green-700'
                            : pkg.status === 'outdated'
                              ? 'bg-yellow-100 text-yellow-700'
                              : pkg.status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : pkg.status === 'major-update'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
