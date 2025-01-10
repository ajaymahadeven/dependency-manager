'use client';

import { useEffect, useRef, useState } from 'react';
import { DiNpm } from 'react-icons/di';
import { SiComposer, SiPython } from 'react-icons/si';
import Link from 'next/link';
import { Download, ExternalLink, Search, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function GoogleStyleSearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedRegistry, setSelectedRegistry] = useState('all');
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = [
    {
      name: 'react',
      description: 'A JavaScript library for building user interfaces',
      version: '18.2.0',
      downloads: '15M/week',
      stars: '203k',
      type: 'npm',
      url: 'https://www.npmjs.com/package/react',
    },
    {
      name: 'requests',
      description: 'Python HTTP for Humans',
      version: '2.31.0',
      downloads: '28M/month',
      stars: '49.8k',
      type: 'pypi',
      url: 'https://pypi.org/project/requests/',
    },
    {
      name: 'laravel/framework',
      description: 'The Laravel Framework',
      version: '10.28.0',
      downloads: '5M/month',
      stars: '30k',
      type: 'composer',
      url: 'https://packagist.org/packages/laravel/framework',
    },
  ];

  const handleSearch = () => {
    setShowSuggestions(false);
    setHasSearched(true);
  };

  return (
    <div className="bg-white px-4">
      <div
        className={`mx-auto max-w-2xl transition-all ${hasSearched ? 'py-6' : 'pt-6'}`}
      >
        {/* Search Bar */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search packages..."
              className="h-12 rounded-full border border-gray-200 px-6 pr-12 shadow-sm hover:shadow-md focus:shadow-md"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Search
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
              onClick={handleSearch}
            />
          </div>

          {/* Search Suggestions */}
          {showSuggestions && searchQuery && (
            <Card className="absolute z-50 mt-2 w-full rounded-2xl py-2 shadow-lg">
              <div className="space-y-2">
                <div className="px-4 py-2 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span>react components library</span>
                  </div>
                </div>
                <div className="px-4 py-2 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span>react native packages</span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {!hasSearched && (
          <div className="mt-8 flex items-center justify-center space-x-4 px-24 font-bold">
            <Button
              type="button"
              variant="secondary"
              className="h-12 w-[180px] rounded-full border border-gray-200 bg-white font-bold shadow-sm hover:shadow-md focus:shadow-md"
              onClick={handleSearch}
            >
              Search
            </Button>
            {/* Registry Select */}
            <Select
              value={selectedRegistry}
              onValueChange={setSelectedRegistry}
            >
              <SelectTrigger className="h-12 w-[180px] rounded-full border border-gray-200">
                <SelectValue defaultValue="all">
                  <div className="flex items-center gap-2">
                    {selectedRegistry === 'all' && (
                      <Search className="h-4 w-4" />
                    )}
                    {selectedRegistry === 'npm' && (
                      <DiNpm className="h-4 w-4 text-red-600" />
                    )}
                    {selectedRegistry === 'pypi' && (
                      <SiPython className="h-4 w-4 text-yellow-400" />
                    )}
                    {selectedRegistry === 'composer' && (
                      <SiComposer className="h-4 w-4 text-amber-950" />
                    )}
                    {selectedRegistry === 'all'
                      ? 'All'
                      : selectedRegistry.toUpperCase()}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    All Registries
                  </div>
                </SelectItem>
                <SelectItem value="npm">
                  <div className="flex items-center gap-2">
                    <DiNpm className="h-4 w-4 text-red-600" />
                    NPM
                  </div>
                </SelectItem>
                <SelectItem value="pypi">
                  <div className="flex items-center gap-2">
                    <SiPython className="h-4 w-4 text-yellow-400" />
                    PyPI
                  </div>
                </SelectItem>
                <SelectItem value="composer">
                  <div className="flex items-center gap-2">
                    <SiComposer className="h-4 w-4 text-amber-950" />
                    Composer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-8 space-y-6">
            <div className="text-sm text-gray-600">
              About 1,230,000 results (0.42 seconds)
            </div>
            {searchResults.map((result) => (
              <div key={`${result.type}-${result.name}`} className="space-y-1">
                <div className="flex items-center gap-2">
                  {result.type === 'npm' && (
                    <DiNpm className="h-4 w-4 text-red-600" />
                  )}
                  {result.type === 'pypi' && (
                    <SiPython className="h-4 w-4 text-yellow-400" />
                  )}
                  {result.type === 'composer' && (
                    <SiComposer className="h-4 w-4 text-amber-950" />
                  )}
                  <Link
                    href={result.url}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    {result.url}
                  </Link>
                </div>
                <Link href={result.url}>
                  <h3 className="text-xl text-blue-600 hover:underline">
                    {result.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600">{result.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Badge variant="outline">{result.version}</Badge>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {result.downloads}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {result.stars}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
