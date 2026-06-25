/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Trophy,
  BookOpen,
  Sparkles,
  Music,
  Clock,
  ArrowRight,
  Flame,
  Zap,
  MapPin,
  Calendar,
  Volume2,
  VolumeX,
  Compass,
  Smile,
  AlertCircle
} from 'lucide-react';

import { Mood, Distance, Category, DateOption, Memory, Achievement, StreakInfo, Climate, WheelSegment } from './types';
import {
  DATE_POOL,
  CONVERSATION_STARTERS,
  BONUS_QUESTS,
  INITIAL_ACHIEVEMENTS,
  PLAYLIST_LINKS
} from './data/dates';
import { SpinningWheel } from './components/SpinningWheel';
import { Confetti } from './components/Confetti';
import { Scrapbook } from './components/Scrapbook';
import { Achievements } from './components/Achievements';
import {
  playPopSound,
  playSuccessSound,
  playUnlockSound,
  playAlertSound
} from './utils/audio';

export default function App() {
  // Navigation & Tabs
  const [currentTab, setCurrentTab] = useState<'spin' | 'scrapbook' | 'trophy' | 'seasonal'>('spin');
  const [hasOpenedApp, setHasOpenedApp] = useState(false);

  // Login & Partner Pairing States
  const [currentUser, setCurrentUser] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [mySpunId, setMySpunId] = useState<string | null>(null);
  const [partnerSpunId, setPartnerSpunId] = useState<string | null>(null);
  const [chosenDateId, setChosenDateId] = useState<string | null>(null);
  const [inviteLinkCopied, setInviteLinkCopied] = useState<boolean>(false);

  // Filters State
  const [selectedClimate, setSelectedClimate] = useState<Climate | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<number>(1500);
  const [selectedDistance, setSelectedDistance] = useState<Distance | null>(null);

  // Flow control
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: landing, 1: climate, 2: mood, 3: budget, 4: distance, 5: spinning-room
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeResult, setActiveResult] = useState<DateOption | null>(null);
  const [filterWarning, setFilterWarning] = useState(false);

  // Data persistence (localStorage based)
  const [memories, setMemories] = useState<Memory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [streakInfo, setStreakInfo] = useState<StreakInfo>({
    count: 0,
    lastUpdated: Date.now(),
    datesLoggedThisWeek: []
  });

  // Music Cassette Wave Animation toggle
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Floating/Random cards and conversation cards
  const [convoIndex, setConvoIndex] = useState(0);
  const [randomEvent, setRandomEvent] = useState<{ text: string; reward: string; emoji: string } | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);

  // Sound enable toggler
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Special Occasion States
  const [isSpecialDay, setIsSpecialDay] = useState<boolean>(false);
  const [specialOccasionName, setSpecialOccasionName] = useState<string>('');

  // Dynamic Wheel States
  const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
  const [winningIndex, setWinningIndex] = useState<number>(0);
  const [recentlySpunIds, setRecentlySpunIds] = useState<string[]>([]);
  const recentlySpunIdsRef = useRef<string[]>([]);
  const pendingWinnerRef = useRef<DateOption | null>(null);

  // Load from local storage and parse URL parameters for pairing session
  useEffect(() => {
    // 1. Load memories & achievements from localStorage
    const savedMemories = localStorage.getItem('date_roulette_memories');
    if (savedMemories) {
      try {
        setMemories(JSON.parse(savedMemories));
      } catch (e) {
        console.error('Failed parsing memories');
      }
    }

    const savedAchievements = localStorage.getItem('date_roulette_achievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (e) {
        console.error('Failed parsing achievements');
      }
    }

    const savedStreak = localStorage.getItem('date_roulette_streak');
    if (savedStreak) {
      try {
        setStreakInfo(JSON.parse(savedStreak));
      } catch (e) {
        console.error('Failed parsing streak info');
      }
    }

    // 2. Load User Profile
    const savedUser = localStorage.getItem('date_roulette_user');
    const savedPartner = localStorage.getItem('date_roulette_partner');

    // 3. Parse URL Search Parameters for real-time comparative invite sessions
    const params = new URLSearchParams(window.location.search);
    const p1 = params.get('p1'); // Player 1 (inviter)
    const p2 = params.get('p2'); // Player 2 (invitee)
    const p1Spin = params.get('p1_spin');
    const p2Spin = params.get('p2_spin');
    const urlClimate = params.get('climate');
    const urlMood = params.get('mood');
    const urlBudget = params.get('budget');
    const urlDist = params.get('dist');
    const urlChosen = params.get('chosen');
    const urlSpecial = params.get('special');
    const urlOccasion = params.get('occasion');

    if (p1 && p2) {
      // Direct session sync URL detected!
      // If the visitor already has a saved name matching p2, log them in as p2.
      // Otherwise, we pre-fill their form as p2 (invitee) and Aria/partner as p1.
      if (savedUser && savedUser.toLowerCase() === p2.toLowerCase()) {
        setCurrentUser(p2);
        setPartnerName(p1);
        setIsLoggedIn(true);
      } else if (savedUser && savedUser.toLowerCase() === p1.toLowerCase()) {
        setCurrentUser(p1);
        setPartnerName(p2);
        setIsLoggedIn(true);
      } else {
        // First-time guest logging in from invite link
        setCurrentUser(p2);
        setPartnerName(p1);
      }

      if (p1Spin) {
        setPartnerSpunId(p1Spin);
      }
      if (p2Spin) {
        setMySpunId(p2Spin);
      }

      if (urlChosen) {
        setChosenDateId(urlChosen);
        const matched = DATE_POOL.find((d) => d.id === urlChosen);
        if (matched) {
          setActiveResult(matched);
          setShowResult(true);
          setCurrentStep(5); // result chamber
        }
      } else if (p1Spin && !p2Spin) {
        // Partner spun. Show comparison once they spin
        const matched = DATE_POOL.find((d) => d.id === p1Spin);
        if (matched) {
          setPartnerSpunId(p1Spin);
        }
      }
    } else {
      // Normal standalone load
      if (savedUser) {
        setCurrentUser(savedUser);
        setPartnerName(savedPartner || '');
        setIsLoggedIn(true);
      }
    }

    if (urlClimate) setSelectedClimate(urlClimate as Climate);
    if (urlMood) setSelectedMood(urlMood as Mood);
    if (urlBudget) setSelectedBudget(parseInt(urlBudget));
    if (urlDist) setSelectedDistance(urlDist as Distance);
    if (urlSpecial === 'true') setIsSpecialDay(true);
    if (urlOccasion) setSpecialOccasionName(urlOccasion);
  }, []);

  // Save to local storage
  const saveMemories = (updated: Memory[]) => {
    setMemories(updated);
    localStorage.setItem('date_roulette_memories', JSON.stringify(updated));
  };

  const saveAchievements = (updated: Achievement[]) => {
    setAchievements(updated);
    localStorage.setItem('date_roulette_achievements', JSON.stringify(updated));
  };

  const saveStreak = (updated: StreakInfo) => {
    setStreakInfo(updated);
    localStorage.setItem('date_roulette_streak', JSON.stringify(updated));
  };

  // Trigger achievement unlock helper
  const unlockAchievement = (id: string) => {
    const target = achievements.find((a) => a.id === id);
    if (target && !target.unlocked) {
      const updated = achievements.map((a) =>
        a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
      );
      saveAchievements(updated);
      if (soundEnabled) playUnlockSound();

      // Trigger achievement notification banner
      setRandomEvent({
        text: `🏆 ACHIEVEMENT UNLOCKED! You earned the "${target.name}" badge.`,
        reward: `View it in your Trophy Room. ${target.emoji}`,
        emoji: '🏆'
      });
    }
  };

  // ISO Week calculation helpers for weekly streak
  const getWeekIdentifier = (timestamp: number): string => {
    const date = new Date(timestamp);
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNo}`;
  };

  const getPreviousWeekIdentifier = (timestamp: number): string => {
    return getWeekIdentifier(timestamp - 7 * 24 * 60 * 60 * 1000);
  };

  // Handle adding memories
  const handleAddMemory = (newMem: Omit<Memory, 'id' | 'timestamp'>) => {
    const memoryItem: Memory = {
      ...newMem,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };
    const updated = [memoryItem, ...memories];
    saveMemories(updated);

    // Update streak info and unlock badges ONLY when a photo is uploaded!
    if (newMem.photos && newMem.photos.length > 0) {
      const currentWeekStr = getWeekIdentifier(Date.now());
      const prevWeekStr = getPreviousWeekIdentifier(Date.now());

      let datesLogged = [...streakInfo.datesLoggedThisWeek];
      let newStreakCount = streakInfo.count;

      if (!datesLogged.includes(currentWeekStr)) {
        datesLogged.push(currentWeekStr);
        // If the last logged week was exactly the previous week, continue weekly streak.
        // If they had no streak, start at 1. If they skipped a week, reset to 1.
        if (datesLogged.includes(prevWeekStr)) {
          newStreakCount += 1;
        } else {
          newStreakCount = 1;
        }

        saveStreak({
          count: newStreakCount,
          lastUpdated: Date.now(),
          datesLoggedThisWeek: datesLogged
        });
      }

      // Unlock badges ONLY when photo of the challenge is uploaded!
      const originalDate = DATE_POOL.find((d) => d.title === newMem.dateTitle);
      
      // Always unlock first completed photo challenge badge!
      unlockAchievement('first_spin');

      if (originalDate) {
        if (originalDate.moodTags.includes('rainy')) {
          unlockAchievement('rain_survivor');
        }
        if (originalDate.budgetVal <= 500) {
          unlockAchievement('budget_master');
        }
        if (originalDate.category === 'food' || originalDate.id.includes('food')) {
          unlockAchievement('food_explorer');
        }
        if (originalDate.moodTags.includes('night_owl')) {
          unlockAchievement('night_owl');
        }
        if (originalDate.distanceTag === 'anywhere' || originalDate.budgetVal >= 2500) {
          unlockAchievement('adventure_couple');
        }
      }
      unlockAchievement('scrapbooker');
    }

    // Trigger success audio
    if (soundEnabled) playSuccessSound();
  };

  // Handle updating a memory with a photo later (claims weekly streak and badges)
  const handleUpdateMemoryPhoto = (id: string, photoBase64: string) => {
    const targetMemory = memories.find((m) => m.id === id);
    if (!targetMemory) return;

    const updatedMemories = memories.map((m) =>
      m.id === id ? { ...m, photos: [photoBase64] } : m
    );
    saveMemories(updatedMemories);

    // Update streak info and unlock badges since a photo has now been uploaded!
    const currentWeekStr = getWeekIdentifier(Date.now());
    const prevWeekStr = getPreviousWeekIdentifier(Date.now());

    let datesLogged = [...streakInfo.datesLoggedThisWeek];
    let newStreakCount = streakInfo.count;

    if (!datesLogged.includes(currentWeekStr)) {
      datesLogged.push(currentWeekStr);
      if (datesLogged.includes(prevWeekStr)) {
        newStreakCount += 1;
      } else {
        newStreakCount = 1;
      }

      saveStreak({
        count: newStreakCount,
        lastUpdated: Date.now(),
        datesLoggedThisWeek: datesLogged
      });
    }

    // Unlock badges ONLY when photo of the challenge is uploaded!
    const originalDate = DATE_POOL.find((d) => d.title === targetMemory.dateTitle);
    
    unlockAchievement('first_spin');

    if (originalDate) {
      if (originalDate.moodTags.includes('rainy')) {
        unlockAchievement('rain_survivor');
      }
      if (originalDate.budgetVal <= 500) {
        unlockAchievement('budget_master');
      }
      if (originalDate.category === 'food' || originalDate.id.includes('food')) {
        unlockAchievement('food_explorer');
      }
      if (originalDate.moodTags.includes('night_owl')) {
        unlockAchievement('night_owl');
      }
      if (originalDate.distanceTag === 'anywhere' || originalDate.budgetVal >= 2500) {
        unlockAchievement('adventure_couple');
      }
    }
    unlockAchievement('scrapbooker');

    if (soundEnabled) playSuccessSound();
  };

  // Handle deleting memory polaroids
  const handleDeleteMemory = (id: string) => {
    const filtered = memories.filter((m) => m.id !== id);
    saveMemories(filtered);
  };

  // Determine relative budget emoji
  const budgetEmoji = useMemo(() => {
    if (selectedBudget < 300) return '🪙 (Super Budget)';
    if (selectedBudget < 800) return '💸 (Chilled)';
    if (selectedBudget < 2000) return '💳 (Mid-Range)';
    return '👑 (Luxury Splurge)';
  }, [selectedBudget]);

  // Handle login submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.trim()) return;
    localStorage.setItem('date_roulette_user', currentUser);
    localStorage.setItem('date_roulette_partner', partnerName);
    setIsLoggedIn(true);
    if (soundEnabled) playPopSound();
    
    // Auto start on step 1 (climate selection)
    setCurrentStep(1);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('date_roulette_user');
    localStorage.removeItem('date_roulette_partner');
    setCurrentUser('');
    setPartnerName('');
    setIsLoggedIn(false);
    setMySpunId(null);
    setPartnerSpunId(null);
    setChosenDateId(null);
    setActiveResult(null);
    setShowResult(false);
    setCurrentStep(0);
    if (soundEnabled) playPopSound();
  };

  // Generate real-time comparative session URLs
  const generateInviteLink = (chosenId?: string) => {
    const params = new URLSearchParams();
    params.set('p1', currentUser || 'Player1');
    params.set('p2', partnerName || 'Partner');
    
    // P1's spin is always saved when they invite
    if (mySpunId) {
      params.set('p1_spin', mySpunId);
    } else if (activeResult) {
      params.set('p1_spin', activeResult.id);
    }
    
    // P2's spin is saved if Leo also spun
    if (partnerSpunId) {
      params.set('p2_spin', partnerSpunId);
    }
    
    if (chosenId) {
      params.set('chosen', chosenId);
    } else if (chosenDateId) {
      params.set('chosen', chosenDateId);
    }

    if (selectedClimate) params.set('climate', selectedClimate);
    if (selectedMood) params.set('mood', selectedMood);
    params.set('budget', selectedBudget.toString());
    if (selectedDistance) params.set('dist', selectedDistance);
    if (isSpecialDay) params.set('special', 'true');
    if (specialOccasionName) params.set('occasion', specialOccasionName);

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const copyInviteLink = (chosenId?: string) => {
    const link = generateInviteLink(chosenId);
    navigator.clipboard.writeText(link);
    setInviteLinkCopied(true);
    if (soundEnabled) playSuccessSound();
    setTimeout(() => setInviteLinkCopied(false), 3000);
  };

  // Helper to filter dates ensuring budget is strictly respected (and other filters relaxed if no matches exist)
  const getFilteredDates = (budget: number, mood: Mood | null, climate: Climate | null, distance: Distance | null): DateOption[] => {
    let pool = DATE_POOL;

    // A. STRICT DISTANCE FILTERING: Always restrict to selected distance category unless 'anywhere'
    if (distance && distance !== 'anywhere') {
      pool = pool.filter(d => d.distanceTag === distance);
    }

    if (pool.length === 0) {
      pool = DATE_POOL;
    }

    // B. BUDGET FILTERING: Strictly less than or equal to selected budget
    let underBudget = pool.filter(d => d.budgetVal <= budget);
    if (underBudget.length === 0) {
      // Find the minimum budget value in this distance pool to avoid empty states, keeping it as low as possible
      const minBudget = Math.min(...pool.map(d => d.budgetVal));
      underBudget = pool.filter(d => d.budgetVal <= minBudget);
    }
    pool = underBudget;

    // C. CLIMATE FILTER (relaxable): Only filter if there are matches
    if (climate) {
      const matched = pool.filter(d => d.climates?.includes(climate));
      if (matched.length > 0) pool = matched;
    }

    // D. MOOD FILTER (relaxable): Only filter if there are matches
    if (mood && mood !== 'surprise') {
      const matched = pool.filter(d => d.moodTags.includes(mood));
      if (matched.length > 0) pool = matched;
    }

    return pool;
  };

  // Generate 8 dynamic segments under the budget for the spin wheel
  const generateWheelSegments = (currentActiveId?: string | null): WheelSegment[] => {
    const primaryMatches = getFilteredDates(selectedBudget, selectedMood, selectedClimate, selectedDistance);
    
    // Filter out recently spun ideas to avoid repetition if we have multiple options
    let pool = primaryMatches.filter(d => !recentlySpunIdsRef.current.includes(d.id));
    if (pool.length === 0) {
      pool = primaryMatches;
    }

    // Shuffle the pool to make suggestions completely random and changing on every spin!
    pool = [...pool].sort(() => Math.random() - 0.5);

    // If we want to avoid the current active result on the wheel (or as the winner), we can filter it out of the pool
    if (currentActiveId && pool.length > 1) {
      pool = pool.filter(d => d.id !== currentActiveId);
    }

    let selectedDates: DateOption[] = [];

    // Take up to 8 from our primary matched pool
    selectedDates = pool.slice(0, 8);

    // If we have fewer than 8 items, let's pad them with other dates that STRICTLY respect the distance constraint and are under budget!
    if (selectedDates.length < 8) {
      // Find other dates in DATE_POOL under the same distance constraint and budget
      let backstops = DATE_POOL.filter(d => 
        (selectedDistance && selectedDistance !== 'anywhere' ? d.distanceTag === selectedDistance : true) &&
        d.budgetVal <= selectedBudget &&
        !selectedDates.some(sd => sd.id === d.id) &&
        !recentlySpunIdsRef.current.includes(d.id)
      );
      
      // If we still need items but budget is too low, relax budget but KEEP the strict distance filter!
      if (backstops.length === 0) {
        backstops = DATE_POOL.filter(d => 
          (selectedDistance && selectedDistance !== 'anywhere' ? d.distanceTag === selectedDistance : true) &&
          !selectedDates.some(sd => sd.id === d.id) &&
          !recentlySpunIdsRef.current.includes(d.id)
        );
      }

      // If absolutely everything was spun recently and backstops are empty, fall back to unfiltered backstops
      if (backstops.length === 0) {
        backstops = DATE_POOL.filter(d => 
          (selectedDistance && selectedDistance !== 'anywhere' ? d.distanceTag === selectedDistance : true) &&
          !selectedDates.some(sd => sd.id === d.id)
        );
      }

      // Shuffle the backstops
      backstops.sort(() => Math.random() - 0.5);

      // Add to selectedDates
      for (const b of backstops) {
        if (selectedDates.length >= 8) break;
        selectedDates.push(b);
      }
    }

    // If we STILL have fewer than 8, let's look at the absolute general DATE_POOL to ensure 8 unique options
    if (selectedDates.length < 8) {
      const remainingUnseen = DATE_POOL.filter(d => 
        !selectedDates.some(sd => sd.id === d.id) &&
        !recentlySpunIdsRef.current.includes(d.id)
      ).sort(() => Math.random() - 0.5);

      for (const r of remainingUnseen) {
        if (selectedDates.length >= 8) break;
        selectedDates.push(r);
      }
    }

    // Absolute fallback of any remaining unique items
    if (selectedDates.length < 8) {
      const remainingAll = DATE_POOL.filter(d => 
        !selectedDates.some(sd => sd.id === d.id)
      ).sort(() => Math.random() - 0.5);

      for (const r of remainingAll) {
        if (selectedDates.length >= 8) break;
        selectedDates.push(r);
      }
    }

    // Map to WheelSegments
    const WHEEL_COLORS = [
      '#f43f5e', // Rose 500
      '#8b5cf6', // Purple 500
      '#f97316', // Orange 500
      '#10b981', // Emerald 500
      '#06b6d4', // Cyan 500
      '#ec4899', // Pink 500
      '#eab308', // Yellow 500
      '#3b82f6'  // Blue 500
    ];

    return selectedDates.slice(0, 8).map((dateOpt, index) => ({
      id: dateOpt.id,
      label: dateOpt.title,
      emoji: dateOpt.id.includes('special-') 
         ? (dateOpt.id === 'special-candlelight' ? '🕯️' : dateOpt.id === 'special-stargazing' ? '🌟' : '🎭') 
         : dateOpt.playlistEmoji,
      category: dateOpt.category,
      color: WHEEL_COLORS[index % WHEEL_COLORS.length],
      dateOption: dateOpt
    }));
  };

  // Prepares the wheel with 8 fresh segments and selects the winning index
  const prepareSpinChamber = (currentActiveId?: string | null) => {
    const segments = generateWheelSegments(currentActiveId);
    setWheelSegments(segments);
    
    // Choose a winning index intelligently from these 8 segments to guarantee it's not recently spun or currently active
    let winIndex = -1;
    
    // Candidates that are NOT in recentlySpunIdsRef.current and NOT currentActiveId
    const candidates = segments.map((seg, idx) => ({ seg, idx })).filter(({ seg }) => 
      seg.id !== currentActiveId && !recentlySpunIdsRef.current.includes(seg.id)
    );

    if (candidates.length > 0) {
      winIndex = candidates[Math.floor(Math.random() * candidates.length)].idx;
    } else {
      // Fallback: pick any segment that is NOT currentActiveId
      const fallbackCandidates = segments.map((seg, idx) => ({ seg, idx })).filter(({ seg }) => 
        seg.id !== currentActiveId
      );
      if (fallbackCandidates.length > 0) {
        winIndex = fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)].idx;
      } else {
        winIndex = Math.floor(Math.random() * segments.length);
      }
    }
    
    setWinningIndex(winIndex);

    // Track the pending winner immediately to avoid state synchronization / stale closure issues when spin completes!
    if (segments.length > 0 && winIndex >= 0) {
      const winner = segments[winIndex].dateOption;
      pendingWinnerRef.current = winner;

      // Update recently spun IDs list to avoid repeating this idea in subsequent spins
      recentlySpunIdsRef.current = [winner.id, ...recentlySpunIdsRef.current.filter(id => id !== winner.id)].slice(0, 15);
      setRecentlySpunIds(recentlySpunIdsRef.current);
    }
  };

  // Execute Date Spin choice animation
  const handleStartSpin = () => {
    if (soundEnabled) playPopSound();
    setIsSpinning(true);
    setShowResult(false);
    setFilterWarning(false);
  };

  // When spin finishes
  const handleSpinComplete = (category: Category) => {
    setIsSpinning(false);
    
    let winner: DateOption | null = null;
    if (pendingWinnerRef.current) {
      winner = pendingWinnerRef.current;
      setActiveResult(winner);
      setMySpunId(winner.id);
    } else if (wheelSegments && wheelSegments.length > 0) {
      winner = wheelSegments[winningIndex].dateOption;
      setActiveResult(winner);
      setMySpunId(winner.id);
    }
    
    setShowResult(true);
    setConfettiActive(true);

    if (soundEnabled) playSuccessSound();

    // Unlock first spin achievement
    unlockAchievement('first_spin');

    // Unlock specific achievements based on spun date properties
    if (winner) {
      if (winner.moodTags.includes('rainy')) {
        unlockAchievement('rain_survivor');
      }
      if (winner.budgetVal <= 500) {
        unlockAchievement('budget_master');
      }
      if (winner.category === 'food' || winner.id.includes('food')) {
        unlockAchievement('food_explorer');
      }
      if (winner.moodTags.includes('night_owl')) {
        unlockAchievement('night_owl');
      }
      if (winner.distanceTag === 'anywhere' || winner.budgetVal >= 2500) {
        unlockAchievement('adventure_couple');
      }
    }

    // Trigger Random Event (5% probability)
    if (Math.random() < 0.25) { // raised to 25% for demo/fun replayability!
      setTimeout(() => {
        const randEvent = BONUS_QUESTS[Math.floor(Math.random() * BONUS_QUESTS.length)];
        setRandomEvent(randEvent);
        if (soundEnabled) playAlertSound();
      }, 1500);
    }

    // Turn off confetti after 4 seconds
    setTimeout(() => {
      setConfettiActive(false);
    }, 4500);
  };

  // Reset steps & state to start over
  const handleResetWheel = () => {
    if (soundEnabled) playPopSound();
    setShowResult(false);
    setActiveResult(null);
    setCurrentStep(1); // go back to mood selection
  };

  // Navigation handlers
  const navigateToTab = (tab: 'spin' | 'scrapbook' | 'trophy' | 'seasonal') => {
    if (soundEnabled) playPopSound();
    setCurrentTab(tab);
    if (tab === 'spin') {
      // Keep on current step or start setup if never opened
      if (currentStep === 0) {
        setCurrentStep(1);
      }
    }
  };

  // LOGIN PAGE BYPASS
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-rose-50/40 text-neutral-900 font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <Confetti active={confettiActive} />
        <div className="absolute top-10 left-[-50px] text-pink-200 select-none pointer-events-none text-7xl opacity-20 animate-float">❤️</div>
        <div className="absolute top-[40%] right-[-60px] text-pink-200 select-none pointer-events-none text-9xl opacity-20 animate-float-reverse">🌸</div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border-4 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10"
        >
          <div className="text-center mb-6">
            <span className="text-6xl mb-2 block animate-bounce">🎡</span>
            <h2 className="font-display text-3xl font-black text-neutral-900 uppercase tracking-tight leading-none">
              Date Roulette
            </h2>
            <p className="text-neutral-500 text-xs font-semibold mt-1.5 leading-snug">
              "Stop asking 'Where do you want to go?'" Put your romance on double-or-nothing fate!
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-display text-xs font-black uppercase tracking-wider text-neutral-700 mb-1">
                Your Name 🙋‍♂️
              </label>
              <input
                type="text"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                placeholder="e.g. Aria"
                required
                className="w-full px-4 py-2.5 border-4 border-black rounded-xl bg-white font-display font-extrabold text-neutral-800 placeholder:text-neutral-300 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-rose-200"
              />
            </div>

            <div>
              <label className="block font-display text-xs font-black uppercase tracking-wider text-neutral-700 mb-1">
                Partner's Name 🙋‍♀️
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="e.g. Leo"
                required
                className="w-full px-4 py-2.5 border-4 border-black rounded-xl bg-white font-display font-extrabold text-neutral-800 placeholder:text-neutral-300 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-rose-200"
              />
            </div>

            <div className="bg-amber-50 p-4 border-2 border-dashed border-amber-300 rounded-2xl">
              <label className="block font-display text-[10px] font-black uppercase tracking-wider text-amber-800 mb-2 text-center">
                Select Your Local Weather/Climate 🌧
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'sunny', label: '☀️ Sunny / Hot' },
                  { key: 'rainy', label: '🌧 Monsoon / Rain' },
                  { key: 'cold', label: '❄️ Cold / Chilly' },
                  { key: 'windy', label: '🌫 Humid / Windy' }
                ].map((cli) => (
                  <button
                    key={cli.key}
                    type="button"
                    onClick={() => {
                      setSelectedClimate(cli.key as Climate);
                      if (soundEnabled) playPopSound();
                    }}
                    className={`py-2 px-2 text-[11px] font-display font-extrabold rounded-xl border-2 border-black transition-all ${
                      selectedClimate === cli.key
                        ? 'bg-rose-100 text-rose-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {cli.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-amber-700 text-center mt-2 font-medium">
                We'll prioritize perfect cozy-indoor or outdoor date options!
              </p>
            </div>

            {/* Special Occasion Toggle & Input */}
            <div className="bg-pink-50 p-4 border-2 border-dashed border-pink-300 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-display text-[10px] font-black uppercase tracking-wider text-pink-800">
                  🎉 Special Occasion Today?
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSpecialDay(!isSpecialDay);
                    if (soundEnabled) playPopSound();
                    if (!isSpecialDay) {
                      setSpecialOccasionName('Anniversary 💖');
                    } else {
                      setSpecialOccasionName('');
                    }
                  }}
                  className={`px-3 py-1 text-[10px] font-display font-bold uppercase rounded-md border-2 border-black transition-all ${
                    isSpecialDay ? 'bg-pink-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-neutral-600'
                  }`}
                >
                  {isSpecialDay ? 'Yes 💖' : 'No 🌻'}
                </button>
              </div>
              
              <AnimatePresence>
                {isSpecialDay && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-2"
                  >
                    <input
                      type="text"
                      value={specialOccasionName}
                      onChange={(e) => setSpecialOccasionName(e.target.value)}
                      placeholder="e.g. 1st Anniversary, Aria's Birthday"
                      className="w-full px-3 py-1.5 border-2 border-black rounded-lg bg-white font-sans text-xs font-semibold text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                    <div className="flex flex-wrap gap-1 justify-center pt-1">
                      {['Anniversary 💖', 'Birthday 🎂', 'Proposal 💍', 'Date Night ✨'].map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setSpecialOccasionName(suggestion);
                            if (soundEnabled) playPopSound();
                          }}
                          className="px-2 py-0.5 text-[9px] font-mono font-bold bg-white hover:bg-neutral-50 text-pink-700 border border-neutral-300 rounded-full"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-rose-500 hover:bg-rose-400 text-white font-display text-md font-black uppercase tracking-wider rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Enter Our Love Realm 💘
            </button>
          </form>

          {partnerSpunId && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-sans leading-normal">
              🎁 <strong>Session Found!</strong> You've been invited. Log in to compare your spins side-by-side!
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50/40 text-neutral-900 font-sans relative overflow-x-hidden pb-16">
      <Confetti active={confettiActive} />

      {/* Floating Background Sparkles Decoration */}
      <div className="absolute top-10 left-[-50px] text-pink-200 select-none pointer-events-none text-7xl opacity-20 animate-float">
        ❤️
      </div>
      <div className="absolute top-[40%] right-[-60px] text-pink-200 select-none pointer-events-none text-9xl opacity-20 animate-float-reverse">
        🌸
      </div>
      <div className="absolute bottom-[10%] left-[2%] text-pink-100 select-none pointer-events-none text-6xl opacity-30 animate-float">
        ✨
      </div>

      {/* PERSISTENT HEADER BAR */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b-4 border-black px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              if (soundEnabled) playPopSound();
              setCurrentStep(0);
              setCurrentTab('spin');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-rose-500 border-2 border-black rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-sm">
              <span className="text-xl">🎡</span>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg md:text-xl uppercase tracking-wider text-neutral-950 flex items-center gap-1">
                Date Roulette <span className="text-rose-500">❤️</span>
              </h1>
              <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">
                Gen Z Adventure Engine
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute SFX' : 'Unmute SFX'}
              className="p-2 border-2 border-black rounded-xl bg-neutral-100 hover:bg-neutral-200 active:scale-95 transition-all"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 border-2 border-black rounded-xl text-rose-700 font-display font-bold text-xs md:text-sm shadow-sm animate-pulse">
              <Flame size={16} className="fill-rose-500 stroke-rose-600" />
              <span>{streakInfo.count} Weeks</span>
            </div>

            {/* Achievements Counter */}
            <div
              onClick={() => navigateToTab('trophy')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 cursor-pointer border-2 border-black rounded-xl text-yellow-700 font-display font-bold text-xs md:text-sm shadow-sm"
            >
              <Trophy size={16} className="fill-yellow-400 stroke-yellow-600" />
              <span>
                {achievements.filter((a) => a.unlocked).length} Badge
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* COUPLES BAR & CLIMATE QUICK STATUS */}
      <div className="bg-neutral-900 border-b-4 border-black text-white px-4 py-2.5 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
              👩‍❤️‍👨 Couple Session
            </span>
            <span className="font-semibold text-neutral-200">
              {currentUser} 💖 {partnerName || 'Partner'}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300">
              Climate: <span className="font-bold text-yellow-400 uppercase">{selectedClimate || 'Sunny'}</span>
            </span>
            {isSpecialDay && (
              <>
                <span className="text-neutral-500">•</span>
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest text-[9px] animate-pulse border border-pink-400">
                  Celebrating: {specialOccasionName || 'Milestone'} 👑
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyInviteLink()}
              className={`px-3 py-1 font-display font-black uppercase rounded text-[10px] border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 active:translate-y-0.5 ${
                inviteLinkCopied ? 'bg-green-400 text-black' : 'bg-yellow-400 text-black hover:bg-yellow-300'
              }`}
            >
              {inviteLinkCopied ? '📋 Link Copied!' : '🔗 Invite Partner'}
            </button>

            <button
              onClick={handleLogout}
              className="px-2 py-1 bg-red-600 text-white font-display font-bold uppercase rounded text-[10px] hover:bg-red-500"
            >
              Logout 🚪
            </button>
          </div>
        </div>
      </div>

      {/* CORE WRAPPER */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-8 max-w-md mx-auto">
          <button
            onClick={() => navigateToTab('spin')}
            className={`flex-1 py-3 px-3 rounded-2xl font-display font-bold text-xs md:text-sm uppercase tracking-wider border-4 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none ${
              currentTab === 'spin' && currentStep > 0
                ? 'bg-yellow-400 text-black'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            🎡 Spin
          </button>
          <button
            onClick={() => navigateToTab('scrapbook')}
            className={`flex-1 py-3 px-3 rounded-2xl font-display font-bold text-xs md:text-sm uppercase tracking-wider border-4 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none ${
              currentTab === 'scrapbook'
                ? 'bg-rose-400 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            📸 Scrapbook
          </button>
          <button
            onClick={() => navigateToTab('trophy')}
            className={`flex-1 py-3 px-3 rounded-2xl font-display font-bold text-xs md:text-sm uppercase tracking-wider border-4 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none ${
              currentTab === 'trophy'
                ? 'bg-violet-400 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            🏆 Badges
          </button>
          <button
            onClick={() => navigateToTab('seasonal')}
            className={`relative py-3 px-3 rounded-2xl font-display font-bold text-xs md:text-sm uppercase tracking-wider border-4 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none ${
              currentTab === 'seasonal'
                ? 'bg-emerald-400 text-white'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            🌧 Monsoon
            <span className="absolute top-[-6px] right-[-6px] flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
          </button>
        </div>

        {/* RANDOM BONUS QUEST EVENT NOTIFIER (GLOWING POPUP) */}
        <AnimatePresence>
          {randomEvent && (
            <motion.div
              initial={{ scale: 0.8, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="bg-neutral-900 border-4 border-black text-white p-5 rounded-3xl shadow-[6px_6px_0px_0px_rgba(244,63,94,1)] mb-8 flex items-start gap-4 z-50 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-3xl animate-bounce flex-shrink-0">
                {randomEvent.emoji}
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="font-display font-extrabold text-sm md:text-base tracking-wider uppercase text-rose-400 flex items-center gap-1">
                  ⚡ Interactive Spark Quest ⚡
                </h4>
                <p className="font-sans text-xs md:text-sm font-semibold leading-relaxed text-neutral-100">
                  {randomEvent.text}
                </p>
                <span className="inline-block text-[10px] font-mono font-bold text-yellow-400">
                  REWARD: {randomEvent.reward}
                </span>
              </div>
              <button
                onClick={() => {
                  if (soundEnabled) playPopSound();
                  setRandomEvent(null);
                }}
                className="text-neutral-400 hover:text-white font-bold text-lg p-1"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAGE ROUTER AND STATE SWITCH */}
        <AnimatePresence mode="wait">
          {/* SCRAPBOOK TAB */}
          {currentTab === 'scrapbook' && (
            <motion.div
              key="scrapbook-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Scrapbook
                memories={memories}
                onDeleteMemory={handleDeleteMemory}
                onAddMemory={handleAddMemory}
                currentDateTitle={activeResult?.title || ''}
                currentMood={selectedMood || 'surprise'}
                onUpdateMemoryPhoto={handleUpdateMemoryPhoto}
              />
            </motion.div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {currentTab === 'trophy' && (
            <motion.div
              key="trophy-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Achievements achievements={achievements} />
            </motion.div>
          )}

          {/* MONSOON SEASONAL EVENT TAB */}
          {currentTab === 'seasonal' && (
            <motion.div
              key="seasonal-page"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-emerald-950 border-4 border-black text-white p-6 rounded-3xl shadow-[5px_5px_0px_0px_rgba(16,185,129,1)] relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-15 select-none pointer-events-none">
                  🌧
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-emerald-300">
                  🌧 Monsoon Romance Challenge
                </h2>
                <p className="text-neutral-300 font-sans text-xs md:text-sm mt-2 max-w-lg leading-relaxed">
                  June is downpour season! Stop waiting inside. Put on your high-grip sneakers, grab two umbrellas, and trigger our special rainy event!
                </p>

                <div className="mt-6 p-4 bg-emerald-900/50 border border-emerald-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                      Seasonal Date unlock
                    </span>
                    <h3 className="font-display text-lg font-bold text-white mt-1">
                      🌧 Monsoon Muddy Adventure
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      setSelectedMood('rainy');
                      setSelectedBudget(500);
                      setSelectedDistance('nearby');
                      setCurrentStep(4);
                      setCurrentTab('spin');
                    }}
                    className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-display font-bold uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition"
                  >
                    Unlock & Spin ⚡
                  </button>
                </div>
              </div>

              {/* Monsoon features description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="font-display font-bold text-neutral-900 flex items-center gap-1">
                    ☕ Cutting Chai & Pakoras
                  </h4>
                  <p className="text-neutral-500 text-xs font-sans mt-1">
                    Authentic roadside monsoon food quest included inside our Monsoon dates.
                  </p>
                </div>
                <div className="bg-white border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h4 className="font-display font-bold text-neutral-900 flex items-center gap-1">
                    🛡️ Mud Shoes mini-challenge
                  </h4>
                  <p className="text-neutral-500 text-xs font-sans mt-1">
                    Splashing puddles safely and snapping dynamic pictures for the polaroid scrapbooking wall.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SPIN & SETUP TAB */}
          {currentTab === 'spin' && (
            <div key="spin-chamber-router">
              {/* LANDING PAGE (Step 0) */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-8"
                >
                  {/* Glowing Logo */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-rose-400 rounded-full filter blur-[40px] opacity-30 animate-pulse" />
                    <span className="text-8xl md:text-9xl relative select-none animate-bounce block [animation-duration:4s]">
                      🎡
                    </span>
                  </div>

                  <div className="space-y-4 max-w-lg">
                    <h2 className="font-display text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-neutral-950 leading-none">
                      ❤️ Date Roulette <span className="text-rose-500">❤️</span>
                    </h2>
                    <p className="font-display text-md md:text-xl font-bold text-neutral-600 leading-snug">
                      "Stop asking 'Where do you want to go?'" Let fate launch your next memory.
                    </p>
                  </div>

                  {/* High visual spin start */}
                  <button
                    onClick={() => {
                      if (soundEnabled) playPopSound();
                      setHasOpenedApp(true);
                      setCurrentStep(1);
                    }}
                    className="px-12 py-5 bg-rose-500 hover:bg-rose-400 text-white font-display text-xl font-black uppercase tracking-widest rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform transition-all duration-150 hover:-translate-y-1 active:translate-y-1 active:shadow-none hover:rotate-1"
                  >
                    🎡 Spin Our Date
                  </button>

                  {/* Special Occasion Toggle on Landing Page */}
                  <div className="w-full max-w-sm bg-pink-50 border-4 border-black p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-xs uppercase tracking-wider text-pink-800 flex items-center gap-1">
                        🎂 Celebrating something special?
                      </span>
                      <button
                        onClick={() => {
                          setIsSpecialDay(!isSpecialDay);
                          if (soundEnabled) playPopSound();
                          if (!isSpecialDay) {
                            setSpecialOccasionName('Anniversary 💖');
                          } else {
                            setSpecialOccasionName('');
                          }
                        }}
                        className={`px-3 py-1 text-[10px] font-display font-bold uppercase rounded-md border-2 border-black transition-all ${
                          isSpecialDay ? 'bg-pink-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-neutral-600'
                        }`}
                      >
                        {isSpecialDay ? 'Yes 💖' : 'No 🌻'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isSpecialDay && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-2 pt-1"
                        >
                          <input
                            type="text"
                            value={specialOccasionName}
                            onChange={(e) => setSpecialOccasionName(e.target.value)}
                            placeholder="e.g. 1st Anniversary, Aria's Birthday"
                            className="w-full px-3 py-2 border-2 border-black rounded-lg bg-white font-sans text-xs font-semibold text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-pink-200"
                          />
                          <div className="flex flex-wrap gap-1 justify-center">
                            {['Anniversary 💖', 'Birthday 🎂', 'Proposal 💍', 'Date Night ✨'].map((suggestion) => (
                              <button
                                key={suggestion}
                                onClick={() => {
                                  setSpecialOccasionName(suggestion);
                                  if (soundEnabled) playPopSound();
                                }}
                                className="px-2 py-0.5 text-[9px] font-mono font-bold bg-white hover:bg-neutral-50 text-pink-700 border border-neutral-300 rounded-full"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="text-neutral-400 font-sans text-[11px] font-semibold tracking-wider uppercase">
                    No sign-up • 100% Offline Caching • Free Memory Polaroid Scrapbook
                  </p>
                </motion.div>
              )}

              {/* STEP 1: CHOOSE CLIMATE */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest">
                      Step 1 of 4
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-900">
                      🌤️ What is the Weather / Climate?
                    </h2>
                    <p className="text-neutral-500 text-xs md:text-sm font-sans max-w-sm mx-auto">
                      Select the weather so we filter date suggestions perfectly.
                    </p>
                  </div>

                  {/* Climate Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {[
                      { key: 'sunny', label: '☀️ Sunny / Hot', emoji: '☀️', desc: 'Outdoors, ice-creams, breezy strolls' },
                      { key: 'rainy', label: '🌧 Monsoon / Rain', emoji: '🌧', desc: 'Cozy indoors, tea stalls, kitchen fort' },
                      { key: 'cold', label: '❄️ Cold / Chilly', emoji: '❄️', desc: 'Hot ramen, coffee brews, cozy room' },
                      { key: 'windy', label: '🌫 Humid / Windy', emoji: '🌫', desc: 'Golden sunset drive, thrifting walks' }
                    ].map((cli) => (
                      <button
                        key={cli.key}
                        onClick={() => {
                          if (soundEnabled) playPopSound();
                          setSelectedClimate(cli.key as Climate);
                          setCurrentStep(2); // advance to mood
                        }}
                        className={`p-5 rounded-3xl border-4 border-black text-left flex flex-col justify-between space-y-2 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer bg-white ${
                          selectedClimate === cli.key ? 'bg-rose-100 border-rose-500 ring-4 ring-rose-200' : ''
                        }`}
                      >
                        <span className="text-4xl animate-pulse">{cli.emoji}</span>
                        <div>
                          <span className="block font-display font-extrabold text-sm text-neutral-800">
                            {cli.label.split(' ').slice(1).join(' ')}
                          </span>
                          <span className="block text-[10px] text-neutral-400 font-semibold leading-normal">
                            {cli.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quick back */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => {
                        if (soundEnabled) playPopSound();
                        setCurrentStep(0);
                      }}
                      className="px-6 py-3 font-display font-bold uppercase border-4 border-black rounded-xl hover:bg-neutral-100 transition text-xs"
                    >
                      Back to Start
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CHOOSE YOUR MOOD */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-1">
                    <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest">
                      Step 2 of 4
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-900">
                      ⚡ Choose Your Date Vibe
                    </h2>
                    <p className="text-neutral-500 text-xs md:text-sm font-sans max-w-sm mx-auto">
                      Instead of boring filters, pick the vibe you both crave right now.
                    </p>
                  </div>

                  {/* Mood Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {[
                      { key: 'cozy', label: 'Cozy', emoji: '😊', bg: 'hover:bg-amber-100' },
                      { key: 'adventure', label: 'Adventure', emoji: '🤩', bg: 'hover:bg-purple-100' },
                      { key: 'budget', label: 'Budget', emoji: '💸', bg: 'hover:bg-green-100' },
                      { key: 'rainy', label: 'Rainy', emoji: '🌧', bg: 'hover:bg-blue-100' },
                      { key: 'night_owl', label: 'Night Owl', emoji: '🌙', bg: 'hover:bg-indigo-100' },
                      { key: 'outdoors', label: 'Outdoors', emoji: '🌿', bg: 'hover:bg-emerald-100' },
                      { key: 'lazy', label: 'Lazy', emoji: '🍿', bg: 'hover:bg-yellow-100' },
                      { key: 'surprise', label: 'Surprise Me', emoji: '✨', bg: 'hover:bg-rose-100' }
                    ].map((m) => (
                      <button
                        key={m.key}
                        onClick={() => {
                          if (soundEnabled) playPopSound();
                          setSelectedMood(m.key as Mood);
                          setCurrentStep(3); // Auto-advance to budget slider
                        }}
                        className={`p-5 rounded-3xl border-4 border-black text-center flex flex-col items-center justify-center space-y-2 transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                          m.bg
                        } ${selectedMood === m.key ? 'bg-rose-100 border-rose-500 ring-4 ring-rose-200' : 'bg-white'}`}
                      >
                        <span className="text-4xl animate-pulse">{m.emoji}</span>
                        <span className="font-display font-extrabold text-sm text-neutral-800">
                          {m.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Actions bar */}
                  <div className="flex justify-center gap-4 pt-4">
                    <button
                      onClick={() => {
                        if (soundEnabled) playPopSound();
                        setCurrentStep(1);
                      }}
                      className="px-6 py-3 font-display font-bold uppercase border-4 border-black rounded-xl hover:bg-neutral-100 transition text-xs"
                    >
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BUDGET SLIDER */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-8 max-w-md mx-auto py-4"
                >
                  <div className="text-center space-y-1">
                    <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest">
                      Step 3 of 4
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-900">
                      🪙 Budget Slider
                    </h2>
                    <p className="text-neutral-500 text-xs md:text-sm font-sans">
                      Set your wallet comfort level. Emojis will scale with luxury.
                    </p>
                  </div>

                  {/* Interactive Slider Card */}
                  <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-neutral-400">₹0</span>
                      <span className="font-display font-black text-2xl text-rose-600">
                        ₹{selectedBudget === 5000 ? '5000+' : selectedBudget}
                      </span>
                      <span className="font-mono text-xs font-bold text-neutral-400">₹5000+</span>
                    </div>

                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={selectedBudget}
                        onChange={(e) => {
                          setSelectedBudget(parseInt(e.target.value));
                        }}
                        className="w-full h-4 bg-neutral-200 border-4 border-black rounded-full appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                      />
                    </div>

                    <div className="text-center font-display font-bold text-sm text-neutral-700 bg-rose-50/50 p-2 border-2 border-dashed border-rose-200 rounded-xl">
                      Vibe Check: <span className="text-rose-600 font-extrabold">{budgetEmoji}</span>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => {
                        if (soundEnabled) playPopSound();
                        setCurrentStep(2);
                      }}
                      className="px-6 py-3 font-display font-bold uppercase border-4 border-black rounded-xl hover:bg-neutral-100 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (soundEnabled) playPopSound();
                        setCurrentStep(4);
                      }}
                      className="flex-1 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-display font-extrabold uppercase rounded-xl shadow-[3px_3px_0px_0px_rgba(244,63,94,1)] flex items-center justify-center gap-2 transition"
                    >
                      <span>Next Level</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: DISTANCE CAPSULE */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6 max-w-md mx-auto"
                >
                  <div className="text-center space-y-1">
                    <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest">
                      Step 4 of 4
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-900">
                      🌍 Travel Distance
                    </h2>
                    <p className="text-neutral-500 text-xs md:text-sm font-sans">
                      How far are you both willing to venture?
                    </p>
                  </div>

                  {/* Option capsules */}
                  <div className="space-y-3">
                    {[
                      { key: 'stay_home', label: 'Stay Home', emoji: '🏠', desc: 'Pillow forts, kitchens, cozy living room chaos' },
                      { key: 'nearby', label: 'Nearby (Walking distance)', emoji: '🚶', desc: 'Locally sourced street-food lanes, cafes' },
                      { key: 'up_to_10', label: 'Up to 10 km', emoji: '🚗', desc: 'Arcades, bowling alleys, thrift styling' },
                      { key: 'anywhere', label: 'Anywhere (Any adventure)', emoji: '🌍', desc: 'Hill viewpoints, escape rooms, full day out' }
                    ].map((d) => (
                      <button
                        key={d.key}
                        onClick={() => {
                          if (soundEnabled) playPopSound();
                          setSelectedDistance(d.key as Distance);
                        }}
                        className={`w-full p-4 border-4 border-black rounded-2xl text-left flex items-center gap-4 transition-all duration-150 transform hover:-translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                          selectedDistance === d.key
                            ? 'bg-rose-100 border-rose-500 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white hover:bg-neutral-50'
                        }`}
                      >
                        <span className="text-3xl bg-neutral-100 p-2.5 rounded-xl border border-neutral-200 flex-shrink-0">
                          {d.emoji}
                        </span>
                        <div>
                          <span className="block font-display font-extrabold text-sm text-neutral-800">
                            {d.label}
                          </span>
                          <span className="block text-xs text-neutral-400 font-sans mt-0.5">
                            {d.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Actions bar */}
                  <div className="flex items-center justify-between gap-4 pt-4">
                    <button
                      onClick={() => {
                        if (soundEnabled) playPopSound();
                        setCurrentStep(3);
                      }}
                      className="px-6 py-3 font-display font-bold uppercase border-4 border-black rounded-xl hover:bg-neutral-100 transition"
                    >
                      Back
                    </button>
                    <button
                      disabled={!selectedDistance}
                      onClick={() => {
                        prepareSpinChamber();
                        handleStartSpin();
                        setCurrentStep(5); // Spin Chamber
                      }}
                      className={`flex-1 px-6 py-3 font-display font-black uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 transition ${
                        selectedDistance
                          ? 'bg-rose-500 text-white hover:bg-rose-400 cursor-pointer'
                          : 'bg-neutral-200 text-neutral-400 border-neutral-300 shadow-none cursor-not-allowed'
                      }`}
                    >
                      <span>Go to Spin Chamber</span>
                      <Sparkles size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: SPINNING CHAMBER & COMPARER */}
              {currentStep === 5 && (
                <div className="space-y-8 max-w-2xl mx-auto">
                  {/* Real-time Companion Comparer Widget (Rendered dynamically if partnerSpunId is active) */}
                  {partnerSpunId && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-6 bg-amber-50 border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-4"
                    >
                      <div className="inline-block bg-rose-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-black shadow-sm">
                        👩‍❤️‍👨 Couple Matchmaker Room 👩‍❤️‍👨
                      </div>
                      <h3 className="font-display text-xl font-black text-neutral-900 leading-tight">
                        Which Date Wins? Choose Between Your Spins!
                      </h3>
                      <p className="text-xs text-neutral-600 max-w-md mx-auto leading-normal">
                        You spun <strong>Option A</strong>, and <span className="text-rose-600 font-extrabold">{partnerName}</span> spun <strong>Option B</strong>. Click to choose and lock one in!
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
                        {/* Option A (My Spin) */}
                        <div className={`p-4 rounded-2xl border-4 border-black flex flex-col justify-between transition-all ${
                          chosenDateId === mySpunId ? 'bg-rose-100 ring-4 ring-rose-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                        }`}>
                          <div>
                            <span className="text-[10px] font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                              Option A ({currentUser}'s Spin)
                            </span>
                            {(() => {
                              const dateOpt = DATE_POOL.find((d) => d.id === mySpunId);
                              if (!dateOpt) return <p className="text-xs text-neutral-400 mt-2">No spin yet</p>;
                              return (
                                <div className="mt-2 space-y-1">
                                  <h4 className="font-display font-extrabold text-sm">{dateOpt.title}</h4>
                                  <p className="text-[11px] text-neutral-500 line-clamp-2">{dateOpt.activity}</p>
                                  <div className="flex gap-2 text-[10px] font-semibold text-neutral-400">
                                    <span>💰 ₹{dateOpt.budgetVal}</span>
                                    <span>📍 {dateOpt.distanceTag.replace('_', ' ')}</span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                          {mySpunId && (
                            <button
                              onClick={() => {
                                if (soundEnabled) playSuccessSound();
                                setChosenDateId(mySpunId);
                                const matched = DATE_POOL.find((d) => d.id === mySpunId);
                                if (matched) {
                                  setActiveResult(matched);
                                  setShowResult(true);
                                }
                                copyInviteLink(mySpunId);
                              }}
                              className="mt-4 w-full py-2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-display font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition"
                            >
                              Lock In Option A 💖
                            </button>
                          )}
                        </div>

                        {/* Option B (Partner Spin) */}
                        <div className={`p-4 rounded-2xl border-4 border-black flex flex-col justify-between transition-all ${
                          chosenDateId === partnerSpunId ? 'bg-rose-100 ring-4 ring-rose-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                        }`}>
                          <div>
                            <span className="text-[10px] font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                              Option B ({partnerName}'s Spin)
                            </span>
                            {(() => {
                              const dateOpt = DATE_POOL.find((d) => d.id === partnerSpunId);
                              if (!dateOpt) return <p className="text-xs text-neutral-400 mt-2">Partner has not spun yet</p>;
                              return (
                                <div className="mt-2 space-y-1">
                                  <h4 className="font-display font-extrabold text-sm">{dateOpt.title}</h4>
                                  <p className="text-[11px] text-neutral-500 line-clamp-2">{dateOpt.activity}</p>
                                  <div className="flex gap-2 text-[10px] font-semibold text-neutral-400">
                                    <span>💰 ₹{dateOpt.budgetVal}</span>
                                    <span>📍 {dateOpt.distanceTag.replace('_', ' ')}</span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                          {partnerSpunId && (
                            <button
                              onClick={() => {
                                if (soundEnabled) playSuccessSound();
                                setChosenDateId(partnerSpunId);
                                const matched = DATE_POOL.find((d) => d.id === partnerSpunId);
                                if (matched) {
                                  setActiveResult(matched);
                                  setShowResult(true);
                                }
                                copyInviteLink(partnerSpunId);
                              }}
                              className="mt-4 w-full py-2 bg-violet-500 hover:bg-violet-400 text-white text-xs font-display font-black uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition"
                            >
                              Lock In Option B 💜
                            </button>
                          )}
                        </div>
                      </div>

                      {chosenDateId && (
                        <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3 border-2 border-dashed border-emerald-300 rounded-xl">
                          🎉 Locked! Click "Record in Scrapbook" once done, or copy the update link to send to {partnerName}!
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Special Occasion VIP dates list */}
                  {isSpecialDay && !showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-6 bg-gradient-to-br from-pink-50 to-amber-50 border-4 border-pink-500 rounded-3xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] text-center space-y-4"
                    >
                      <div className="inline-block bg-pink-500 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-black shadow-sm animate-bounce">
                        👑 CURATED MILESTONE DATES 👑
                      </div>
                      <h3 className="font-display text-xl font-black text-neutral-900 leading-tight">
                        Curated Date Ideas for {specialOccasionName || 'Your Special Occasion'}
                      </h3>
                      <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed font-semibold">
                        Since today is a special milestone, we unlocked 3 customized chaotic-but-elegant premium date ideas. Select one to lock in instantly, or spin below to let chaotic fate decide!
                      </p>

                      <div className="grid grid-cols-1 gap-3 text-left max-w-md mx-auto pt-2">
                        {DATE_POOL.filter(d => d.isSpecialOccasion).map((dateOpt) => (
                          <button
                            key={dateOpt.id}
                            onClick={() => {
                              if (soundEnabled) playSuccessSound();
                              setActiveResult(dateOpt);
                              setMySpunId(dateOpt.id);
                              setShowResult(true);
                              setConfettiActive(true);
                              setTimeout(() => setConfettiActive(false), 4500);
                            }}
                            className="p-4 rounded-2xl border-3 border-black bg-white hover:bg-pink-50/50 hover:border-pink-500 text-left transition-all duration-150 transform hover:-translate-y-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 cursor-pointer group"
                          >
                            <span className="text-2xl mt-1 select-none">
                              {dateOpt.id === 'special-candlelight' ? '🕯️' : dateOpt.id === 'special-stargazing' ? '🌟' : '🎭'}
                            </span>
                            <div className="space-y-1">
                              <h4 className="font-display font-extrabold text-xs md:text-sm text-neutral-900 group-hover:text-pink-600 transition">
                                {dateOpt.title}
                              </h4>
                              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed font-medium">
                                {dateOpt.activity}
                              </p>
                              <div className="flex gap-2 text-[10px] font-bold text-neutral-400">
                                <span className="text-pink-600">💰 Budget: ₹{dateOpt.budgetVal}</span>
                                <span>📍 {dateOpt.distanceTag.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {!showResult ? (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center max-w-md mx-auto"
                    >
                      {/* Active Filter Pill board */}
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-mono font-bold rounded-full uppercase">
                          Vibe: {selectedMood || 'Surprise'}
                        </span>
                        <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-mono font-bold rounded-full uppercase">
                          Budget: ≤ ₹{selectedBudget}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-mono font-bold rounded-full uppercase">
                          Distance: {selectedDistance?.replace('_', ' ') || 'Anywhere'}
                        </span>
                      </div>

                      {/* Spinning Wheel component */}
                      <SpinningWheel
                        isSpinning={isSpinning}
                        onSpinEnd={handleSpinComplete}
                        triggerSpin={handleStartSpin}
                        targetIndex={winningIndex}
                        segments={wheelSegments}
                      />

                      {!isSpinning && (
                        <button
                          onClick={() => {
                            if (soundEnabled) playPopSound();
                            setCurrentStep(4);
                          }}
                          className="mt-4 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          ← Change Filters & Budget
                        </button>
                      )}

                      {/* Filter matches warning fallback notification */}
                      {filterWarning && (
                        <div className="mt-6 p-4 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl flex items-start gap-3">
                          <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-neutral-600 font-sans leading-snug">
                            No exact dates fit your high filters! We unlocked a premium <span className="font-bold text-rose-600">Surprise Date</span> from our master pool for you instead! ✨
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    /* RESULTS CARD SECTION */
                    <AnimatePresence>
                      {activeResult && (
                        <motion.div
                          initial={{ scale: 0.9, y: 50, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0.9, y: -50, opacity: 0 }}
                          className="bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                        >
                          {/* Inner category header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-neutral-200 pb-4 mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-block text-[10px] font-mono font-extrabold uppercase tracking-widest bg-rose-500 text-white px-2.5 py-1 rounded-full border border-black shadow-sm">
                                category: {activeResult.category}
                              </span>
                              <span className="inline-block text-[10px] font-mono font-extrabold uppercase tracking-widest bg-red-600 text-white px-2.5 py-1 rounded-full border border-black shadow-sm animate-pulse">
                                🔴 CHALLENGE INCOMPLETE
                              </span>
                            </div>
                            <div className="flex gap-1.5">
                              {activeResult.moodTags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Date Title */}
                          <div className="space-y-1 mb-4 text-center md:text-left">
                            <h2 className="font-display text-2xl md:text-3xl font-black text-neutral-900 leading-tight">
                              {activeResult.title}
                            </h2>
                            <p className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1 justify-center md:justify-start mt-1">
                              <MapPin size={12} className="text-rose-500" />
                              <span>Travel: {activeResult.distanceTag.replace('_', ' ')}</span>
                            </p>
                          </div>

                          {/* Quick Stats Block */}
                          <div className="grid grid-cols-3 gap-2 bg-neutral-50 border-2 border-black rounded-2xl p-3 mb-6">
                            <div className="text-center space-y-0.5">
                              <span className="block text-[8px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                                Est. Time
                              </span>
                              <span className="font-display font-extrabold text-xs text-neutral-800 flex items-center justify-center gap-1">
                                <Clock size={12} className="text-rose-500" />
                                {activeResult.estimatedTime}
                              </span>
                            </div>
                            <div className="text-center space-y-0.5 border-x-2 border-neutral-200">
                              <span className="block text-[8px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                                Difficulty
                              </span>
                              <span className="font-display font-extrabold text-xs text-rose-600 flex items-center justify-center gap-0.5">
                                {Array.from({ length: activeResult.difficulty }).map((_, i) => (
                                  <span key={i}>★</span>
                                ))}
                              </span>
                            </div>
                            <div className="text-center space-y-0.5">
                              <span className="block text-[8px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
                                Wallet Level
                              </span>
                              <span className="font-display font-extrabold text-xs text-green-600 font-black">
                                ₹{activeResult.budgetVal}
                              </span>
                            </div>
                          </div>

                          {/* MAIN QUEST DETAILS ACCORDION/BLOCKS */}
                          <div className="space-y-4">
                            {/* Mission */}
                            <div className="p-4 bg-rose-50/50 border-2 border-black rounded-2xl">
                              <h3 className="font-display text-sm font-black uppercase text-rose-700 tracking-wider flex items-center gap-1.5 mb-1">
                                🗺️ Today's Mission
                              </h3>
                              <p className="text-sm font-sans leading-relaxed text-neutral-800 font-semibold">
                                {activeResult.activity}
                              </p>
                            </div>

                            {/* Food Challenge */}
                            <div className="p-4 bg-violet-50/50 border-2 border-black rounded-2xl">
                              <h3 className="font-display text-sm font-black uppercase text-violet-700 tracking-wider flex items-center gap-1.5 mb-1">
                                🍔 Food Challenge
                              </h3>
                              <p className="text-sm font-sans leading-relaxed text-neutral-800">
                                {activeResult.foodChallenge}
                              </p>
                            </div>

                            {/* Mini Challenge */}
                            <div className="p-4 bg-emerald-50/50 border-2 border-black rounded-2xl">
                              <h3 className="font-display text-sm font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5 mb-1">
                                📸 Mini Challenge
                              </h3>
                              <p className="text-sm font-sans leading-relaxed text-neutral-800">
                                {activeResult.miniChallenge}
                              </p>
                            </div>

                            {/* Secret Twist */}
                            <div className="p-4 bg-amber-50/50 border-2 border-black rounded-2xl">
                              <h3 className="font-display text-sm font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5 mb-1">
                                🎁 Secret Twist
                              </h3>
                              <p className="text-sm font-sans leading-relaxed text-neutral-800">
                                {activeResult.secretTwist}
                              </p>
                            </div>

                            {/* Dynamic Conversation cards flipper */}
                            <div className="bg-neutral-900 border-2 border-black p-5 text-white rounded-2xl space-y-3 relative overflow-hidden">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
                                  💬 Conversation Starter
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (soundEnabled) playPopSound();
                                    const poolCount = activeResult.conversationCards.length;
                                    setConvoIndex((prev) => (prev + 1) % poolCount);
                                  }}
                                  className="text-rose-400 hover:text-rose-300 font-mono text-[10px] font-bold uppercase flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded-lg"
                                >
                                  Next Starter
                                </button>
                              </div>
                              <p className="font-display font-semibold text-sm md:text-base leading-relaxed italic text-neutral-100">
                                "{activeResult.conversationCards[convoIndex % activeResult.conversationCards.length]}"
                              </p>
                            </div>

                            {/* Spotify Cassette Sound System */}
                            <div className="bg-neutral-100 border-2 border-black p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-900 rounded-xl border border-black flex items-center justify-center text-2xl flex-shrink-0 animate-bounce [animation-duration:3s]">
                                  {activeResult.playlistEmoji}
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                                    Curated Playlist Vibe
                                  </span>
                                  <h4 className="font-display font-extrabold text-sm text-neutral-800">
                                    {activeResult.playlistName}
                                  </h4>
                                </div>
                              </div>

                              <a
                                href={PLAYLIST_LINKS[activeResult.playlistName] || 'https://open.spotify.com'}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => {
                                  if (soundEnabled) playPopSound();
                                }}
                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black border-2 border-black rounded-xl font-display font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
                              >
                                <Music size={14} />
                                <span>Find Vibe on Spotify</span>
                              </a>
                            </div>
                          </div>

                          {/* Photo required notice */}
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-center text-[11px] text-red-600 font-sans leading-normal">
                            ⚡ <strong>Photo Required:</strong> You must attach a Polaroid photo during recording to complete this challenge, maintain your weekly streak, and earn badges!
                          </div>

                          {/* Primary memory polaroid save & reset action logs */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-dashed border-neutral-200 mt-4">
                            <button
                              onClick={() => {
                                navigateToTab('scrapbook');
                              }}
                              className="flex-grow px-6 py-4 bg-rose-500 hover:bg-rose-400 text-white border-4 border-black rounded-2xl font-display font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
                            >
                              ✍️ Record in scrapbook
                            </button>
                            <button
                              onClick={() => {
                                prepareSpinChamber(activeResult?.id);
                                handleStartSpin();
                              }}
                              className="px-6 py-4 bg-yellow-400 hover:bg-yellow-300 text-black border-4 border-black rounded-2xl font-display font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
                            >
                              🎡 Re-spin Wheel
                            </button>
                            <button
                              onClick={handleResetWheel}
                              className="px-4 py-4 bg-white hover:bg-neutral-100 text-black border-4 border-black rounded-2xl font-display font-black uppercase tracking-wider text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
                            >
                              ⚙️ New Filters
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER COOLDOWN */}
      <footer className="mt-16 text-center text-xs text-neutral-400 font-mono max-w-sm mx-auto px-4 select-none">
        <p className="leading-relaxed">
          Designed with ❤️ for creative couples. No tracking cookies. All state cached locally.
        </p>
      </footer>
    </div>
  );
}
