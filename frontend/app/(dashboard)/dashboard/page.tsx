'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DatasetItem } from '@/lib/polar-data';

import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ExploreMapTab } from '@/components/dashboard/ExploreMapTab';
import { UnifiedSearchTab } from '@/components/dashboard/UnifiedSearchTab';
import { AiAssistantTab } from '@/components/dashboard/AiAssistantTab';
import { DatasetsTab } from '@/components/dashboard/DatasetsTab';
import { PublicationsTab } from '@/components/dashboard/PublicationsTab';
import { KnowledgeGraphTab } from '@/components/dashboard/KnowledgeGraphTab';
import { ExpeditionsTab } from '@/components/dashboard/ExpeditionsTab';
import { StationsTab } from '@/components/dashboard/StationsTab';
import { EnvironmentalEventsTab } from '@/components/dashboard/EnvironmentalEventsTab';
import { MediaStoriesTab } from '@/components/dashboard/MediaStoriesTab';
import { ScientistsTab } from '@/components/dashboard/ScientistsTab';
import { SavedResearchTab } from '@/components/dashboard/SavedResearchTab';
import { NotificationsTab } from '@/components/dashboard/NotificationsTab';
import { AdminConsoleTab } from '@/components/dashboard/AdminConsoleTab';

export default function DashboardPage() {
  const activeTab = useAuthStore((state) => state.activeTab);
  const setActiveTab = useAuthStore((state) => state.setActiveTab);
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(null);

  const handleOpenDataset = (dataset: DatasetItem) => {
    setSelectedDataset(dataset);
    setActiveTab('datasets');
  };

  switch (activeTab) {
    case 'overview':
      return <OverviewTab onSelectDataset={handleOpenDataset} />;
    case 'map':
      return <ExploreMapTab />;
    case 'search':
      return <UnifiedSearchTab />;
    case 'ai':
      return <AiAssistantTab />;
    case 'datasets':
      return (
        <DatasetsTab
          selectedDataset={selectedDataset}
          onCloseDetail={() => setSelectedDataset(null)}
        />
      );
    case 'publications':
      return <PublicationsTab />;
    case 'knowledge':
      return <KnowledgeGraphTab />;
    case 'expeditions':
      return <ExpeditionsTab />;
    case 'stations':
      return <StationsTab />;
    case 'events':
      return <EnvironmentalEventsTab />;
    case 'media':
      return <MediaStoriesTab />;
    case 'scientists':
      return <ScientistsTab />;
    case 'saved':
      return <SavedResearchTab />;
    case 'notifications':
      return <NotificationsTab />;
    case 'console':
      return <AdminConsoleTab />;
    default:
      return <OverviewTab onSelectDataset={handleOpenDataset} />;
  }
}
