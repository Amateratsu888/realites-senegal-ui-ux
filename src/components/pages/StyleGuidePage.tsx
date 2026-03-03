import React from 'react';
import { 
  ArrowLeft, ArrowRight, ArrowUpCircle, ArrowDownCircle,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Menu, X, Plus, Edit, Trash2, Eye, MoreVertical,
  Send, Download, Upload, Search, Filter, SlidersHorizontal, Save,
  Phone, Mail, MessageSquare, MessageCircle, Video,
  Building2, Home, Store, MapPin, Navigation,
  Bed, Bath, Maximize, DoorClosed, Layers, Mountain, Car, ParkingSquare,
  CheckCircle, CheckCircle2, XCircle, AlertCircle, Info, Clock, Star, Sparkles,
  TrendingUp, DollarSign, CreditCard, Euro, Receipt, Tag,
  User, UserCircle, Users, UserPlus, UserMinus, UserCheck, Crown,
  FileText, FolderOpen, Paperclip, Image as ImageIcon,
  Calendar, LogIn, LogOut, LayoutGrid, Table, ExternalLink,
  HandshakeIcon, ShieldCheck, Target, Award, Heart, Shield, Check
} from 'lucide-react';
import { Button } from '../Button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface StyleGuidePageProps {
  onNavigate: (page: string) => void;
}

