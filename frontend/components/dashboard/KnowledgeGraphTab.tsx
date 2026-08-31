'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Compass,
  Database,
  ExternalLink,
  FlaskConical,
  Info,
  Maximize2,
  Minimize2,
  Network,
  Radio,
  RotateCcw,
  Search,
  Ship,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'scientist' | 'station' | 'dataset' | 'expedition' | 'publication';
  categoryLabel: string;
  x: number;
  y: number;
  color: string;
  strokeColor: string;
  icon: string;
  details: string;
  organization?: string;
  stats?: { label: string; value: string }[];
  targetTab?: string;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  // Scientists
  {
    id: 'sci-meloth',
    label: 'Dr. Thamban Meloth',
    type: 'scientist',
    categoryLabel: 'Lead Scientist',
    x: 460,
    y: 270,
    color: '#0284c7',
    strokeColor: '#38bdf8',
    icon: 'TM',
    details: 'Director of NCPOR and pioneering researcher in polar ice cores, paleoclimate reconstructions, and Himalayan cryosphere monitoring.',
    organization: 'NCPOR Goa',
    stats: [
      { label: 'Publications', value: '94' },
      { label: 'Expeditions', value: '7' },
      { label: 'H-Index', value: '34' },
    ],
    targetTab: 'scientists',
  },
  {
    id: 'sci-mohan',
    label: 'Dr. Rahul Mohan',
    type: 'scientist',
    categoryLabel: 'Group Director',
    x: 640,
    y: 200,
    color: '#8b5cf6',
    strokeColor: '#c084fc',
    icon: 'RM',
    details: 'Group Director (Polar Ocean Sciences) specializing in Southern Ocean micropaleontology, coccolithophores, and fjord biogeochemistry.',
    organization: 'NCPOR Polar Biology Division',
    stats: [
      { label: 'Publications', value: '82' },
      { label: 'Expeditions', value: '5' },
    ],
    targetTab: 'scientists',
  },
  {
    id: 'sci-srivastava',
    label: 'Dr. Rohit Srivastava',
    type: 'scientist',
    categoryLabel: 'Senior Scientist',
    x: 280,
    y: 190,
    color: '#0d9488',
    strokeColor: '#2dd4bf',
    icon: 'RS',
    details: 'Specialist in satellite microwave remote sensing of polar sea ice, altimetry, snow-ice thermodynamics, and Antarctic fast ice kinematics.',
    organization: 'NCPOR Cryosphere Wing',
    stats: [
      { label: 'Publications', value: '46' },
      { label: 'Datasets', value: '12' },
    ],
    targetTab: 'scientists',
  },

  // Research Stations
  {
    id: 'st-maitri',
    label: 'Maitri Station',
    type: 'station',
    categoryLabel: 'Antarctic Base',
    x: 320,
    y: 390,
    color: '#10b981',
    strokeColor: '#6ee7b7',
    icon: 'MT',
    details: 'India’s permanent Antarctic research station located in Schirmacher Oasis (70°45′S). Operational year-round since 1989.',
    organization: 'East Antarctica',
    stats: [
      { label: 'Temp', value: '-18.4°C' },
      { label: 'Sensors', value: '38' },
    ],
    targetTab: 'stations',
  },
  {
    id: 'st-bharati',
    label: 'Bharati Station',
    type: 'station',
    categoryLabel: 'Antarctic Base',
    x: 610,
    y: 380,
    color: '#10b981',
    strokeColor: '#6ee7b7',
    icon: 'BH',
    details: 'State-of-the-art permanent Antarctic station in Larsemann Hills (69°24′S) constructed with 134 modular prefabricated containers.',
    organization: 'Larsemann Hills',
    stats: [
      { label: 'Temp', value: '-14.2°C' },
      { label: 'Sensors', value: '52' },
    ],
    targetTab: 'stations',
  },
  {
    id: 'st-himadri',
    label: 'Himadri Station',
    type: 'station',
    categoryLabel: 'Arctic Base',
    x: 480,
    y: 90,
    color: '#06b6d4',
    strokeColor: '#67e8f9',
    icon: 'HM',
    details: 'India’s premier Arctic research station in Ny-Ålesund, Svalbard (79°N), the northernmost permanently inhabited research outpost in the world.',
    organization: 'Svalbard, Norway',
    stats: [
      { label: 'Temp', value: '4.8°C' },
      { label: 'Sensors', value: '29' },
    ],
    targetTab: 'stations',
  },
  {
    id: 'st-indarc',
    label: 'IndARC Mooring',
    type: 'station',
    categoryLabel: 'Subsea Observatory',
    x: 750,
    y: 110,
    color: '#06b6d4',
    strokeColor: '#67e8f9',
    icon: 'IA',
    details: 'Underwater moored observatory deployed 192m deep in Kongsfjorden fjord to monitor Arctic warming and teleconnections with Indian monsoons.',
    organization: 'Kongsfjorden Fjord',
    stats: [
      { label: 'Depth', value: '192 m' },
      { label: 'Sensors', value: '16' },
    ],
    targetTab: 'stations',
  },

  // Datasets
  {
    id: 'ds-clm',
    label: 'NCPOR-CLM-0094',
    type: 'dataset',
    categoryLabel: 'Climate Dataset',
    x: 170,
    y: 280,
    color: '#f59e0b',
    strokeColor: '#fcd34d',
    icon: 'DS',
    details: 'High-resolution surface air temperature and ERA5 reanalysis timeseries with AWS calibration across Antarctic Peninsula.',
    organization: 'Antarctic Peninsula',
    stats: [
      { label: 'Points', value: '890k' },
      { label: 'Quality', value: '91%' },
    ],
    targetTab: 'datasets',
  },
  {
    id: 'ds-bio',
    label: 'NCPOR-BIO-0073',
    type: 'dataset',
    categoryLabel: 'Biology Dataset',
    x: 790,
    y: 310,
    color: '#f59e0b',
    strokeColor: '#fcd34d',
    icon: 'DS',
    details: 'Antarctic coastal phytoplankton biomass, HPLC pigments, and microplankton community survey along Indian Antarctic sector.',
    organization: 'Southern Ocean',
    stats: [
      { label: 'Points', value: '14.2k' },
      { label: 'Quality', value: '69%' },
    ],
    targetTab: 'datasets',
  },
  {
    id: 'ds-si',
    label: 'NCPOR-SI-0228',
    type: 'dataset',
    categoryLabel: 'Sea Ice Dataset',
    x: 190,
    y: 110,
    color: '#f59e0b',
    strokeColor: '#fcd34d',
    icon: 'DS',
    details: 'Ross Sea polynya open water extent, thin ice thickness, and heat flux exchange estimates derived from microwave radiometers.',
    organization: 'Ross Sea',
    stats: [
      { label: 'Points', value: '450k' },
      { label: 'Quality', value: '96%' },
    ],
    targetTab: 'datasets',
  },

  // Expeditions
  {
    id: 'exp-44',
    label: '44th ISEA Expedition',
    type: 'expedition',
    categoryLabel: 'Active Mission',
    x: 470,
    y: 470,
    color: '#ec4899',
    strokeColor: '#f472b6',
    icon: 'EX',
    details: 'The 44th Indian Scientific Expedition to Antarctica deployed aboard MV Vasiliy Golovnin conducting Maitri-II site surveys and Prydz Bay oceanography.',
    organization: 'MV Vasiliy Golovnin',
    stats: [
      { label: 'Scientists', value: '48' },
      { label: 'Status', value: 'Active' },
    ],
    targetTab: 'expeditions',
  },
  {
    id: 'exp-soe',
    label: '13th Southern Ocean Cruise',
    type: 'expedition',
    categoryLabel: 'Ocean Expedition',
    x: 760,
    y: 450,
    color: '#ec4899',
    strokeColor: '#f472b6',
    icon: 'EX',
    details: 'Full hydrographic transect from Cape Town to Prydz Bay sampling iron fertilization and atmospheric turbulence.',
    organization: 'ORV Sagar Nidhi',
    stats: [
      { label: 'Participants', value: '32' },
      { label: 'Datasets', value: '7' },
    ],
    targetTab: 'expeditions',
  },

  // Publications
  {
    id: 'pub-sam',
    label: 'Decadal SAM Teleconnections',
    type: 'publication',
    categoryLabel: 'Peer-Reviewed Paper',
    x: 230,
    y: 460,
    color: '#6366f1',
    strokeColor: '#a5b4fc',
    icon: 'PB',
    details: 'Four decades of Indian Antarctic research: insights into Southern Ocean and climate teleconnections (Polar Science Reviews, 2024).',
    organization: 'Polar Science Reviews',
    stats: [
      { label: 'Citations', value: '28' },
      { label: 'Year', value: '2024' },
    ],
    targetTab: 'publications',
  },
  {
    id: 'pub-arctic',
    label: 'Atlantic Water Warming in Kongsfjorden',
    type: 'publication',
    categoryLabel: 'Peer-Reviewed Paper',
    x: 650,
    y: 60,
    color: '#6366f1',
    strokeColor: '#a5b4fc',
    icon: 'PB',
    details: 'Long-term timeseries from the IndARC observatory demonstrating increased advection of warm Atlantic water into high Arctic fjords.',
    organization: 'Progress in Oceanography',
    stats: [
      { label: 'Citations', value: '31' },
      { label: 'Year', value: '2024' },
    ],
    targetTab: 'publications',
  },
];

