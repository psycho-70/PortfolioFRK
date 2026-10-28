'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  RefreshCw,
  X,
  Pencil,
  Loader2,
} from 'lucide-react';
import { API_BASE_URL as API_URL } from '@/lib/api';

const ICON_OPTIONS = ['Code', 'GraduationCap', 'Briefcase', 'Building2', 'Rocket'] as const;

const ACCENT_PRESETS: [string, string][] = [
  ['#a855f7', '#ec4899'],
  ['#8b5cf6', '#6366f1'],
  ['#d946ef', '#f43f5e'],
  ['#3b82f6', '#06b6d4'],
  ['#10b981', '#14b8a6'],
];

interface Experience {
  id?: string;
  company: string;
  location: string;
  position: string;
  type: string;
  duration: string;
  status: 'current' | 'completed';
  companyType: string;
  from: string;
  to: string;
  icon: string;
  technologies: string[];
  achievements: string[];
  projects: string[];
  skills: string[];
  order?: number;
}

const EMPTY_FORM: Experience = {
  company: '',
  location: '',
  position: '',
  type: 'Remote',
  duration: '',
  status: 'completed',
  companyType: 'Tech Company',
  from: ACCENT_PRESETS[0][0],
  to: ACCENT_PRESETS[0][1],
  icon: 'Code',
  technologies: [],
  achievements: [],
  projects: [],
  skills: [],
};

/* ───────── Token helpers (same as SkillsPage) ───────── */
function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  const keys = ['token', 'adminToken', 'authToken', 'accessToken', 'idToken', 'jwt'];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v && v !== 'undefined' && v !== 'null') return v;
  }
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    const raw = localStorage.getItem(k);
    if (!raw || raw[0] !== '{') continue;
    try {
      const obj = JSON.parse(raw);
      const t =
        obj?.token || obj?.accessToken || obj?.idToken || obj?.jwt ||
        obj?.user?.token || obj?.data?.token;
      if (typeof t === 'string' && t) return t;
    } catch {}
  }
  return null;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = readToken();
  if (!token) {
    console.error('[apiFetch] No token. Keys:', Object.keys(localStorage));
    throw new Error('Not logged in — no token found. Please log in again.');
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    },
    cache: 'no-store',
  });
  console.log(`[apiFetch] ${options.method || 'GET'} ${path} → ${res.status}`);
  return res;
}

/* ───────── Small helpers ───────── */
const toLines = (arr: string[] | string): string =>
  Array.isArray(arr) ? arr.join('\n') : arr || '';

const fromLines = (s: string): string[] =>
  s.split('\n').map((x) => x.trim()).filter(Boolean);

const toCSV = (arr: string[] | string): string =>
  Array.isArray(arr) ? arr.join(', ') : arr || '';

