"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Code2, Plus, Trash2, RefreshCw, X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL

interface Skill {
  id?: string;
  name: string;
  category?: string;
  level?: string;     // "Beginner" | "Intermediate" | "Advanced" | "Expert"
  icon?: string;
  order?: number;
  numericLevel?: number; // 0-100 derived from `level`
}

/* ───────────── Token helper ───────────── */
function readToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1) plain keys (try all common ones)
  const keys = ["token", "adminToken", "authToken", "accessToken", "idToken", "jwt"];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v && v !== "undefined" && v !== "null") return v;
  }

  // 2) nested JSON objects, e.g. localStorage.setItem("admin", JSON.stringify({token, user}))
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    const raw = localStorage.getItem(k);
    if (!raw || raw[0] !== "{") continue;
    try {
      const obj = JSON.parse(raw);
      const t =
        obj?.token ||
        obj?.accessToken ||
        obj?.idToken ||
        obj?.jwt ||
        obj?.user?.token ||
        obj?.data?.token;
      if (typeof t === "string" && t) return t;
    } catch {
      /* not JSON */
    }
  }
  return null;
}

/** fetch wrapper that attaches Authorization: Bearer <token> */
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = readToken();
  if (!token) {
    console.error(
      "[apiFetch] No token in localStorage. Keys present:",
      Object.keys(localStorage)
    );
    throw new Error("Not logged in — no token found. Please log in again.");
  }

  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...((options.headers as Record<string, string>) || {}),
    },
    cache: "no-store",
  });

  console.log(`[apiFetch] ${options.method || "GET"} ${path} → ${res.status}`);
  return res;
}

/* ───────────── Map string level → numeric % ───────────── */
const LEVEL_TO_NUMBER: Record<string, number> = {
  Beginner: 30,
  Intermediate: 55,
  Advanced: 80,
  Expert: 95,
};

const toNumericLevel = (level?: string): number => {
  if (!level) return 80;
  const mapped = LEVEL_TO_NUMBER[level];
  if (mapped !== undefined) return mapped;
  const asNum = Number(level);
  return Number.isFinite(asNum) ? Math.max(0, Math.min(100, asNum)) : 80;
};

/* ───────────── Component ───────────── */
export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    level: "Expert",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- GET ---------- */
  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/skills");
      if (res.status === 401 || res.status === 403) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Unauthorized (${res.status})`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (Array.isArray(data)) {
        setSkills(
          data.map((s: any) => ({
            ...s,
            numericLevel: toNumericLevel(s.level),
          }))
        );
      } else {
        setSkills([]);
      }
    } catch (e: any) {
      console.error("Error fetching skills:", e);
      setError(e.message || "Failed to load skills");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  /* ---------- POST ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/skills", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          level: formData.level,
          icon: "⚡",
          order: skills.length + 1,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Unauthorized (${res.status})`);
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      setIsModalOpen(false);
      setFormData({ name: "", category: "Frontend", level: "Expert" });
      await fetchSkills();
    } catch (err: any) {
      console.error("Error adding skill:", err);
      setError(err.message || "Failed to add skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to remove this skill?")) return;

    try {
      const res = await apiFetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });
      if (res.status === 401 || res.status === 403) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Unauthorized (${res.status})`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error("Error deleting skill:", err);
      setError(err.message || "Failed to delete skill");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Code2 className="text-emerald-400" size={28} />
            Technical Skills
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Manage your active tech stack and proficiency levels
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchSkills}
            title="Refresh"
            className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm"
          >
            <Plus size={18} />
            Add Skill
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-[#111114] border border-white/5 rounded-2xl h-24"
            />
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-[#111114] border border-white/5 rounded-3xl p-16 text-center">
          <Code2 className="mx-auto text-gray-600 mb-4" size={48} />
          <h4 className="text-lg font-bold text-white">No skills added yet</h4>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            Add frameworks, languages, and tools to highlight your competencies.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.id || skill.name}
              className="bg-[#111114] border border-white/5 hover:border-emerald-500/30 p-5 rounded-2xl transition-all duration-300 flex items-center justify-between group"
            >
              <div>
                <h4 className="text-white font-bold text-base group-hover:text-emerald-300 transition-colors">
                  {skill.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 font-medium">
                    {skill.category || "General"}
                  </span>
                  {skill.level && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] text-emerald-400 font-semibold border border-emerald-500/20">
                      {skill.level}
                      {typeof skill.numericLevel === "number" && (
                        <span className="ml-1 opacity-70">
                          · {skill.numericLevel}%
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete skill"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/70">
          <div className="bg-[#111114] border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              Add Technical Skill
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="e.g. Next.js, Docker, GSAP"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack & Backend">
                      Full Stack & Backend
                    </option>
                    <option value="Python & Flask">Python & Flask</option>
                    <option value="Generative AI">Generative AI</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Tools & Design">Tools & Design</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

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
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}