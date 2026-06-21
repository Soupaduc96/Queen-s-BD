/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  defaultImageUrl: string;
  customImageUrl?: string;
  quality: string;
}

export interface QualityItem {
  id: string;
  title: string;
  description: string;
  sentiment: string;
}

export interface StoryMilestone {
  id: string;
  period: string;
  title: string;
  description: string;
  emotion: string;
}

export interface ReasonItem {
  id: number;
  title: string;
  content: string;
  quoteStr: string;
}
