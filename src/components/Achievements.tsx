/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Achievement } from '../types';
import { Trophy, Award, Lock, Sparkles } from 'lucide-react';

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const percentUnlocked = Math.round((unlockedCount / totalCount) * 100) || 0;

  return (
    <div className="w-full">
      {/* Achievements Banner / Bento style summary */}
      <div className="bg-neutral-900 border-4 border-black text-white p-6 rounded-3xl shadow-[5px_5px_0px_0px_rgba(244,63,94,1)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute right-0 top-0 w-44 h-44 bg-rose-500 rounded-full filter blur-[80px] opacity-45 pointer-events-none" />

        <div className="space-y-2 z-10">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            🏆 Date Champion League <span className="text-yellow-400">🔥</span>
          </h2>
          <p className="text-neutral-400 font-sans text-xs md:text-sm max-w-md">
            Complete quests and unlock rare date status insignias. Earn achievements by spinning or logging different dates!
          </p>
        </div>

        {/* Progress Display */}
        <div className="flex flex-col items-center bg-neutral-800/80 p-4 border-2 border-neutral-700 rounded-2xl min-w-[140px] z-10">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Simple circular metric */}
            <span className="font-display font-extrabold text-2xl text-yellow-400">
              {unlockedCount}
            </span>
            <span className="text-[10px] text-neutral-400 absolute bottom-1">/ {totalCount}</span>
          </div>
          <span className="font-mono text-xs font-bold text-neutral-300 mt-1 uppercase tracking-wider">
            {percentUnlocked}% Complete
          </span>
          <div className="w-24 bg-neutral-700 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${percentUnlocked}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`border-4 border-black p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 transform ${
              a.unlocked
                ? 'bg-yellow-50/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                : 'bg-neutral-50 border-dashed border-neutral-300 opacity-60'
            }`}
          >
            {/* Icon Column */}
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 border-black flex-shrink-0 text-2xl relative shadow-md ${
                a.unlocked ? 'bg-yellow-300 animate-pulse' : 'bg-neutral-200'
              }`}
            >
              {a.unlocked ? (
                <>
                  <span>{a.emoji}</span>
                  <div className="absolute top-[-4px] right-[-4px] bg-rose-500 text-[8px] text-white p-0.5 rounded-full border border-black animate-bounce">
                    <Sparkles size={8} />
                  </div>
                </>
              ) : (
                <Lock className="text-neutral-500" size={20} />
              )}
            </div>

            {/* Metadata column */}
            <div className="space-y-1">
              <h4 className="font-display font-extrabold text-neutral-900 text-sm md:text-base leading-tight">
                {a.name}
              </h4>
              <p className="text-neutral-500 text-xs font-sans leading-snug">
                {a.description}
              </p>
              {a.unlocked && a.unlockedAt && (
                <span className="inline-block text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold uppercase tracking-wide">
                  Earned {new Date(a.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