const fromCSV = (s: string): string[] =>
  s.split(',').map((x) => x.trim()).filter(Boolean);

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Experience>(EMPTY_FORM);

  /* ────────── GET ────────── */
  const loadExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/admin/experience');
      if (res.status === 401 || res.status === 403) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || `Unauthorized (${res.status})`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load experience');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  /* ────────── Open modal ────────── */
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (exp: Experience) => {
    setEditingId(exp.id || null);
    setForm({
      ...EMPTY_FORM,
      ...exp,
      technologies: exp.technologies || [],
      achievements: exp.achievements || [],
      projects: exp.projects || [],
      skills: exp.skills || [],
    });
    setIsModalOpen(true);
  };

  /* ────────── POST / PATCH ────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        company: form.company.trim(),
        position: form.position.trim(),
      };

      const res = editingId
        ? await apiFetch(`/api/admin/experience/${editingId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
          })
        : await apiFetch('/api/admin/experience', {
            method: 'POST',
            body: JSON.stringify(payload),
          });

      if (res.status === 401 || res.status === 403) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || `Unauthorized (${res.status})`);
      }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || `HTTP ${res.status}`);
      }

      setIsModalOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadExperiences();
    } catch (e: any) {
      setError(e.message || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  /* ────────── DELETE ────────── */
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const res = await apiFetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
      if (res.status === 401 || res.status === 403) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || `Unauthorized (${res.status})`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setExperiences((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      setError(e.message || 'Failed to delete experience');
    }
  };

  /* ────────── UI ────────── */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-emerald-400" size={28} />
            Work Experience
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Manage positions, achievements and technologies
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadExperiences}
            title="Refresh"
            className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={openCreate}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm"
          >
            <Plus size={18} />
            Add Experience
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-[#111114] border border-white/5 rounded-2xl h-28" />
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-[#111114] border border-white/5 rounded-3xl p-16 text-center">
          <Briefcase className="mx-auto text-gray-600 mb-4" size={48} />
          <h4 className="text-lg font-bold text-white">No experience added yet</h4>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            Add positions, achievements and the tech you used at each job.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <div
              key={exp.id || i}
              className="bg-[#111114] border border-white/5 hover:border-emerald-500/30 p-5 md:p-6 rounded-2xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-lg shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${exp.from}, ${exp.to})`,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-white font-bold text-base md:text-lg truncate">
                        {exp.position}
                      </h4>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          background:
                            exp.status === 'current'
                              ? 'rgba(16,185,129,0.15)'
                              : 'rgba(107,114,128,0.15)',
                          color: exp.status === 'current' ? '#34d399' : '#9ca3af',
                          border: `1px solid ${
                            exp.status === 'current'
                              ? 'rgba(16,185,129,0.3)'
                              : 'rgba(107,114,128,0.3)'
                          }`,
                        }}
                      >
                        {exp.status === 'current' ? 'Current' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mt-0.5 truncate">
                      {exp.company}
                      {exp.companyType && (
                        <span className="text-gray-500"> · {exp.companyType}</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                      {exp.duration && <span>📅 {exp.duration}</span>}
                      {exp.location && <span>📍 {exp.location}</span>}
                      {exp.type && <span>🏢 {exp.type}</span>}
                    </div>
                    {(exp.technologies?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {exp.technologies!.slice(0, 5).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-300"
                          >
                            {t}
                          </span>
                        ))}
                        {exp.technologies!.length > 5 && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
                            +{exp.technologies!.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(exp)}
                    title="Edit"
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    title="Delete"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/70 overflow-y-auto">
          <div className="bg-[#111114] border border-white/10 w-full max-w-3xl rounded-3xl p-6 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Briefcase size={20} className="text-emerald-400" />
              {editingId ? 'Edit Experience' : 'Add Experience'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: company + position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                    placeholder="e.g. Precise Tech"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    required
                    placeholder="e.g. Web Developer"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Row 2: location + duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Canada"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 08/2024 - Present"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Row 3: type + companyType + status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {['Remote', 'On-site', 'Hybrid', 'Internship', 'Freelance'].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Company type
                  </label>
                  <input
                    type="text"
                    value={form.companyType}
                    onChange={(e) => setForm({ ...form, companyType: e.target.value })}
                    placeholder="e.g. Tech Company"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as 'current' | 'completed' })
                    }
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="current">Current</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Row 4: icon + accent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Icon
                  </label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {ICON_OPTIONS.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Accent gradient
                  </label>
                  <div className="flex gap-2">
                    {ACCENT_PRESETS.map(([from, to], idx) => {
                      const on = form.from === from && form.to === to;
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setForm({ ...form, from, to })}
                          className={`h-10 w-10 rounded-xl border-2 transition-all ${
                            on ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${from}, ${to})`,
                          }}
                          aria-label={`Accent ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Achievements (one per line) */}
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Achievements (one per line)
                </label>
                <textarea
                  value={toLines(form.achievements)}
                  onChange={(e) =>
                    setForm({ ...form, achievements: fromLines(e.target.value) })
                  }
                  rows={4}
                  placeholder={'Worked on ERP solutions\nCollaborated with cross-functional teams'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Projects (comma separated) */}
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Notable projects (comma separated)
                </label>
                <input
                  type="text"
                  value={toCSV(form.projects)}
                  onChange={(e) => setForm({ ...form, projects: fromCSV(e.target.value) })}
                  placeholder="Nature Clam, Sowa Tooling"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Technologies (comma separated) */}
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={toCSV(form.technologies)}
                  onChange={(e) => setForm({ ...form, technologies: fromCSV(e.target.value) })}
                  placeholder="JavaScript, TypeScript, Jira"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Skills (comma separated) */}
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Skills gained (comma separated)
                </label>
                <input
                  type="text"
                  value={toCSV(form.skills)}
                  onChange={(e) => setForm({ ...form, skills: fromCSV(e.target.value) })}
                  placeholder="Enterprise Solutions, Agile Development"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving
                    ? 'Saving…'
                    : editingId
                    ? 'Update Experience'
                    : 'Add Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}