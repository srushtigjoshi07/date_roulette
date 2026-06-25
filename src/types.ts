/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Mood = 'cozy' | 'adventure' | 'budget' | 'rainy' | 'night_owl' | 'outdoors' | 'lazy' | 'surprise';

export type Distance = 'stay_home' | 'nearby' | 'up_to_10' | 'anywhere';

export type Category = 'food' | 'game' | 'creative' | 'explore' | 'movie' | 'cafe' | 'challenge' | 'surprise';

export type Climate = 'sunny' | 'rainy' | 'cold' | 'windy';

export interface DateOption {
  id: string;
  title: string;
  activity: string;
  foodChallenge: string;
  miniChallenge: string;
  conversationCards: string[];
  playlistName: string;
  playlistEmoji: string;
  estimatedTime: string;
  difficulty: number; // 1 to 3 stars
  budgetVal: number;
  secretTwist: string;
  category: Category;
  moodTags: Mood[];
  distanceTag: Distance;
  climates?: Climate[];
  isSpecialOccasion?: boolean;
}

export interface Memory {
  id: string;
  dateTitle: string;
  mood: Mood;
  category: Category;
  notes: string;
  rating: number; // 1-5 hearts
  photos: string[]; // base64 / local urls
  timestamp: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface StreakInfo {
  count: number;
  lastUpdated: number; // timestamp
  datesLoggedThisWeek: string[]; // dates list like ["2026-06-25"]
}

export interface WheelSegment {
  id: string;
  label: string;
  emoji: string;
  category: Category;
  color: string;
  dateOption: DateOption;
}

