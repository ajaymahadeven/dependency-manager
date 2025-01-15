'use client';

import { useState } from 'react';
import { fetchPackageDetails } from '@/actions/pypi/retrievePackageDetails/actions';
import type { PackageVersion } from '@/types/interfaces/scan/pypi/types';
import SiteNavbar from '@/components/navbar/Component';
import DropUploadAreaComponent from '@/components/scan/pypi/drop-area/Component';
import IsAnalyzingComponent from '@/components/scan/pypi/is-analyzing/Component';
import PageHeaderComponent from '@/components/scan/pypi/page-header/Component';
import TableResultsComponent from '@/components/scan/pypi/table-results/Component';

export default function Page() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<PackageVersion[] | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileType, setFileType] = useState<'requirements.txt' | null>(null);

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
        <PageHeaderComponent error={error} />
        <DropUploadAreaComponent
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
          fileType={fileType}
          downloadUpdatedFile={downloadUpdatedFile}
        />
      </div>
    </div>
  );
}