const KNOWLEDGE_EDGES: KnowledgeEdge[] = [
  // Dr. Meloth connections
  { id: 'e1', source: 'sci-meloth', target: 'st-maitri', relation: 'Field Lead at' },
  { id: 'e2', source: 'sci-meloth', target: 'st-bharati', relation: 'Oversees' },
  { id: 'e3', source: 'sci-meloth', target: 'ds-clm', relation: 'PI Lead for' },
  { id: 'e4', source: 'sci-meloth', target: 'exp-44', relation: 'Chief Scientist of' },
  { id: 'e5', source: 'sci-meloth', target: 'pub-sam', relation: 'First Author of' },

  // Dr. Rahul Mohan connections
  { id: 'e6', source: 'sci-mohan', target: 'st-bharati', relation: 'Directs Bio-Lab at' },
  { id: 'e7', source: 'sci-mohan', target: 'st-indarc', relation: 'Co-PI for' },
  { id: 'e8', source: 'sci-mohan', target: 'ds-bio', relation: 'Curated' },
  { id: 'e9', source: 'sci-mohan', target: 'exp-soe', relation: 'Voyage Leader of' },
  { id: 'e10', source: 'sci-mohan', target: 'pub-arctic', relation: 'Lead Author of' },

  // Dr. Rohit Srivastava connections
  { id: 'e11', source: 'sci-srivastava', target: 'st-himadri', relation: 'Deployed Lidar at' },
  { id: 'e12', source: 'sci-srivastava', target: 'ds-si', relation: 'PI Lead for' },
  { id: 'e13', source: 'sci-srivastava', target: 'st-maitri', relation: 'AWS Calibration at' },

  // Station and Expedition connections
  { id: 'e14', source: 'exp-44', target: 'st-maitri', relation: 'Resupplies' },
  { id: 'e15', source: 'exp-44', target: 'st-bharati', relation: 'Crew Transfer at' },
  { id: 'e16', source: 'exp-soe', target: 'ds-bio', relation: 'Collected' },
  { id: 'e17', source: 'st-indarc', target: 'pub-arctic', relation: 'Generated data for' },
  { id: 'e18', source: 'st-himadri', target: 'pub-arctic', relation: 'Base station for' },
  { id: 'e19', source: 'ds-clm', target: 'pub-sam', relation: 'Analyzed in' },
];

