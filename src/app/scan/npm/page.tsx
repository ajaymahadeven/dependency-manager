'use client';

import { useState } from 'react';
import Link from 'next/link';
import { npmRegistryLookUp } from '@/actions/npm/registry/actions';
import { getRecommendedVersion } from '@/actions/npm/semver/getRecommendedVersion/actions';
import { updateStatus } from '@/actions/npm/semver/updateStatus/actions';
import { AlertCircle, Download, RefreshCw, Upload } from 'lucide-react';
import SiteNavbar from '@/components/navbar/Component';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

interface PackageVersion {
  name: string;
  current: string;
  latest: string;
  recommended: string;
  status: string;
}

interface Dependencies {
  [name: string]: string;
}

export default function PackageAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageVersion[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    await processFile(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.name !== 'package.json') {
      setError('Please upload a valid package.json file');
      return;
    }

    try {
      setIsAnalyzing(true);
      const content = await file.text();
      const json = JSON.parse(content);

      if (!json.dependencies && !json.devDependencies) {
        setError('No dependencies found in package.json');
        return;
      }

      localStorage.setItem('uploadedPackage', JSON.stringify(json));

      const analyzed = await Promise.all(
        Object.entries({
          ...(json.dependencies as Dependencies),
          ...(json.devDependencies as Dependencies),
        }).map(async ([name, version]) => {
          const current = (version as string).replace('^', '');
          console.log(`Analyzing ${name} with version ${current}`);
          const latest = await npmRegistryLookUp(name);
          let status = 'unknown';

          if (latest) {
            status = updateStatus(latest, current);
          }

          const recommended = latest
            ? getRecommendedVersion(current, latest)
            : current;

          return {
            name,
            current,
            latest: latest || 'unknown',
            recommended,
            status,
          };
        }),
      );

      setPackageData(analyzed);
    } catch (err) {
      console.error(err);
      setError(
        "Error processing package.json. Please ensure it's a valid JSON file.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadUpdatedPackage = () => {
    if (!packageData) return;

    const originalPackage = JSON.parse(
      localStorage.getItem('uploadedPackage') || '{}',
    );
    const updatedPackage = {
      ...originalPackage,
      dependencies: {
        ...originalPackage.dependencies,
        ...Object.fromEntries(
          packageData
            .filter((pkg) => originalPackage.dependencies?.[pkg.name])
            .map((pkg) => [pkg.name, `^${pkg.latest}`]),
        ),
      },
      devDependencies: {
        ...originalPackage.devDependencies,
        ...Object.fromEntries(
          packageData
            .filter((pkg) => originalPackage.devDependencies?.[pkg.name])
            .map((pkg) => [pkg.name, `^${pkg.latest}`]),
        ),
      },
    };

    const blob = new Blob([JSON.stringify(updatedPackage, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Upload package.json</CardTitle>
              <CardDescription>
                Drag and drop your package.json file or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center ${
                  isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/25'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop your package.json here or
                    <label className="mx-1 cursor-pointer text-primary hover:underline">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept="application/json"
                        onChange={handleFileInput}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Only package.json files are supported
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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

          {packageData && !isAnalyzing && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Review the recommended updates for your dependencies
                  </CardDescription>
                </div>
                <Button type="button" onClick={downloadUpdatedPackage}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Package.json (Latest)
                </Button>
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
                                  : pkg.status === 'Failed'
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
        </div>
      </div>
    </div>
  );
}
