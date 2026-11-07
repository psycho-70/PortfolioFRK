"use client";
import { getAdminToken, clearAdminToken } from "@/lib/adminAuth";
import { stripHtml } from "@/lib/richText";
import RichTextEditor from "@/Components/RichTextEditor/RichTextEditor";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Settings,
    LogOut,
    Globe,
    Code2
} from "lucide-react";

// Vercel rejects request bodies larger than ~4.5MB, so keep the total image size under this.
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

// Shrinks large photos in the browser (max 1600px, JPEG) so uploads stay under the limit.
const compressImage = (file: File, maxSize = 1600, quality = 0.8): Promise<File> =>
    new Promise((resolve) => {
        if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
            return resolve(file);
        }
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(file);
            ctx.fillStyle = "#ffffff"; // avoids black backgrounds for transparent PNGs
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
                (blob) => {
                    if (!blob || blob.size >= file.size) return resolve(file);
                    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
                    resolve(new File([blob], name, { type: "image/jpeg" }));
                },
                "image/jpeg",
                quality
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };
        img.src = url;
    });

const formatMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

export default function ProjectPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState("");
    const [currentProject, setCurrentProject] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        longDescription: "",
        link: "",
        github: "",
        category: "",
        technologies: ""
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // const API_URL = (process.env.NEXT_PUBLIC_DEPLOYMENT_URL || "").replace(/\/$/, "");
    const API_URL = (process.env.NEXT_PUBLIC_DEPLOYMENT_URL || "").replace(/\/$/, "");

    // New uploads are full Cloudinary URLs; older records only stored a filename.
    const getImageSrc = (img: string) =>
        img.startsWith("http") ? img : `${API_URL}/uploads/${img}`;

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const token = getAdminToken();
            const res = await fetch(`${API_URL}/api/admin/projects`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
            } else {
                console.error("Projects API error:", data);
                setProjects([]);
                if (res.status === 401 || res.status === 403) {
                    clearAdminToken();
                    window.location.href = "/admin/login";
                }
            }
        } catch (error) {
            console.error("Error fetching projects", error);
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const resetForm = () => {
        setFormData({ title: "", description: "", longDescription: "", link: "", github: "", category: "", technologies: "" });
        setSelectedFiles([]);
        setCurrentProject(null);
        setFormError("");
    };

    const handleOpenModal = (project: any = null) => {
        setFormError("");
        setSelectedFiles([]);
        if (project) {
            setCurrentProject(project);
            setFormData({
                title: project.title || "",
                description: project.description || "",
                longDescription: project.longDescription || "",
                link: project.link || "",
                github: project.github || "",
                category: project.category || "",
                technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : ""
            });
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) {
            setSelectedFiles([]);
            return;
        }
        setFormError("");
        const compressed = await Promise.all(files.map((f) => compressImage(f)));
        const total = compressed.reduce((sum, f) => sum + f.size, 0);
        if (total > MAX_TOTAL_BYTES) {
            setFormError(
                `Selected images total ${formatMB(total)} MB. Please keep the total under ${formatMB(MAX_TOTAL_BYTES)} MB (choose fewer or smaller images).`
            );
        }
        setSelectedFiles(compressed);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        if (!stripHtml(formData.description)) {
            setFormError("Short description is required.");
            return;
        }

        const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
        if (totalSize > MAX_TOTAL_BYTES) {
            setFormError(
                `Images total ${formatMB(totalSize)} MB. Please keep the total under ${formatMB(MAX_TOTAL_BYTES)} MB.`
            );
            return;
        }

        const token = getAdminToken();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'technologies') {
                const techArray = value.split(',').map(t => t.trim()).filter(t => t !== "");
                data.append(key, JSON.stringify(techArray));
            } else {
                data.append(key, value);
            }
        });

        selectedFiles.forEach((file) => data.append("images", file));

        setIsSaving(true);
        setFormError("");
        try {
            const url = currentProject
                ? `${API_URL}/api/admin/projects/${currentProject.id}`
                : `${API_URL}/api/admin/projects`;

            // Don't set Content-Type: the browser adds the multipart boundary automatically.
            const res = await fetch(url, {
                method: currentProject ? "PATCH" : "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchProjects();
            } else {
                const err = await res.json().catch(() => null);
                setFormError(err?.error || `Request failed (${res.status})`);
            }
        } catch (error) {
            console.error("Error saving project", error);
            setFormError("Could not reach the server. Check your connection and try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        const token = getAdminToken();
        try {
            const res = await fetch(`${API_URL}/api/admin/projects/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchProjects();
        } catch (error) {
            console.error("Error deleting project", error);
        }
    };

    const selectedTotal = selectedFiles.reduce((sum, f) => sum + f.size, 0);

    return (
        <div className="bg-[var(--admin-panel)] border border-[var(--admin-border-soft)] rounded-3xl p-4 sm:p-6 lg:p-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h3 className="text-xl font-bold text-[var(--admin-text)]">Portfolio Projects</h3>
                    <p className="text-[var(--admin-muted)] text-sm mt-1">Manage all projects displayed on the homepage</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 w-full sm:w-auto"
                >
                    <Plus size={20} /> Add Project
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">Loading projects...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[var(--admin-muted)] text-sm border-b border-[var(--admin-border-soft)]">
                                <th className="pb-4 font-medium">Project Name</th>
                                <th className="pb-4 font-medium">Category</th>
                                <th className="pb-4 font-medium">Links</th>
                                <th className="pb-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--admin-border-soft)]">
                            {projects.map((project) => (
                                <tr key={project.id} className="group hover:bg-[var(--admin-soft-2)] transition-colors">
                                    <td className="py-5">
                                        <div className="flex items-center gap-3">
                                            {project.images && project.images.length > 0 ? (
                                                <img
                                                    src={getImageSrc(project.images[0])}
                                                    alt={project.title}
                                                    className="w-12 h-8 rounded-lg object-cover bg-[var(--admin-soft-3)]"
                                                />
                                            ) : (
                                                <div className="w-12 h-8 rounded-lg bg-[var(--admin-soft-3)] flex items-center justify-center text-[10px] text-[var(--admin-muted)]">No Img</div>
                                            )}
                                            <div>
                                                <p className="text-[var(--admin-text)] font-medium">{project.title}</p>
                                                <p className="text-xs text-[var(--admin-muted)] truncate max-w-[200px]">{stripHtml(project.description)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 text-sm">{project.category || "Uncategorized"}</td>
                                    <td className="py-5">
                                        <div className="flex gap-2">
                                            {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="p-1 hover:text-purple-600 dark:hover:text-purple-400"><Globe size={14} /></a>}
                                            {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="p-1 hover:text-purple-600 dark:hover:text-purple-400"><Code2 size={14} /></a>}
                                        </div>
                                    </td>
                                    <td className="py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(project)}
                                                className="p-2 text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors"
                                            >
                                                <Settings size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 text-[var(--admin-muted)] hover:text-red-500 transition-colors"
                                            >
                                                <LogOut size={18} className="rotate-90" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[var(--admin-panel)] border border-[var(--admin-border)] w-full max-w-2xl rounded-2xl overflow-hidden p-4 sm:p-6 lg:p-8 shadow-2xl my-8"
                    >
                        <h3 className="text-2xl font-bold text-[var(--admin-text)] mb-6">
                            {currentProject ? "Edit Project" : "Add New Project"}
                        </h3>
                        <form
                            id="project-form"
                            onSubmit={handleSubmit}
                            className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[var(--admin-muted)] block mb-1">Project Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full bg-[var(--admin-soft)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--admin-muted)] block mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-[var(--admin-soft)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-[var(--admin-muted)] block mb-1">Technologies (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.technologies}
                                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                    placeholder="React, Node.js, Tailwind..."
                                    className="w-full bg-[var(--admin-soft)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-[var(--admin-muted)] block mb-1">Short Description</label>
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
                                    placeholder="A one-paragraph summary shown on the project card…"
                                    minHeight={110}
                                    ariaLabel="Short description"
                                />
                                <p className="text-[10px] text-[var(--admin-faint)] mt-1">
                                    Shown on the project card and at the top of the project page.
                                </p>
                            </div>

                            <div>
                                <label className="text-xs text-[var(--admin-muted)] block mb-1">Long Description (Content Editor)</label>
                                <RichTextEditor
                                    value={formData.longDescription}
                                    onChange={(html) => setFormData((prev) => ({ ...prev, longDescription: html }))}
                                    placeholder="Detailed overview — use headings, lists, links and quotes to structure the story…"
                                    minHeight={220}
                                    ariaLabel="Long description"
                                />
                                <p className="text-[10px] text-[var(--admin-faint)] mt-1">
                                    Full case study shown on the project detail page. Leave empty to reuse the short description.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-[var(--admin-muted)] block mb-1">Live Link</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full bg-[var(--admin-soft)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--admin-muted)] block mb-1">GitHub Link</label>
                                    <input
                                        type="url"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        className="w-full bg-[var(--admin-soft)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-[var(--admin-muted)] block mb-1">Upload Multiple Images</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-[var(--admin-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-600/10 file:text-purple-600 dark:text-purple-400 hover:file:bg-purple-600/20"
                                />
                                <p className="text-[10px] text-[var(--admin-faint)] mt-1">
                                    First image will be the primary thumbnail. Images are resized automatically; total must stay under {formatMB(MAX_TOTAL_BYTES)} MB.
                                    {currentProject && " Uploading new images replaces the existing ones."}
                                </p>
                                {selectedFiles.length > 0 && (
                                    <p className="text-[11px] text-[var(--admin-muted)] mt-1">
                                        {selectedFiles.length} image{selectedFiles.length > 1 ? "s" : ""} selected ({formatMB(selectedTotal)} MB)
                                    </p>
                                )}
                            </div>

                            {formError && (
                                <div className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                    {formError}
                                </div>
                            )}
                        </form>
                        <div className="flex gap-3 pt-6 border-t border-[var(--admin-border-soft)] mt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 rounded-xl bg-[var(--admin-soft)] hover:bg-[var(--admin-hover)] font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="project-form"
                                disabled={isSaving}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-[var(--admin-text)] font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSaving ? "Saving..." : currentProject ? "Update Segment" : "Create Segment"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}