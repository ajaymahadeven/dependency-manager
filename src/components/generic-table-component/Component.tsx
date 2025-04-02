'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, ExternalLink, FileText } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Generic package version interface that can be extended by specific package managers
export interface BasePackageVersion {
  name: string;
  current: string;
  latest: string;
  recommended: string;
  status: 'up-to-date' | 'outdated' | 'major-update' | 'failed' | string;
}

interface TableResultsComponentProps<T extends BasePackageVersion> {
  packageData: T[] | null;
  isAnalyzing: boolean;
  packageManager: 'npm' | 'pypi' | 'composer' | string;
  fileType?: string | null;
  downloadUpdatedFile?: (type: 'latest' | 'recommended') => void;
}

export default function TableResultsComponent<T extends BasePackageVersion>({
  packageData,
  isAnalyzing,
  packageManager,
  fileType,
  downloadUpdatedFile,
}: TableResultsComponentProps<T>) {
  const [scannedTime] = useState(new Date().toLocaleString());
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const showCopyButtons = true;

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

  const copyToClipboard = (text: string, identifier: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getPackageVersionString = (
    pkg: BasePackageVersion,
    version: string,
  ) => {
    switch (packageManager) {
      case 'npm':
        return `"${pkg.name}": "${version}"`;
      case 'pypi':
        return `${pkg.name}==${version}`;
      case 'composer':
        return `"${pkg.name}": "${version}"`;
      default:
        return `${pkg.name}: ${version}`;
    }
  };

  const getPackageUrl = (pkg: BasePackageVersion) => {
    switch (packageManager) {
      case 'npm':
        return `https://www.npmjs.com/package/${pkg.name}`;
      case 'pypi':
        return `https://pypi.org/project/${pkg.name}`;
      case 'composer':
        return `https://packagist.org/packages/${pkg.name}`;
      default:
        return '#';
    }
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'up-to-date':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100';
      case 'outdated':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100';
      case 'major-update':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <>
      {packageData && !isAnalyzing && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                {fileType
                  ? `Found ${packageData.length} packages in ${fileType}`
                  : 'Review the recommended updates for your dependencies'}
              </CardDescription>
            </div>
            <div className="space-x-2">
              {downloadUpdatedFile && (
                <>
                  <Button
                    type="button"
                    onClick={() => downloadUpdatedFile('latest')}
                    variant="outline"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download Updated File (Latest)
                  </Button>
                  <Button
                    type="button"
                    onClick={() => downloadUpdatedFile('recommended')}
                    variant="outline"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download Updated File (Recommended)
                  </Button>
                </>
              )}
              <PDFDownloadLink
                document={
                  <PDFReport
                    fileName="dependency-manager-report.pdf"
                    scannedTime={scannedTime}
                    packageData={packageData}
                    packageStats={packageStats}
                  />
                }
                fileName={`dependency-report-${packageManager}.pdf`}
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
            <TooltipProvider>
              <div className="rounded-md border">
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
                            href={getPackageUrl(pkg)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary group flex items-center hover:underline"
                          >
                            {pkg.name}
                            <ExternalLink className="ml-1 h-3 w-3 opacity-70 group-hover:opacity-100" />
                          </Link>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{pkg.current}</span>
                            {showCopyButtons && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard(
                                        getPackageVersionString(
                                          pkg,
                                          pkg.current,
                                        ),
                                        `${pkg.name}-current`,
                                      )
                                    }
                                  >
                                    {copiedText === `${pkg.name}-current` ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy version string</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{pkg.latest}</span>
                            {showCopyButtons && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard(
                                        getPackageVersionString(
                                          pkg,
                                          pkg.latest,
                                        ),
                                        `${pkg.name}-latest`,
                                      )
                                    }
                                  >
                                    {copiedText === `${pkg.name}-latest` ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy version string</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{pkg.recommended}</span>
                            {showCopyButtons && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      copyToClipboard(
                                        getPackageVersionString(
                                          pkg,
                                          pkg.recommended,
                                        ),
                                        `${pkg.name}-recommended`,
                                      )
                                    }
                                  >
                                    {copiedText ===
                                    `${pkg.name}-recommended` ? (
                                      <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy version string</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusClassName(pkg.status)}`}
                          >
                            {pkg.status.replace('-', ' ')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      )}
    </>
  );
}
