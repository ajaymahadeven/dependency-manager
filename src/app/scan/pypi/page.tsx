'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchPackageDetails } from '@/actions/pypi/retrievePackageDetails/actions';
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

export interface PackageVersion {
  name: string;
  current: string;
  latest: string;
  recommended: string;
  status: 'up-to-date' | 'outdated' | 'major-update';
}

export default function Page() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageVersion[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileType, setFileType] = useState<
    'requirements.txt' | 'setup.py' | 'pyproject.toml' | null
  >(null);

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
    const validFiles = ['requirements.txt', 'setup.py', 'pyproject.toml'];
    if (!validFiles.includes(file.name)) {
      setError(
        'Please upload a valid Python dependency file (requirements.txt, setup.py, or pyproject.toml)',
      );
      return;
    }

    if (file.size > 1024 * 1024) {
      setError('File size exceeds 1MB limit');
      return;
    }

    setFileType(file.name as typeof fileType);

    try {
      setIsAnalyzing(true);
      const content = await file.text();

      // Assuming `content` is a newline-separated list of `name==version`
      const packages = content
        .split('\n')
        .filter((line) => line.trim() !== '') // Remove empty lines or whitespace-only lines
        .map((line) => {
          const [name, current] = line.split('==');
          return { name, current };
        })
        .filter((pkg) => pkg.name && pkg.current);

      const analyzed: PackageVersion[] = [];

      for (const pkg of packages) {
        const packageData = await fetchPackageDetails(pkg.name, pkg.current);
        if (typeof packageData !== 'string') {
          analyzed.push(packageData);
        } else {
          console.error(`Failed to analyze package: ${pkg.name}`);
        }
      }

      setPackageData(analyzed);
    } catch (err) {
      console.error(err);
      setError('Error processing file. Please check the file format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadUpdatedFile = (versionType: 'recommended' | 'latest') => {
    if (!packageData || !fileType) return;

    let content = '';

    if (fileType === 'requirements.txt') {
      content = packageData
        .map(
          (pkg) =>
            `${pkg.name}==${versionType === 'latest' ? pkg.latest : pkg.recommended}`,
        )
        .join('\n');
    } else if (fileType === 'setup.py') {
      content = `from setuptools import setup, find_packages

setup(
    name="your-package",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        ${packageData
          .map(
            (pkg) =>
              `"${pkg.name}==${versionType === 'latest' ? pkg.latest : pkg.recommended}"`,
          )
          .join(',\n        ')}
    ],
)`;
    } else {
      content = `[project]
name = "your-package"
version = "1.0.0"
dependencies = [
    ${packageData
      .map(
        (pkg) =>
          `"${pkg.name}==${versionType === 'latest' ? pkg.latest : pkg.recommended}"`,
      )
      .join(',\n    ')}
]`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileType}-${versionType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Requirements.txt Version Analyzer
            </h1>
            <p className="text-lg text-muted-foreground">
              Analyze your requirement.txt dependencies and get recommendations
              for version updates.
            </p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle>Upload Python Dependencies</CardTitle>
            <CardDescription>Drop your requirements.txt here</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
              <label className="cursor-pointer text-center text-sm transition-colors hover:text-primary">
                <span className="text-primary">Choose a file</span>
                <span className="text-muted-foreground"> or drag it here</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".txt,.py,.toml"
                  onChange={handleFileInput}
                />
              </label>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
