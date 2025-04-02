'use client';

import { useState } from 'react';
import { npmRegistryLookUp } from '@/actions/npm/registry/actions';
import { getRecommendedVersion } from '@/actions/npm/semver/getRecommendedVersion/actions';
import { updateStatus } from '@/actions/npm/semver/updateStatus/actions';
import type {
  Dependencies,
  PackageVersion,
} from '@/types/interfaces/scan/npm/types';
import AnalyzingComponent from '@/components/analyzing-component/Component';
import TableResultsComponent from '@/components/generic-table-component/Component';
import SiteNavbar from '@/components/navbar/Component';
import PageHeaderComponent from '@/components/scan/npm/page-header/Component';
import UploadAreaComponent from '@/components/scan/npm/upload-area/Component';

export default function PackageAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageVersion[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    if (file.name !== 'package.json') {
      setError('Please upload a valid package.json file');
      return;
    }

    try {
      setHasAnalysed(false);
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

      // Reset stats before analysis
      const totalPackages = Object.keys(dependencies).length;
      setPackageStats({
        total: totalPackages,
        analyzed: 0,
        upToDate: 0,
        majorUpdate: 0,
        outdated: 0,
      });

      // Process packages sequentially to avoid race conditions
      const analyzed: PackageVersion[] = [];
      let upToDateCount = 0;
      let majorUpdateCount = 0;
      let outdatedCount = 0;

      for (const [index, [name, version]] of Object.entries(
        dependencies,
      ).entries()) {
        const current = (version as string).replace('^', '');
        const latest = await npmRegistryLookUp(name);
        let status = 'unknown';

        if (latest) {
          status = updateStatus(latest, current);

          // Update counts based on status
          if (status === 'up-to-date') upToDateCount++;
          if (status === 'major-update') majorUpdateCount++;
          if (status === 'outdated') outdatedCount++;
        }

        const recommended = latest
          ? await getRecommendedVersion(current, latest, name)
          : current;

        analyzed.push({
          name,
          current,
          latest: latest || 'unknown',
          recommended,
          status,
        });

        // Update stats after each package is analyzed
        setPackageStats({
          total: totalPackages,
          analyzed: index + 1,
          upToDate: upToDateCount,
          majorUpdate: majorUpdateCount,
          outdated: outdatedCount,
        });
      }

      setHasAnalysed(true);
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

  // const downloadUpdatedPackage = () => {
  //   const data = JSON.parse(localStorage.getItem('uploadedPackage') || '{}');
  //   const updatedDependencies = packageData?.reduce((acc, curr) => {
  //     acc[curr.name] = curr.recommended;
  //     return acc;
  //   }, {} as Dependencies);

  //   data.dependencies = {
  //     ...(data.dependencies || {}),
  //     ...updatedDependencies,
  //   };
  //   data.devDependencies = {
  //     ...(data.devDependencies || {}),
  //     ...updatedDependencies,
  //   };

  //   const updatedJson = JSON.stringify(data, null, 2);
  //   const blob = new Blob([updatedJson], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'updated-package.json';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  console.log('Package Status', packageStats);

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
            packageManager="npm"
          />
        </div>
      </div>
    </div>
  );
}
