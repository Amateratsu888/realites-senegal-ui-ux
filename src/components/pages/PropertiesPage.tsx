import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { PropertyCard } from '../PropertyCard';
import { properties } from '../../data/mockData';
import { Property, PropertyType } from '../../types';
import { Button } from '../Button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from '../ui/pagination';

interface PropertiesPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
  initialFilter?: PropertyType;
}

const ITEMS_PER_PAGE = 12;

export function PropertiesPage({ onNavigate, initialFilter }: PropertiesPageProps) {
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>(initialFilter || 'all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (initialFilter) {
      setSelectedType(initialFilter);
    }
  }, [initialFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, priceRange, location]);

  const filteredProperties = properties.filter((property) => {
    // Exclure les biens VIP exclusifs sur le site web public
    if (property.vipOnly) return false;
    
    if (selectedType !== 'all' && property.type !== selectedType) return false;
    
    if (priceRange !== 'all') {
      const price = property.price;
      if (priceRange === 'low' && price > 100000000) return false;
      if (priceRange === 'mid' && (price <= 100000000 || price > 300000000)) return false;
      if (priceRange === 'high' && price <= 300000000) return false;
    }
    
    if (location !== 'all' && !property.location.includes(location)) return false;
    
    return true;
  });

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2">Nos biens disponibles</h2>
          <p className="text-slate-600">
            Explorez notre catalogue complet de propriétés d'exception
          </p>
        </div>

        {/* Filter Toggle Button */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm mb-2 text-slate-700">Type de bien</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as PropertyType | 'all')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="all">Tous les types</option>
                  <option value="villa">Villas</option>
                  <option value="appartement">Appartements</option>
                  <option value="terrain">Terrains</option>
                  <option value="espace-commercial">Espaces commerciaux</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-slate-700">Fourchette de prix</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="all">Tous les prix</option>
                  <option value="low">Moins de 100M FCFA</option>
                  <option value="mid">100M - 300M FCFA</option>
                  <option value="high">Plus de 300M FCFA</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-slate-700">Localisation</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="all">Toutes les localisations</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Saly">Saly</option>
                  <option value="Mbour">Mbour</option>
                  <option value="Pointe">Pointe Sarène</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            {(selectedType !== 'all' || priceRange !== 'all' || location !== 'all') && (
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedType('all');
                    setPriceRange('all');
                    setLocation('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={() => onNavigate('property-detail', property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="mb-2 text-slate-600">Aucun bien trouvé</h3>
            <p className="text-slate-500 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={() => {
              setSelectedType('all');
              setPriceRange('all');
              setLocation('all');
            }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst
                  onClick={() => currentPage > 1 && setCurrentPage(1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                
                // Calculate which pages to show: always show at least 5 pages when possible
                const delta = 2; // Show 2 pages before and after current page
                const rangeStart = Math.max(2, currentPage - delta);
                const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
                
                // Always show first page
                if (pageNumber === 1) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis after first page if there's a gap
                if (pageNumber === 2 && rangeStart > 2) {
                  return (
                    <PaginationItem key={`ellipsis-start`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                // Show pages in range
                if (pageNumber >= rangeStart && pageNumber <= rangeEnd) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis before last page if there's a gap
                if (pageNumber === totalPages - 1 && rangeEnd < totalPages - 1) {
                  return (
                    <PaginationItem key={`ellipsis-end`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                // Always show last page
                if (pageNumber === totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLast
                  onClick={() => currentPage < totalPages && setCurrentPage(totalPages)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}