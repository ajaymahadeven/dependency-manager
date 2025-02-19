'use client';

import { useState } from 'react';
import { npmRegistryLookUp } from '@/actions/npm/registry/actions';
import { getRecommendedVersion } from '@/actions/npm/semver/getRecommendedVersion/actions';
import { updateStatus } from '@/actions/npm/semver/updateStatus/actions';
import type {
  Dependencies,
  PackageVersion,
} from '@/types/interfaces/scan/npm/types';
import IsAnalyzingComponent from '@/components/is-analyzing/Component';
import SiteNavbar from '@/components/navbar/Component';
import PageHeaderComponent from '@/components/scan/npm/page-header/Component';
import TableResultsComponent from '@/components/scan/npm/table-results/Component';
import UploadAreaComponent from '@/components/scan/npm/upload-area/Component';

export default function PackageAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageVersion[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

      const dependencies = {
        ...(json.dependencies as Dependencies),
        ...(json.devDependencies as Dependencies),
      };

      // Set total packages to analyze
      setPackageStats((prev) => ({
        ...prev,
        total: Object.keys(dependencies).length,
        analyzed: 0,
        upToDate: 0,
        majorUpdate: 0,
        outdated: 0,
      }));

      const analyzed = await Promise.all(
        Object.entries(dependencies).map(async ([name, version], index) => {
          const current = (version as string).replace('^', '');
          const latest = await npmRegistryLookUp(name);
          let status = 'unknown';

          if (latest) {
            status = updateStatus(latest, current);
            // Update stats based on status
            setPackageStats((prev) => ({
              ...prev,
              analyzed: index + 1,
              upToDate:
                status === 'up-to-date' ? prev.upToDate + 1 : prev.upToDate,
              majorUpdate:
                status === 'major-update'
                  ? prev.majorUpdate + 1
                  : prev.majorUpdate,
              outdated:
                status === 'outdated' ? prev.outdated + 1 : prev.outdated,
            }));
          }

          const recommended = latest
            ? await getRecommendedVersion(current, latest, name)
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
    const data = JSON.parse(localStorage.getItem('uploadedPackage') || '{}');
    const updatedDependencies = packageData?.reduce((acc, curr) => {
      acc[curr.name] = curr.recommended;
      return acc;
    }, {} as Dependencies);

    data.dependencies = {
      ...(data.dependencies || {}),
      ...updatedDependencies,
    };
    data.devDependencies = {
      ...(data.devDependencies || {}),
      ...updatedDependencies,
    };

    const updatedJson = JSON.stringify(data, null, 2);
    const blob = new Blob([updatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated-package.json';
    a.click();
    URL.revokeObjectURL(url);
  };

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

          <IsAnalyzingComponent
            isAnalyzing={isAnalyzing}
            packageStats={packageStats}
          />
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
