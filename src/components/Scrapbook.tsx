/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Memory, Mood } from '../types';
import { Trash2, Heart, Calendar, Image as ImageIcon, Camera } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface ScrapbookProps {
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
  onAddMemory: (memory: Omit<Memory, 'id' | 'timestamp'>) => void;
  currentDateTitle: string;
  currentMood: Mood;
  onUpdateMemoryPhoto?: (id: string, photoBase64: string) => void;
}

export const Scrapbook: React.FC<ScrapbookProps> = ({
  memories,
  onDeleteMemory,
  onAddMemory,
  currentDateTitle,
  currentMood,
  onUpdateMemoryPhoto
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [photoBase64, setPhotoBase64] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
      playPopSound();
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    onAddMemory({
      dateTitle: currentDateTitle || 'Mystery Adventure Date',
      mood: currentMood || 'surprise',
      category: 'surprise',
      notes,
      rating,
      photos: photoBase64 ? [photoBase64] : []
    });

    // Reset
    setNotes('');
    setRating(5);
    setPhotoBase64('');
    setIsAdding(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper for tilted styles based on index
  const getTiltAngle = (index: number) => {
    const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-3', 'rotate-3'];
    return tilts[index % tilts.length];
  };

  return (
    <div className="w-full">
      {/* Scrapbook Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b-2 border-dashed border-neutral-300">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            📸 Our Memory Scrapbook <span className="text-rose-500">📖</span>
          </h2>
          <p className="text-neutral-500 font-sans text-sm mt-1">
            Capture, rate, and immortalize your real date night chaos.
          </p>
        </div>

        {currentDateTitle && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white font-display font-bold uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 transform hover:-translate-y-1 active:translate-y-1 active:shadow-none"
          >
            ✍️ Write Today's Polaroid
          </button>
        )}
      </div>

      {/* Add Memory Form modal-overlay or collapsible */}
      {isAdding && (
        <div className="bg-amber-50 border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 transition-all">
          <h3 className="font-display text-xl font-extrabold text-neutral-900 mb-2 flex items-center gap-2">
            ✏️ Record Today's Adventure
          </h3>
          <p className="text-sm font-semibold text-neutral-600 mb-3">
            Date Night: <span className="text-rose-600 font-bold">{currentDateTitle}</span>
          </p>

          {/* Sticky Notice about Photo uploads */}
          <div className="mb-4 p-3.5 bg-red-100 border-2 border-red-400 rounded-xl text-xs text-red-800 font-sans leading-relaxed">
            <strong className="block font-bold">⚠️ BADGE & WEEKLY STREAK CRITERIA:</strong>
            Till the photo of the challenge is not uploaded, the challenge is considered <strong className="underline">incomplete</strong>. Badges won't be earned, and your weekly streak will not be updated! Add a photo now, or save as draft and upload later.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Notes */}
            <div>
              <label className="block font-display text-sm font-bold text-neutral-700 mb-2">
                What went down? (The highlight, funny fails, weird spots)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Today we accidentally walked 7 km because Google Maps betrayed us..."
                required
                rows={3}
                className="w-full px-4 py-3 border-4 border-black rounded-2xl bg-white text-neutral-800 font-handwriting text-xl placeholder:font-sans placeholder:text-sm focus:outline-none focus:ring-4 focus:ring-rose-200"
              />
            </div>

            {/* Rating & Photo Upload Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating */}
              <div className="bg-white p-4 border-4 border-black rounded-2xl flex flex-col justify-center">
                <label className="block font-display text-sm font-bold text-neutral-700 mb-2 text-center">
                  Adventure Rating (Hearts)
                </label>
                <div className="flex justify-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setRating(val);
                        playPopSound();
                      }}
                      className="transition-transform duration-100 hover:scale-125"
                    >
                      <Heart
                        size={32}
                        className={`stroke-2 ${
                          val <= rating ? 'fill-rose-500 stroke-rose-500' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div className="bg-white p-4 border-4 border-black rounded-2xl flex flex-col items-center justify-center relative min-h-[110px]">
                {photoBase64 ? (
                  <div className="relative w-full h-full flex flex-col items-center">
                    <img
                      src={photoBase64}
                      alt="Uploaded preview"
                      className="max-h-24 object-contain rounded-lg border-2 border-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoBase64('')}
                      className="absolute top-0 right-0 p-1 bg-red-500 hover:bg-red-400 text-white rounded-full border border-black shadow-sm transform translate-x-1 -translate-y-1"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-rose-50 transition-colors py-2 text-center">
                    <Camera size={28} className="text-rose-500 mb-1" />
                    <span className="font-display text-xs font-bold text-neutral-800">
                      Snap & Attach Polaroid Photo
                    </span>
                    <span className="text-[10px] text-neutral-500">Required for streak & badges!</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-3 font-display font-bold uppercase border-4 border-black rounded-xl hover:bg-neutral-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-green-400 hover:bg-green-300 font-display font-bold uppercase rounded-xl border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition"
              >
                💾 Stick in Scrapbook
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scrapbook Empty State */}
      {memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-amber-50/50 border-4 border-dashed border-neutral-300 rounded-3xl text-center">
          <ImageIcon size={48} className="text-neutral-300 mb-3" />
          <p className="font-display text-lg font-bold text-neutral-700">The pages are empty!</p>
          <p className="text-neutral-500 text-sm max-w-sm mt-1">
            Spin the wheel, complete a Date Quest challenge, and hit the 'Log Memory' button on your results to cement your history here.
          </p>
        </div>
      ) : (
        /* The Polaroid Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-2">
          {memories.map((m, idx) => (
            <div
              key={m.id}
              className={`bg-white border-2 border-neutral-200 p-4 pb-6 shadow-xl rounded-sm transform transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-10 relative flex flex-col justify-between ${getTiltAngle(
                idx
              )}`}
            >
              {/* Tape Accent on top */}
              <div className="absolute top-[-14px] left-1/2 transform -translate-x-1/2 w-20 h-7 bg-amber-200/60 border border-amber-300/40 rotate-1 shadow-sm backdrop-blur-[1px] mix-blend-multiply select-none" />

              <div>
                {/* Image Holder / Challenge Completion Status */}
                <div className="bg-neutral-100 aspect-square w-full rounded border border-neutral-200 mb-3 overflow-hidden flex items-center justify-center relative group">
                  {m.photos && m.photos.length > 0 ? (
                    <img
                      src={m.photos[0]}
                      alt={m.dateTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-center p-4">
                      <Camera size={32} className="stroke-1.5 mb-1.5 text-red-500 animate-pulse" />
                      <span className="text-[10px] font-mono tracking-wider uppercase font-extrabold text-red-600 block">
                        🔴 CHALLENGE INCOMPLETE
                      </span>
                      <span className="text-[9px] text-neutral-500 font-medium mt-1 leading-normal max-w-[160px] block">
                        No photo attached! Badges and weekly streak won't be credited.
                      </span>

                      {/* Direct Upload button on empty card slots */}
                      <label className="mt-3 px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white font-display text-[9px] font-black uppercase rounded-lg border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none block">
                        📸 Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && onUpdateMemoryPhoto) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                onUpdateMemoryPhoto(m.id, reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Top-Right Mood Sticker */}
                  <div className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                    {m.mood === 'surprise' ? '✨' : m.mood}
                  </div>

                  {/* Bottom Completed Badge (if photo present) */}
                  {m.photos && m.photos.length > 0 && (
                    <div className="absolute bottom-2 left-2 bg-emerald-500 text-black border border-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                      ✅ COMPLETED
                    </div>
                  )}
                </div>

                {/* Rating Hearts */}
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <Heart
                      key={val}
                      size={16}
                      className={`stroke-1.5 ${
                        val <= m.rating ? 'fill-rose-500 stroke-rose-500' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Title */}
                <h4 className="font-display font-extrabold text-neutral-900 text-md leading-tight mb-1">
                  {m.dateTitle}
                </h4>

                {/* Date */}
                <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mb-3">
                  <Calendar size={11} />
                  <span>{formatDate(m.timestamp)}</span>
                </div>

                {/* Description - physical handwriting font */}
                <p className="font-handwriting text-neutral-800 text-xl leading-snug break-words">
                  "{m.notes}"
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex justify-end pt-4 border-t border-dashed border-neutral-100 mt-4">
                <button
                  onClick={() => {
                    onDeleteMemory(m.id);
                    playPopSound();
                  }}
                  title="Remove Polaroid"
                  className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
