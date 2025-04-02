'use client';

import { useState } from 'react';
import { fetchPackageDetails } from '@/actions/pypi/retrievePackageDetails/actions';
import type { PackageVersion } from '@/types/interfaces/scan/pypi/types';
import AnalyzingComponent from '@/components/analyzing-component/Component';
import TableResultsComponent from '@/components/generic-table-component/Component';
import SiteNavbar from '@/components/navbar/Component';
import PageHeaderComponent from '@/components/scan/pypi/page-header/Component';
import UploadAreaComponent from '@/components/scan/pypi/upload-area/Component';

export default function Page() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageVersion[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileType, setFileType] = useState<'requirements.txt' | null>(null);
  const [hasAnalysed, setHasAnalysed] = useState(false);

  const [packageStats, setPackageStats] = useState({
    total: 0,
    analyzed: 0,
    upToDate: 0,
    majorUpdate: 0,
    outdated: 0,
  });

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
    const validFiles = ['requirements.txt'];
    if (!validFiles.includes(file.name)) {
      setError(
        'Please upload a valid Python dependency file (requirements.txt)',
      );
      return;
    }

    if (file.size > 1024 * 1024) {
      setError('File size exceeds 1MB limit');
      return;
    }

    setFileType(file.name as typeof fileType);

    try {
      setHasAnalysed(false);
      setIsAnalyzing(true);
      const content = await file.text();

      const packages = content
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => {
          const [name, current] = line.split('==');
          return { name: name?.trim(), current: current?.trim() };
        })
        .filter((pkg) => pkg.name && pkg.current);

      // Reset and set initial package stats
      setPackageStats({
        total: packages.length,
        analyzed: 0,
        upToDate: 0,
        majorUpdate: 0,
        outdated: 0,
      });

      const analyzed: PackageVersion[] = [];

      for (const [index, pkg] of packages.entries()) {
        const packageData = await fetchPackageDetails(pkg.name, pkg.current);

        if (typeof packageData !== 'string') {
          analyzed.push(packageData);

          // Update stats based on version comparison
          setPackageStats((prev) => {
            const newStats = { ...prev, analyzed: index + 1 };

            if (packageData.status === 'up-to-date') {
              newStats.upToDate = prev.upToDate + 1;
            } else if (packageData.status === 'major-update') {
              newStats.majorUpdate = prev.majorUpdate + 1;
            } else if (packageData.status === 'outdated') {
              newStats.outdated = prev.outdated + 1;
            }

            return newStats;
          });
        } else {
          console.error(`Failed to analyze package: ${pkg.name}`);
          // Still increment analyzed count even if package analysis fails
          setPackageStats((prev) => ({ ...prev, analyzed: prev.analyzed + 1 }));
        }
      }

      setHasAnalysed(true);
      setPackageData(analyzed);
    } catch (err) {
      console.error(err);
      setError('Error processing file. Please check the file format.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  //   const downloadUpdatedFile = (versionType: 'recommended' | 'latest') => {
  //     if (!packageData || !fileType) return;

  //     let content = '';

  //     if (fileType === 'requirements.txt') {
  //       content = packageData
  //         .map(
  //           (pkg) =>
  //             `${pkg.name}==${versionType === 'latest' ? pkg.latest : pkg.recommended}`,
  //         )
  //         .join('\n');
  //     } else if (fileType === 'setup.py') {
  //       content = `from setuptools import setup, find_packages

  // setup(
  //     name="your-package",
  //     version="1.0.0",
  //     packages=find_packages(),
  //     install_requires=[
  //         ${packageData
  //           .map(
  //             (pkg) =>
  //               `"${pkg.name}==${versionType === 'latest' ? pkg.latest : pkg.recommended}"`,
  //           )
  //           .join(',\n        ')}
  //     ],
  // )`;
  //     } else {
  //       content = `[project]
  // name = "your-package"
  // version = "1.0.0"
  // dependencies = [
  //     ${packageData
  //       .map(
  //         (pkg) =>
  //           `"${pkg.name}==${versionType === 'latest' ? pkg.latest : pkg.recommended}"`,
  //       )
  //       .join(',\n    ')}
  // ]`;
  //     }

  //     const blob = new Blob([content], { type: 'text/plain' });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${fileType}-${versionType}`;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   };

  return (
    <div className="bg-background min-h-screen">
      <SiteNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <PageHeaderComponent error={error} />
          {isAnalyzing ? null : (
            <UploadAreaComponent
              isDragging={isDragging}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileInput={handleFileInput}
            />
          )}

          <AnalyzingComponent
            isAnalyzing={isAnalyzing}
            packageStats={packageStats}
            hasAnalysed={hasAnalysed}
          />
          <TableResultsComponent
            packageData={packageData}
            isAnalyzing={isAnalyzing}
            fileType={fileType}
            packageManager="pypi"
          />
        </div>
      </div>
    </div>
  );
}
