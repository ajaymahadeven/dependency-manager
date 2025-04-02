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
import SiteNavbar from '@/components/navbar/Component';
import PageHeaderComponent from '@/components/scan/composer/page-header/Component';
import UploadAreaComponent from '@/components/scan/composer/upload-area/Component';
import TableResultsComponent from '@/components/table-results-component/Component';

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

    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const resetAnalyzer = () => {
    setPackageData(null);
    setError(null);
    setIsAnalyzing(false);
    setPackageStats({
      total: 0,
      analyzed: 0,
      upToDate: 0,
      majorUpdate: 0,
      outdated: 0,
    });
  };

  const processFile = async (file: File) => {
    if (file.name !== 'composer.json') {
      setError('Please upload a valid composer.json file');
      return;
    }

    try {
      resetAnalyzer(); // Reset state before starting a new analysis
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
      setPackageStats({
        total: filteredDependencies.length,
        analyzed: 0,
        upToDate: 0,
        majorUpdate: 0,
        outdated: 0,
      });

      const analyzed = await Promise.all(
        filteredDependencies.map(async ([name, version], index) => {
          const current = (version as string)
            .replace('^', '')
            .replace('~', '')
            .replace('*', '0')
            .split('|')[0]
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
            // Update stats based on version comparison
            setPackageStats((prev) => {
              const newStats = { ...prev, analyzed: index + 1 };

              if (status === 'up-to-date') {
                newStats.upToDate = prev.upToDate + 1;
              } else if (status === 'major-update') {
                newStats.majorUpdate = prev.majorUpdate + 1;
              } else if (status === 'outdated') {
                newStats.outdated = prev.outdated + 1;
              }

              return newStats;
            });
          } else {
            // Still increment analyzed count even if package lookup fails
            setPackageStats((prev) => ({
              ...prev,
              analyzed: prev.analyzed + 1,
            }));
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
