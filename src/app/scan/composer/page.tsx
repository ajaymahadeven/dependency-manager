'use client';

import { useState } from 'react';
import { packagistRegistryLookup } from '@/actions/composer/registry/latest-version/actions';
import { findRecommendedPackageVersion } from '@/actions/composer/registry/recommended-version/actions';
import { updateStatus } from '@/actions/npm/semver/updateStatus/actions';
import type {
  Dependencies,
  PackageVersion,
} from '@/types/interfaces/scan/composer/types';
import SiteNavbar from '@/components/navbar/Component';
import IsAnalyzingComponent from '@/components/scan/composer/is-analyzing/Component';
import PageHeaderComponent from '@/components/scan/composer/page-header/Component';
import TableResultsComponent from '@/components/scan/composer/table-results/Component';
import UploadAreaComponent from '@/components/scan/composer/upload-area/Component';

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
    if (file.name !== 'composer.json') {
      setError('Please upload a valid composer.json file');
      return;
    }

    try {
      setIsAnalyzing(true);
      const content = await file.text();
      const json = JSON.parse(content);

      if (!json.require && !json['require-dev']) {
        setError('No dependencies found in composer.json');
        return;
      }

      localStorage.setItem('uploadedPackage', JSON.stringify(json));

      const analyzed = await Promise.all(
        Object.entries({
          ...(json.require as Dependencies),
          ...(json['require-dev'] as Dependencies),
        }).map(async ([name, version]) => {
          // Skip PHP version and extensions
          if (name === 'php' || name.startsWith('ext-')) {
            return null;
          }

          // Clean version string from Composer constraints
          const current = (version as string)
            .replace('^', '')
            .replace('~', '')
            .replace('*', '0')
            .split('|')[0] // Take first version if there are multiple constraints
            .trim();

          console.log(`Analyzing ${name} with version ${current}`);
          const latest = await packagistRegistryLookup(name);
          const recommended = await findRecommendedPackageVersion(
            name,
            current,
          );
          let status = 'unknown';

          if (latest) {
            status = updateStatus(latest, current);
          }

          return {
            name,
            current,
            latest: latest || 'unknown',
            recommended,
            status,
          };
        }),
      );

      // Filter out null values (PHP and extensions)
      setPackageData(
        analyzed.filter((pkg): pkg is PackageVersion => pkg !== null),
      );
    } catch (err) {
      console.error(err);
      setError(
        "Error processing composer.json. Please ensure it's a valid JSON file.",
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
          <PageHeaderComponent error={error} />

          <UploadAreaComponent
            isDragging={isDragging}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleFileInput={handleFileInput}
          />

          <IsAnalyzingComponent isAnalyzing={isAnalyzing} />

          <TableResultsComponent
            packageData={packageData}
            isAnalyzing={isAnalyzing}
            downloadUpdatedPackage={downloadUpdatedPackage}
          />
        </div>
      </div>
    </div>
  );
}