export function StyleGuidePage({ onNavigate }: StyleGuidePageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-600 hover:text-primary-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </button>
          <h1 className="!text-slate-900">Guide de Style - RÉALITÉS SÉNÉGAL</h1>
          <p className="text-slate-600 mt-2">
            Documentation complète du design system et des composants UI
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Colors Section */}
        <section>
          <h2 className="mb-6">Palette de couleurs</h2>
          
          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="mb-4">Couleur primaire (Rouge)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-primary-50 rounded-lg border border-slate-200"></div>
                <p className="text-sm">primary-50</p>
                <code className="text-xs text-slate-500">#FEF2F2</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary-100 rounded-lg"></div>
                <p className="text-sm">primary-100</p>
                <code className="text-xs text-slate-500">#FEE2E2</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary-600 rounded-lg"></div>
                <p className="text-sm text-white">primary-600</p>
                <code className="text-xs text-slate-500">#DC2626</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary-700 rounded-lg"></div>
                <p className="text-sm text-white">primary-700</p>
                <code className="text-xs text-slate-500">#B91C1C</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary-800 rounded-lg"></div>
                <p className="text-sm text-white">primary-800</p>
                <code className="text-xs text-slate-500">#991B1B</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary-900 rounded-lg"></div>
                <p className="text-sm text-white">primary-900</p>
                <code className="text-xs text-slate-500">#7F1D1D</code>
              </div>
            </div>
          </div>

          {/* Slate Colors */}
          <div className="mb-8">
            <h3 className="mb-4">Couleurs neutres (Slate)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-slate-50 rounded-lg border border-slate-200"></div>
                <p className="text-sm">slate-50</p>
                <code className="text-xs text-slate-500">#F8FAFC</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-slate-100 rounded-lg"></div>
                <p className="text-sm">slate-100</p>
                <code className="text-xs text-slate-500">#F1F5F9</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-slate-200 rounded-lg"></div>
                <p className="text-sm">slate-200</p>
                <code className="text-xs text-slate-500">#E2E8F0</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-slate-600 rounded-lg"></div>
                <p className="text-sm text-white">slate-600</p>
                <code className="text-xs text-slate-500">#475569</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-slate-700 rounded-lg"></div>
                <p className="text-sm text-white">slate-700</p>
                <code className="text-xs text-slate-500">#334155</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-slate-900 rounded-lg"></div>
                <p className="text-sm text-white">slate-900</p>
                <code className="text-xs text-slate-500">#0F172A</code>
              </div>
            </div>
          </div>

          {/* Gold VIP Colors */}
          <div className="mb-8">
            <h3 className="mb-4">Couleurs VIP (Gold)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-gold-50 rounded-lg border border-slate-200"></div>
                <p className="text-sm">gold-50</p>
                <code className="text-xs text-slate-500">#FFFBEB</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-gold-100 rounded-lg"></div>
                <p className="text-sm">gold-100</p>
                <code className="text-xs text-slate-500">#FEF3C7</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-gold-300 rounded-lg"></div>
                <p className="text-sm">gold-300</p>
                <code className="text-xs text-slate-500">#FCD34D</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-gold-500 rounded-lg"></div>
                <p className="text-sm">gold-500</p>
                <code className="text-xs text-slate-500">#F4C430</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-gold-600 rounded-lg"></div>
                <p className="text-sm">gold-600</p>
                <code className="text-xs text-slate-500">#E5B000</code>
              </div>
            </div>
          </div>

          {/* Sand Colors */}
          <div className="mb-8">
            <h3 className="mb-4">Couleurs secondaires (Sand)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-sand-100 rounded-lg border border-slate-200"></div>
                <p className="text-sm">sand-100</p>
                <code className="text-xs text-slate-500">#F5F1E8</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-sand-200 rounded-lg"></div>
                <p className="text-sm">sand-200</p>
                <code className="text-xs text-slate-500">#E8DCC8</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-sand-500 rounded-lg"></div>
                <p className="text-sm text-white">sand-500</p>
                <code className="text-xs text-slate-500">#C9B38C</code>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-sand-600 rounded-lg"></div>
                <p className="text-sm text-white">sand-600</p>
                <code className="text-xs text-slate-500">#B39968</code>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="mb-6">Typographie</h2>
          
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Hiérarchie des titres</h3>
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-4">
                <h1 className="mb-2">Titre H1 - Playfair Display</h1>
                <code className="text-sm text-slate-500">font-size: 2.5rem (40px) | font-weight: 700 | line-height: 1.2</code>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h2 className="mb-2">Titre H2 - Playfair Display</h2>
                <code className="text-sm text-slate-500">font-size: 2rem (32px) | font-weight: 600 | line-height: 1.3</code>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h3 className="mb-2">Titre H3 - Playfair Display</h3>
                <code className="text-sm text-slate-500">font-size: 1.5rem (24px) | font-weight: 600 | line-height: 1.4</code>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h4 className="mb-2">Titre H4 - Playfair Display</h4>
                <code className="text-sm text-slate-500">font-size: 1.25rem (20px) | font-weight: 600 | line-height: 1.4</code>
              </div>
              <div className="border-b border-slate-200 pb-4">
                <h5 className="mb-2">Titre H5 - Playfair Display</h5>
                <code className="text-sm text-slate-500">font-size: 1.125rem (18px) | font-weight: 600 | line-height: 1.4</code>
              </div>
              <div>
                <p className="mb-2">Paragraphe - Inter</p>
                <code className="text-sm text-slate-500">font-size: 1rem (16px) | font-weight: 400 | line-height: 1.6</code>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Styles de texte</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-slate-900">Texte par défaut</p>
                <code className="text-sm text-slate-500">text-slate-900</code>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-slate-600">Texte secondaire</p>
                <code className="text-sm text-slate-500">text-slate-600</code>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-primary-600">Texte primaire (rouge)</p>
                <code className="text-sm text-slate-500">text-primary-600</code>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p className="text-sm">Petit texte</p>
                <code className="text-sm text-slate-500">text-sm (14px)</code>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs">Très petit texte</p>
                <code className="text-sm text-slate-500">text-xs (12px)</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Spacing Section */}
        <section>
          <h2 className="mb-6">Espacements</h2>
          
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Échelle d'espacement Tailwind</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">0.25rem (4px)</p>
                  <code className="text-xs text-slate-500">spacing-1</code>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">0.5rem (8px)</p>
                  <code className="text-xs text-slate-500">spacing-2</code>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">0.75rem (12px)</p>
                  <code className="text-xs text-slate-500">spacing-3</code>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">1rem (16px)</p>
                  <code className="text-xs text-slate-500">spacing-4</code>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">1.5rem (24px)</p>
                  <code className="text-xs text-slate-500">spacing-6</code>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">2rem (32px)</p>
                  <code className="text-xs text-slate-500">spacing-8</code>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">3rem (48px)</p>
                  <code className="text-xs text-slate-500">spacing-12</code>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-primary-600"></div>
                <div>
                  <p className="text-sm">4rem (64px)</p>
                  <code className="text-xs text-slate-500">spacing-16</code>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Padding des composants</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p>Card padding</p>
                <code className="text-sm text-slate-500">p-6 (1.5rem / 24px)</code>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p>Section padding vertical</p>
                <code className="text-sm text-slate-500">py-16 (4rem / 64px)</code>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p>Container padding horizontal</p>
                <code className="text-sm text-slate-500">px-4 sm:px-6 lg:px-8</code>
              </div>
              <div className="flex items-center justify-between">
                <p>Button padding</p>
                <code className="text-sm text-slate-500">px-6 py-3</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="mb-6">Boutons</h2>
          
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Variants de boutons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="default">Default Button</Button>
                <code className="text-sm text-slate-500">variant="default" | rounded (4px)</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="secondary">Secondary Button</Button>
                <code className="text-sm text-slate-500">variant="secondary" | rounded (4px)</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="outline">Outline Button</Button>
                <code className="text-sm text-slate-500">variant="outline" | rounded (4px)</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="ghost">Ghost Button</Button>
                <code className="text-sm text-slate-500">variant="ghost" | rounded (4px)</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="destructive">Destructive Button</Button>
                <code className="text-sm text-slate-500">variant="destructive" | rounded (4px)</code>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Tailles de boutons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small Button</Button>
                <code className="text-sm text-slate-500">size="sm" | px-4 py-2 text-sm</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="md">Medium Button</Button>
                <code className="text-sm text-slate-500">size="md" | px-6 py-3 text-base</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg">Large Button</Button>
                <code className="text-sm text-slate-500">size="lg" | px-8 py-4 text-lg</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="mb-6">Badges</h2>
          
          <Card className="p-6">
            <h3 className="mb-4">Variants de badges</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="default">Default Badge</Badge>
                <code className="text-sm text-slate-500">variant="default" | bg-primary-600</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary">Secondary Badge</Badge>
                <code className="text-sm text-slate-500">variant="secondary" | bg-slate-100</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="outline">Outline Badge</Badge>
                <code className="text-sm text-slate-500">variant="outline" | border-slate-200</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="destructive">Destructive Badge</Badge>
                <code className="text-sm text-slate-500">variant="destructive" | bg-red-500</code>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="gold">
                  <Crown className="w-3 h-3" />
                  VIP Badge
                </Badge>
                <code className="text-sm text-slate-500">variant="gold" | gradient gold</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="mb-6">Cartes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-3">Carte de base</h3>
              <p className="text-slate-600 mb-4">
                Une carte avec un padding de 1.5rem et un border-radius de 0.75rem.
              </p>
              <code className="text-sm text-slate-500">
                bg-white | rounded-xl | shadow-md | p-6
              </code>
            </Card>

            <Card className="p-6 border-2 border-primary-600">
              <h3 className="mb-3">Carte avec bordure primaire</h3>
              <p className="text-slate-600 mb-4">
                Utilisée pour mettre en évidence un élément important.
              </p>
              <code className="text-sm text-slate-500">
                border-2 | border-primary-600
              </code>
            </Card>
          </div>
        </section>

        {/* Border Radius Section */}
        <section>
          <h2 className="mb-6">Border Radius</h2>
          
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 rounded-sm"></div>
                <p className="text-sm">rounded-sm</p>
                <code className="text-xs text-slate-500">0.125rem (2px)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 rounded"></div>
                <p className="text-sm">rounded</p>
                <code className="text-xs text-slate-500">0.25rem (4px)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 rounded-md"></div>
                <p className="text-sm">rounded-md</p>
                <code className="text-xs text-slate-500">0.375rem (6px)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 rounded-lg"></div>
                <p className="text-sm">rounded-lg</p>
                <code className="text-xs text-slate-500">0.5rem (8px)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 rounded-xl"></div>
                <p className="text-sm">rounded-xl</p>
                <code className="text-xs text-slate-500">0.75rem (12px)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 rounded-2xl"></div>
                <p className="text-sm">rounded-2xl</p>
                <code className="text-xs text-slate-500">1rem (16px)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-200 rounded-full"></div>
                <p className="text-sm">rounded-full</p>
                <code className="text-xs text-slate-500">9999px</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Shadows Section */}
        <section>
          <h2 className="mb-6">Ombres</h2>
          
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="h-20 bg-white shadow-sm rounded-lg flex items-center justify-center">
                  <p className="text-sm">shadow-sm</p>
                </div>
                <code className="text-xs text-slate-500 block">0 1px 2px rgba(0, 0, 0, 0.05)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-white shadow-md rounded-lg flex items-center justify-center">
                  <p className="text-sm">shadow-md</p>
                </div>
                <code className="text-xs text-slate-500 block">0 4px 6px rgba(0, 0, 0, 0.1)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-white shadow-lg rounded-lg flex items-center justify-center">
                  <p className="text-sm">shadow-lg</p>
                </div>
                <code className="text-xs text-slate-500 block">0 10px 15px rgba(0, 0, 0, 0.1)</code>
              </div>
              <div className="space-y-3">
                <div className="h-20 bg-white shadow-xl rounded-lg flex items-center justify-center">
                  <p className="text-sm">shadow-xl</p>
                </div>
                <code className="text-xs text-slate-500 block">0 20px 25px rgba(0, 0, 0, 0.15)</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Icons Section */}
        <section>
          <h2 className="mb-6">Icônes (Lucide React)</h2>
          
          <Card className="p-6 mb-6">
            <h3 className="mb-6">Bibliothèque complète d'icônes utilisées</h3>
            
            {/* Navigation Icons */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Navigation & Flèches</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ArrowLeft</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ArrowRight</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ArrowUpCircle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ArrowUpCircle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ArrowDownCircle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ArrowDownCircle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ChevronLeft className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ChevronLeft</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ChevronRight</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ChevronDown className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ChevronDown</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ChevronUp className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ChevronUp</span>
                </div>
              </div>
            </div>

            {/* UI Actions */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Actions UI</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Menu className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Menu</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <X className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">X</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Plus className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Plus</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Edit className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Edit</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Trash2 className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Trash2</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Eye className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Eye</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">MoreVertical</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Search className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Search</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Filter className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Filter</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <SlidersHorizontal className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">SlidersHorizontal</span>
                </div>
              </div>
            </div>

            {/* File Actions */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Fichiers & Documents</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Send className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Send</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Download className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Download</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Upload className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Upload</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Save className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Save</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <FileText className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">FileText</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">FolderOpen</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Paperclip className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Paperclip</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Image</span>
                </div>
              </div>
            </div>

            {/* Communication */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Communication</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Phone</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Mail</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">MessageSquare</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">MessageCircle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Video className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Video</span>
                </div>
              </div>
            </div>

            {/* Real Estate */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Immobilier</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Building2</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Home className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Home</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Store className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Store</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">MapPin</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Navigation className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Navigation</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Bed className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Bed</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Bath className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Bath</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Maximize className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Maximize</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <DoorClosed className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">DoorClosed</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Layers className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Layers</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mountain className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Mountain</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Car className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Car</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ParkingSquare className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ParkingSquare</span>
                </div>
              </div>
            </div>

            {/* Status & Feedback */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Status & Feedback</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Check className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Check</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">CheckCircle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">CheckCircle2</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">XCircle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">AlertCircle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Info className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Info</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Clock</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Star className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Star</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Sparkles</span>
                </div>
              </div>
            </div>

            {/* Finance */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Finance</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">TrendingUp</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">DollarSign</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">CreditCard</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Euro className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Euro</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Receipt className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Receipt</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Tag className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Tag</span>
                </div>
              </div>
            </div>

            {/* Users & VIP */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Utilisateurs & VIP</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <User className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">User</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <UserCircle className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">UserCircle</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Users className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Users</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <UserPlus className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">UserPlus</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <UserMinus className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">UserMinus</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">UserCheck</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Crown className="w-5 h-5 text-gold-500 flex-shrink-0" />
                  <span className="text-sm">Crown (VIP)</span>
                </div>
              </div>
            </div>

            {/* Calendar & Auth */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Calendrier & Authentification</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Calendar</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <LogIn className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">LogIn</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <LogOut className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">LogOut</span>
                </div>
              </div>
            </div>

            {/* Layout & Views */}
            <div className="mb-8">
              <h4 className="mb-4 text-primary-600">Mise en page & Vues</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <LayoutGrid className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">LayoutGrid</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Table className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Table</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ExternalLink</span>
                </div>
              </div>
            </div>

            {/* Brand & Values */}
            <div>
              <h4 className="mb-4 text-primary-600">Marque & Valeurs</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <HandshakeIcon className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Handshake</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">ShieldCheck</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Target className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Target</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Award className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Award</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Heart className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Heart</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Shield className="w-5 h-5 text-slate-700 flex-shrink-0" />
                  <span className="text-sm">Shield</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 mt-6">
            <h3 className="mb-4">Tailles d'icônes standards</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Check className="w-4 h-4 text-primary-600" />
                <code className="text-sm text-slate-500">w-4 h-4 (16px) - Petite</code>
              </div>
              <div className="flex items-center gap-4">
                <Info className="w-5 h-5 text-primary-600" />
                <code className="text-sm text-slate-500">w-5 h-5 (20px) - Moyenne</code>
              </div>
              <div className="flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-primary-600" />
                <code className="text-sm text-slate-500">w-6 h-6 (24px) - Grande</code>
              </div>
              <div className="flex items-center gap-4">
                <Crown className="w-8 h-8 text-gold-500" />
                <code className="text-sm text-slate-500">w-8 h-8 (32px) - Extra grande</code>
              </div>
            </div>
          </Card>
        </section>

        {/* Grid System Section */}
        <section>
          <h2 className="mb-6">Système de grille</h2>
          
          <Card className="p-6">
            <h3 className="mb-4">Grid responsive</h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-600 mb-3">1 colonne sur mobile, 2 sur tablette, 3 sur desktop</p>
                <code className="text-sm text-slate-500">grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6</code>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-20 bg-slate-200 rounded-lg"></div>
                <div className="h-20 bg-slate-200 rounded-lg"></div>
                <div className="h-20 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
          </Card>
        </section>

        {/* Breakpoints Section */}
        <section>
          <h2 className="mb-6">Points de rupture (Breakpoints)</h2>
          
          <Card className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p>sm (mobile)</p>
                <code className="text-sm text-slate-500">640px</code>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p>md (tablette)</p>
                <code className="text-sm text-slate-500">768px</code>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <p>lg (desktop)</p>
                <code className="text-sm text-slate-500">1024px</code>
              </div>
              <div className="flex items-center justify-between">
                <p>xl (large desktop)</p>
                <code className="text-sm text-slate-500">1280px</code>
              </div>
            </div>
          </Card>
        </section>

      </div>
    </div>
  );
}