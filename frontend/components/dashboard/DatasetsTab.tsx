'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

import { DatasetItem, INITIAL_DATASETS } from '@/lib/polar-data';
import { useAuthStore } from '@/store/useAuthStore';

interface DatasetsTabProps {
  selectedDataset?: DatasetItem | null;
  onCloseDetail?: () => void;
}

export function DatasetsTab({ selectedDataset: initialSelected, onCloseDetail }: DatasetsTabProps) {
  const theme = useAuthStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const isDark = theme !== 'light';
  const isAdmin = user?.role === 'admin';

  const [datasets, setDatasets] = useState<DatasetItem[]>(INITIAL_DATASETS);
  const [activeDataset, setActiveDataset] = useState<DatasetItem | null>(initialSelected || null);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New dataset form state
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('NCPOR-NEW-0250');
  const [newDomain, setNewDomain] = useState('Sea Ice');
  const [newRegion, setNewRegion] = useState('Antarctic coast');
  const [newDesc, setNewDesc] = useState('');
  const [newUrl, setNewUrl] = useState('https://doi.org/10.5067/NCPOR/NEW-0250');

  const handleDownloadMetadata = (ds: DatasetItem) => {
    const csvContent = `data:text/csv;charset=utf-8,Code,Title,Domain,Region,Status,PI,DOI,SourceURL,Format,Size,TemporalCoverage\n"${ds.code}","${ds.title}","${ds.domain}","${ds.region}","${ds.status}","${ds.pi_scientist}","${ds.doi || 'N/A'}","${ds.source_url}","${ds.format}","${ds.file_size}","${ds.temporal_coverage}"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${ds.code}_metadata.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCitation = (ds: DatasetItem) => {
    const citation = `${ds.pi_scientist} (2026). ${ds.title} [Data set]. National Centre for Polar and Ocean Research (NCPOR). ${ds.source_url || (ds.doi ? 'https://doi.org/' + ds.doi : '')}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCreateDataset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: DatasetItem = {
      id: `ds-${Date.now()}`,
      code: newCode || `NCPOR-DS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      domain: newDomain,
      region: newRegion,
      status: 'Approved',
      quality_score: '98%',
      updated_date: new Date().toISOString().split('T')[0],
      description: newDesc || 'Verified observational dataset published through NCPOR portal.',
      parameters: ['Temperature', 'Salinity', 'Density', 'Satellite Flux'],
      spatial_resolution: '1 km Grid',
      temporal_coverage: '2024-01 to 2026-08',
      format: 'NetCDF / GeoTIFF',
      file_size: '450 MB',
      pi_scientist: user?.full_name || 'NCPOR Administrator',
      doi: `10.5067/NCPOR/${newCode}`,
      source_url: newUrl || 'https://doi.org/10.5067/NCPOR/DATASET',
      downloads_count: 1,
    };

    setDatasets([created, ...datasets]);
    setShowUploadModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteDataset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this dataset from the catalogue?')) {
      setDatasets(datasets.filter((d) => d.id !== id));
      if (activeDataset?.id === id) setActiveDataset(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching Screenshot 3 + Admin Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-[#0b1721]' : 'text-white'}`}>
            Datasets
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'}`}>
            Approved and under-review NCPOR polar datasets with live repository links.
          </p>
        </div>

        {/* Admin Action Button */}
        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#008b8b] hover:bg-[#007575] text-white font-semibold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Dataset (Admin)</span>
          </button>
        )}
      </div>

      {/* 3x3 Grid of 9 Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {datasets.map((ds) => (
          <div
            key={ds.id}
            onClick={() => setActiveDataset(ds)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between select-none relative group ${
              isDark
                ? 'bg-white border-[#e5e7eb] hover:border-gray-300'
                : 'bg-[#0f2233] border-white/5 hover:border-white/20'
            }`}
          >
            <div>
              {/* Card Header: Code & Status */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium text-[#008b8b]">
                  {ds.code}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Approved</span>
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteDataset(ds.id, e)}
                      title="Admin Delete"
                      className="opacity-0 group-hover:opacity-100 p-1 text-rose-500 hover:bg-rose-500/10 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2 className={`text-sm font-bold leading-snug mb-2 ${isDark ? 'text-[#0b1721]' : 'text-white'}`}>
                {ds.title}
              </h2>

              {/* Description */}
              <p className={`text-xs leading-relaxed line-clamp-3 mb-4 ${isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'}`}>
                {ds.description}
              </p>
            </div>

            {/* Card Footer: Domain on left, Quality Percentage on right */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
              <span className={isDark ? 'text-[#5a6f82]' : 'text-[#8aa0b3]'}>
                {ds.domain} · {ds.region}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={ds.source_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[11px] text-[#008b8b] hover:underline flex items-center gap-0.5"
                  title="Open live source URL"
                >
                  <span>Live URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="font-semibold text-gray-500 dark:text-gray-400">
                  {ds.quality_score || '85%'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Detail Modal */}
      {activeDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-2xl rounded-2xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-white border-[#e5e7eb] text-[#0b1721]' : 'bg-[#0b1721] border-white/10 text-white'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-[#008b8b] bg-cyan-500/10 px-2.5 py-0.5 rounded">
                    {activeDataset.code}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Approved
                  </span>
                </div>
                <h2 className="text-lg font-bold leading-tight">
                  {activeDataset.title}
                </h2>
                <div className="text-xs text-[#008b8b] font-medium mt-1">
                  {activeDataset.domain} · {activeDataset.region}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveDataset(null);
                  if (onCloseDetail) onCloseDetail();
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs leading-relaxed mb-5 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
              {activeDataset.description}
            </p>

            {/* Metadata Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl border text-xs mb-5 ${
              isDark ? 'bg-[#f4f7f9] border-gray-200' : 'bg-[#0f2233] border-white/5'
            }`}>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#8aa0b3]">Principal Investigator</div>
                <div className="font-bold mt-0.5">{activeDataset.pi_scientist}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#8aa0b3]">Quality / Completeness</div>
                <div className="font-bold text-[#008b8b] mt-0.5">{activeDataset.quality_score}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#8aa0b3]">Temporal Coverage</div>
                <div className="font-bold mt-0.5">{activeDataset.temporal_coverage}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#8aa0b3]">Data Format</div>
                <div className="font-bold mt-0.5">{activeDataset.format}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#8aa0b3]">Package Size</div>
                <div className="font-bold mt-0.5">{activeDataset.file_size}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#8aa0b3]">Live Source Repository</div>
                <a
                  href={activeDataset.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#008b8b] hover:underline mt-0.5 flex items-center gap-1 truncate"
                >
                  <span className="truncate">{activeDataset.doi || 'Live Repository'}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>

            {/* Measured Parameters */}
            <div className="mb-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#8aa0b3] mb-2">
                Recorded Parameters & Variables
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeDataset.parameters.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-medium border border-teal-500/20"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Citation Box */}
            <div className={`p-3.5 rounded-xl border text-xs mb-5 ${
              isDark ? 'bg-gray-50 border-gray-200' : 'bg-black/30 border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-[#008b8b]">Recommended Citation</span>
                <button
                  type="button"
                  onClick={() => handleCopyCitation(activeDataset)}
                  className="flex items-center gap-1 text-[10px] text-[#008b8b] hover:underline"
                >
                  {copiedCitation ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCitation ? 'Copied!' : 'Copy Citation'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-gray-700 dark:text-gray-300 break-all">
                {activeDataset.pi_scientist} (2026). {activeDataset.title} [Data set]. NCPOR Polar Repository. {activeDataset.source_url}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={activeDataset.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#008b8b] hover:underline font-semibold"
              >
                <span>Open Original Live Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveDataset(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadMetadata(activeDataset)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#008b8b] hover:bg-[#007575] text-white font-semibold text-xs transition shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Metadata (.csv)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateDataset}
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border ${
              isDark ? 'bg-white border-[#e5e7eb] text-[#0b1721]' : 'bg-[#0b1721] border-white/10 text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#008b8b]" />
                <h3 className="font-bold text-base">Admin: Publish Polar Dataset</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Dataset Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Dataset Title</label>
                <input
                  type="text"
                  placeholder="e.g. Antarctic Fast-Ice Thickness Time-Series"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Domain</label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full h-9 px-2 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent"
                  >
                    {['Sea Ice', 'Climate', 'Oceanography', 'Glaciology', 'Biology', 'Atmospheric Science', 'Hydrography'].map(
                      (d) => (
                        <option key={d} value={d} className="text-black">
                          {d}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Region</label>
                  <input
                    type="text"
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Original Source URL / DOI</label>
                <input
                  type="url"
                  placeholder="https://doi.org/10.5067/NCPOR/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of scientific methodology and parameters..."
                  className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-gray-300 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#008b8b] hover:bg-[#007575] text-white font-semibold text-xs"
              >
                Publish to Live Catalog
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
