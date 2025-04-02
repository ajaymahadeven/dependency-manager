'use client';

import { useState } from 'react';
import { packagistRegistryLookup } from '@/actions/composer/registry/latest-version/actions';
import { findRecommendedPackageVersion } from '@/actions/composer/registry/recommended-version/actions';
import { updateStatus } from '@/actions/npm/semver/updateStatus/actions';
import type {
  Dependencies,
  PackageVersion,
} from '@/types/interfaces/scan/composer/types';
import AnalyzingComponent from '@/components/analyzing-component/Component';
import TableResultsComponent from '@/components/generic-table-component/Component';
import SiteNavbar from '@/components/navbar/Component';
import PageHeaderComponent from '@/components/scan/composer/page-header/Component';
import UploadAreaComponent from '@/components/scan/composer/upload-area/Component';

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

    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const processFile = async (file: File) => {
    if (file.name !== 'composer.json') {
      setError('Please upload a valid composer.json file');
      return;
    }

    try {
      setHasAnalysed(false);
      setIsAnalyzing(true);
      const content = await file.text();
      const json = JSON.parse(content);

      if (!json.require && !json['require-dev']) {
        setError('No dependencies found in composer.json');
        setIsAnalyzing(false);
        return;
      }

      localStorage.setItem('uploadedPackage', JSON.stringify(json));

      const dependencies = {
        ...(json.require as Dependencies),
        ...(json['require-dev'] as Dependencies),
      };

      // Filter out PHP and extensions before setting total
      const filteredDependencies = Object.entries(dependencies).filter(
        ([name]) => name !== 'php' && !name.startsWith('ext-'),
      );

      // Set initial package stats
      const totalPackages = filteredDependencies.length;
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

      for (const [index, [name, version]] of filteredDependencies.entries()) {
        const current = (version as string)
          .replace('^', '')
          .replace('~', '')
          .replace('*', '0')
          .split('|')[0]
          .trim();

        console.log(`Analyzing ${name} with version ${current}`);
        const latest = await packagistRegistryLookup(name);
        const recommended = await findRecommendedPackageVersion(name, current);
        let status = 'unknown';

        if (latest) {
          status = updateStatus(latest, current);

          // Update counts based on status
          if (status === 'up-to-date') upToDateCount++;
          if (status === 'major-update') majorUpdateCount++;
          if (status === 'outdated') outdatedCount++;
        }

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
        "Error processing composer.json. Please ensure it's a valid JSON file.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const genericPackageData = packageData
    ? packageData.map((pkg) => ({ ...pkg, recommended: pkg.recommended || '' }))
    : null;

  console.log('Generic', genericPackageData);

  return (
    <div className="bg-background min-h-screen">
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

          <AnalyzingComponent
            isAnalyzing={isAnalyzing}
            packageStats={packageStats}
            hasAnalysed={hasAnalysed}
          />

          <TableResultsComponent
            packageData={genericPackageData}
            isAnalyzing={isAnalyzing}
            packageManager="composer"
          />
        </div>
      </div>
    </div>
  );
}
