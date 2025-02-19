import { AlertCircle, Clock, PackageCheck, PackageX } from 'lucide-react';

export const statuses = [
  {
    status: 'up-to-date',
    icon: <PackageCheck className="h-5 w-5" />,
    title: 'Up to Date',
    description:
      'The package version matches the latest version available on the registry.',
    recommendation:
      'No action needed. Your package is using the most recent version.',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  {
    status: 'outdated',
    icon: <Clock className="h-5 w-5" />,
    title: 'Outdated',
    description: 'A new version is available for the current release tag.',
    recommendation:
      'Consider updating to the latest version to receive bug fixes and improvements.',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  {
    status: 'major-update',
    icon: <AlertCircle className="h-5 w-5" />,
    title: 'Major Updates',
    description: 'A new major version or version tag is available.',
    recommendation:
      'Proceed with caution. Major updates may include breaking changes that require code modifications.',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    status: 'failed',
    icon: <PackageX className="h-5 w-5" />,
    title: 'Failed',
    description:
      'Unable to verify package status or locate package information.',
    recommendation:
      'Check if the package exists, verify your network connection, or contact the package maintainer.',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
];