export function KnowledgeGraphTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';
  const setActiveTab = useAuthStore((state) => state.setActiveTab);

  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(KNOWLEDGE_NODES[0]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return KNOWLEDGE_NODES.filter((node) => {
      const matchesFilter = filterType === 'all' || node.type === filterType;
      const matchesSearch =
        searchQuery.trim() === '' ||
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filterType, searchQuery]);

  // Connected edges for the selected node
  const activeEdges = useMemo(() => {
    if (!selectedNode) return [];
    return KNOWLEDGE_EDGES.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );
  }, [selectedNode]);

  const activeConnectedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    if (selectedNode) ids.add(selectedNode.id);
    activeEdges.forEach((e) => {
      ids.add(e.source);
      ids.add(e.target);
    });
    return ids;
  }, [selectedNode, activeEdges]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.2, 0.6));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Header with High-Contrast Typography */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
            <Network className="w-5 h-5 text-[#008b8b]" />
            <span>Polar Science Knowledge Graph</span>
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#4b5563]'}`}>
            Interactive topological relationship network connecting researchers, stations, datasets, publications, and expeditions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Entities' },
            { id: 'scientist', label: 'Scientists' },
            { id: 'station', label: 'Stations' },
            { id: 'dataset', label: 'Datasets' },
            { id: 'expedition', label: 'Expeditions' },
            { id: 'publication', label: 'Publications' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === tab.id
                  ? 'bg-[#008b8b] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#0f2233] text-[#8aa0b3] hover:text-white border border-white/5'
                  : 'bg-white text-[#5a6f82] hover:text-[#0b1721] border border-[#e5e7eb]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Network Canvas + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Network Canvas */}
        <div
          className={`lg:col-span-3 relative rounded-2xl border min-h-[580px] flex flex-col justify-between overflow-hidden shadow-xl ${
            isDark ? 'bg-[#061523] border-white/10' : 'bg-[#f4f7f9] border-[#e5e7eb]'
          }`}
        >
          {/* Top Control Bar on Canvas */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Search Input inside graph */}
            <div className="pointer-events-auto relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search graph entity..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-medium border shadow-md focus:outline-none focus:border-[#008b8b] ${
                  isDark
                    ? 'bg-[#0b1d2e]/90 border-white/10 text-white placeholder-gray-400 backdrop-blur-md'
                    : 'bg-white/95 border-gray-200 text-[#0b1721] placeholder-gray-500 backdrop-blur-md'
                }`}
              />
            </div>

            {/* Zoom Controls */}
            <div className="pointer-events-auto flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-white shadow-md">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 hover:text-cyan-300 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-3 bg-white/20" />
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 hover:text-cyan-300 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-px h-3 bg-white/20" />
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 hover:text-cyan-300 transition"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Graph Drawing */}
          <div
            className="w-full h-full min-h-[580px] flex items-center justify-center cursor-crosshair transition-transform duration-100"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center',
            }}
          >
            <svg
              viewBox="0 0 950 560"
              className="w-full h-full min-h-[580px] select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="graphPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke={isDark ? '#0f293e' : '#e2e8f0'}
                    strokeWidth="0.8"
                  />
                  <circle cx="40" cy="40" r="1" fill={isDark ? '#1a4163' : '#cbd5e1'} />
                </pattern>

                {/* Gradients */}
                <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>

              <rect width="950" height="560" fill="url(#graphPattern)" />

              {/* Edge Links */}
              {KNOWLEDGE_EDGES.map((edge) => {
                const srcNode = KNOWLEDGE_NODES.find((n) => n.id === edge.source);
                const tgtNode = KNOWLEDGE_NODES.find((n) => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const isConnectedToSelected =
                  selectedNode &&
                  (selectedNode.id === srcNode.id || selectedNode.id === tgtNode.id);

                const midX = (srcNode.x + tgtNode.x) / 2;
                const midY = (srcNode.y + tgtNode.y) / 2;

                return (
                  <g key={edge.id} className="transition-opacity duration-300">
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={isConnectedToSelected ? 'url(#edgeGlow)' : isDark ? '#1b3852' : '#cbd5e1'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                      strokeDasharray={isConnectedToSelected ? 'none' : '4 4'}
                      opacity={isConnectedToSelected ? 1 : 0.45}
                    />

                    {/* Edge Label on active selection */}
                    {isConnectedToSelected && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-38"
                          y="-9"
                          width="76"
                          height="18"
                          rx="9"
                          fill={isDark ? '#081a2b' : '#ffffff'}
                          stroke="#008b8b"
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          y="3.5"
                          fill={isDark ? '#5fd0c4' : '#008b8b'}
                          fontSize="9"
                          fontWeight="bold"
                        >
                          {edge.relation}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Node Circles */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = activeConnectedNodeIds.has(node.id);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Pulsing selection aura */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={34}
                        fill={node.color}
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Glow Halo */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 26 : isConnected ? 20 : 16}
                      fill={node.color}
                      opacity={isSelected ? 0.4 : isConnected ? 0.25 : 0.12}
                    />

                    {/* Main Node Solid Circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 16 : 13}
                      fill={node.color}
                      stroke={isSelected ? '#ffffff' : node.strokeColor}
                      strokeWidth={isSelected ? 3 : 2}
                      className="shadow-lg transition-all"
                    />

                    {/* Centered Node Icon Letter */}
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {node.icon}
                    </text>

                    {/* Node Text Label Badge */}
                    <g transform={`translate(${node.x}, ${node.y + 26})`}>
                      <rect
                        x="-65"
                        y="-8"
                        width="130"
                        height="18"
                        rx="9"
                        fill={isSelected ? '#008b8b' : isDark ? 'rgba(7, 21, 33, 0.85)' : 'rgba(255, 255, 255, 0.95)'}
                        stroke={isSelected ? '#5fd0c4' : isDark ? '#1e3a53' : '#e2e8f0'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : isDark ? '#f1f5f9' : '#0b1721'}
                        fontSize="9.5"
                        fontWeight={isSelected ? 'bold' : '600'}
                      >
                        {node.label.length > 20 ? `${node.label.slice(0, 18)}...` : node.label}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Graph Legend */}
          <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-sm flex items-center justify-between text-[11px] flex-wrap gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Scientist</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Station</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Dataset</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Expedition</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Publication</span>
              </span>
            </div>

            <span className="text-[10px] text-[#8aa0b3]">
              Showing {filteredNodes.length} of {KNOWLEDGE_NODES.length} nodes
            </span>
          </div>
        </div>

        {/* Right Details Panel */}
        <div
          className={`p-5 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#0f2233] border-white/10 text-white' : 'bg-white border-[#e5e7eb] text-[#0b1721]'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#008b8b] mb-3 flex items-center justify-between">
            <span>Entity Inspector</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#008b8b]/20 text-[#5fd0c4]">
              Connected ({activeEdges.length})
            </span>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              {/* Entity Profile Header */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  {selectedNode.icon}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold leading-snug">{selectedNode.label}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-semibold text-[#5fd0c4] capitalize">
                      {selectedNode.categoryLabel}
                    </span>
                    {selectedNode.organization && (
                      <>
                        <span className="text-[10px] text-[#8aa0b3]">·</span>
                        <span className="text-[10px] text-[#8aa0b3] truncate">
                          {selectedNode.organization}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio / Description */}
              <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {selectedNode.details}
              </p>

              {/* Key Metrics */}
              {selectedNode.stats && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {selectedNode.stats.map((st, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl border ${
                        isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-[9px] text-[#8aa0b3]">{st.label}</div>
                      <div className="text-xs font-bold text-[#008b8b] mt-0.5">{st.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Jump to related dashboard tab */}
              {selectedNode.targetTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab(selectedNode.targetTab!)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#008b8b]/20 hover:bg-[#008b8b]/30 text-[#5fd0c4] text-xs font-semibold transition"
                >
                  <span>Open in {selectedNode.type.toUpperCase()} Directory</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Connected Relationships List */}
              <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-2">
                <div className="text-[10px] uppercase font-bold text-[#8aa0b3]">
                  Connected Network Nodes
                </div>
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {activeEdges.map((edge) => {
                    const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                    const otherNode = KNOWLEDGE_NODES.find((n) => n.id === otherId);
                    if (!otherNode) return null;

                    return (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNode(otherNode)}
                        className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs hover:border-[#008b8b] ${
                          isDark
                            ? 'bg-[#071521] border-white/5 text-gray-200 hover:bg-white/5'
                            : 'bg-gray-50 border-gray-200 text-[#0b1721] hover:bg-gray-100'
                        }`}
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: otherNode.color }}
                          />
                          <span className="font-semibold truncate">{otherNode.label}</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8aa0b3] flex-shrink-0 ml-2">
                          {edge.relation}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              Click any node in the graph to inspect relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
