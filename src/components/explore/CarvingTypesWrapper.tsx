'use client';

import { CarvingTypesCarousel } from '@/components/explore/CarvingTypesCarousel';

interface CarvingTypesWrapperProps {
  activeCarvingType?: string;
}

export function CarvingTypesWrapper({ activeCarvingType }: CarvingTypesWrapperProps) {
  return <CarvingTypesCarousel filterMode activeCarvingType={activeCarvingType} />;
}