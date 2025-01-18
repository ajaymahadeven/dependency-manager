'use client';

import { useEffect, useRef, useState } from 'react';
import { DiNpm } from 'react-icons/di';
import { SiComposer, SiPython } from 'react-icons/si';
import Link from 'next/link';
import { searchComposerRegistry } from '@/actions/search-engine/composer/action';
import { searchnpmRegistry } from '@/actions/search-engine/npm/actions';
import { searchPyPiRegistry } from '@/actions/search-engine/pypi/actions';
import type {
  SearchEngineResultsForNpm,
  SearchEngineResultsForPyPi,
  SearchRegistryType,
  searchSuggestions,
} from '@/types/interfaces/search-engine/types';
import { Download, Search, Star } from 'lucide-react';
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

export default function SearchEngineComponent() {
  let abortController: AbortController | null = null;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] =
    useState<SearchEngineResultsForNpm>();

  const [searchSuggestions, setSearchSuggestions] =
    useState<searchSuggestions[]>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedRegistry, setSelectedRegistry] =
    useState<SearchRegistryType>('all');
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

  const handleSearch = () => {
    setShowSuggestions(false);
    setHasSearched(true);
  };

  const handleOnValueChange = async (value: string) => {
    // Reset state if the input is empty
    if (value.length === 0) {
      setShowSuggestions(false);
      setSearchQuery('');
      setSearchSuggestions([]);
      return;
    }

    // Update the query and show suggestions
    setSearchQuery(value);
    setShowSuggestions(true);

    // Cancel any ongoing API request
    if (abortController) {
      abortController.abort();
    }

    // Create a new AbortController for the current request
    abortController = new AbortController();
    const signal = abortController.signal;

    try {
      let npmData: SearchEngineResultsForNpm[] = [];
      let composerData: SearchEngineResultsForNpm[] = [];
      let pyPiData: SearchEngineResultsForPyPi[] = [];
      if (selectedRegistry === 'npm' && value.length > 1) {
        console.log('NPM Data');
        npmData = (await searchnpmRegistry(value, { signal })) || [];
      } else if (selectedRegistry === 'composer' && value.length > 1) {
        console.log('Composer Data');
        composerData = await searchComposerRegistry(value, { signal });
      } else if (selectedRegistry === 'pypi' && value.length > 1) {
        console.log('PyPi Data');
        pyPiData = (await searchPyPiRegistry(value, { signal })) || [];
        console.log('PyPi Data', pyPiData);
      }

      if (selectedRegistry === 'all') {
        npmData = (await searchnpmRegistry(value, { signal })) || [];
        composerData = (await searchComposerRegistry(value, { signal })) || [];
        pyPiData = (await searchPyPiRegistry(value, { signal })) || [];

        const combinedData = [...composerData, ...npmData, ...pyPiData];

        // Shuffle the combinedData array - using Fisher-Yates shuffle
        for (let i = combinedData.length - 1; i > 0; i--) {
          const randomIndex = Math.floor(Math.random() * (i + 1));
          [combinedData[i], combinedData[randomIndex]] = [
            combinedData[randomIndex],
            combinedData[i],
          ];
        }

        const searchSuggestions = combinedData
          .map((result) => {
            return {
              id: result.id,
              name: result.name,
              type: result.type as SearchRegistryType,
            };
          })
          .slice(0, 10);

        setSearchSuggestions(searchSuggestions);
      } else if (selectedRegistry === 'npm') {
        const searchSuggestions = npmData.map((result) => {
          return {
            id: result.name,
            name: result.name,
            type: result.type as SearchRegistryType,
          };
        });
        setSearchSuggestions(searchSuggestions);
      } else if (selectedRegistry === 'composer') {
        const searchSuggestions = composerData.map((result) => {
          return {
            id: result.name,
            name: result.name,
            type: result.type as SearchRegistryType,
          };
        });
        setSearchSuggestions(searchSuggestions);
      } else if (selectedRegistry === 'pypi') {
        const searchSuggestions = pyPiData.map((result) => {
          return {
            id: result.name,
            name: result.name,
            type: result.type as SearchRegistryType,
          };
        });
        setSearchSuggestions(searchSuggestions);
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Request canceled');
      } else {
        console.error('Error fetching data:', error);
      }
    } finally {
      abortController = null; // Reset controller after the request
    }
  };

  console.log('Search Suggestions', searchSuggestions);
  console.log('Search Registry', selectedRegistry);

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
              onChange={(e) => handleOnValueChange(e.target.value)}
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
              {searchSuggestions?.length === 0 && (
                <div className="px-4 py-2 text-gray-400">No results found</div>
              )}
              {searchSuggestions?.map((suggestion, index) => (
                <Link
                  key={index}
                  href={
                    suggestion.type === 'npm'
                      ? `https://npmjs.com/package/${suggestion.name}`
                      : suggestion.type === 'pypi'
                        ? ` https://pypi.org/project/${suggestion.name}`
                        : suggestion.type === 'composer'
                          ? `https://packagist.org/packages/${suggestion.name}`
                          : ''
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className="space-y-2 text-wrap"
                    onClick={() => {
                      setSearchQuery(suggestion.name);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="px-4 py-2 hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span>{suggestion.name}</span>
                        {/* Add Icon Here based on type */}
                        <div className="flex items-center gap-2">
                          {suggestion.type === 'npm' && (
                            <DiNpm className="h-4 w-4 text-red-600" />
                          )}
                          {suggestion.type === 'pypi' && (
                            <SiPython className="h-4 w-4 text-yellow-400" />
                          )}
                          {suggestion.type === 'composer' && (
                            <SiComposer className="h-4 w-4 text-amber-950" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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
              onValueChange={(value: string) =>
                setSelectedRegistry(value as SearchRegistryType)
              }
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
        {/* {hasSearched && (
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
        )} */}
      </div>
    </div>
  );
}
