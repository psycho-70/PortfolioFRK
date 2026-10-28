"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Settings,
    LogOut,
    Globe,
    Code2
} from "lucide-react";

export default function ProjectPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_DEPLOYMENT_URL

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
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
                    localStorage.removeItem("adminToken");
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
        setSelectedFiles(null);
        setCurrentProject(null);
    };

    const handleOpenModal = (project: any = null) => {
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(e.target.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'technologies') {
                const techArray = value.split(',').map(t => t.trim()).filter(t => t !== "");
                data.append(key, JSON.stringify(techArray));
            } else {
                data.append(key, value);
            }
        });

        if (selectedFiles) {
            for (let i = 0; i < selectedFiles.length; i++) {
                data.append("images", selectedFiles[i]);
            }
        }

        try {
            let res;
            if (currentProject) {
                res = await fetch(`${API_URL}/api/admin/projects/${currentProject.id}`, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: data
                });
            } else {
                res = await fetch(`${API_URL}/api/admin/projects`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: data
                });
            }

            if (res.ok) {
                setIsModalOpen(false);
                fetchProjects();
                resetForm();
            }
        } catch (error) {
            console.error("Error saving project", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        const token = localStorage.getItem("adminToken");
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

    return (
        <div className="bg-[#111114] border border-white/5 rounded-3xl p-8 relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white">Portfolio Projects</h3>
                    <p className="text-gray-500 text-sm mt-1">Manage all projects displayed on the homepage</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
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
                            <tr className="text-gray-500 text-sm border-b border-white/5">
                                <th className="pb-4 font-medium">Project Name</th>
                                <th className="pb-4 font-medium">Category</th>
                                <th className="pb-4 font-medium">Links</th>
                                <th className="pb-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {projects.map((project) => (
                                <tr key={project.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-5">
                                        <div className="flex items-center gap-3">
                                            {project.images && project.images.length > 0 ? (
                                                <img
                                                    src={`${API_URL}/uploads/${project.images[0]}`}
                                                    alt={project.title}
                                                    className="w-12 h-8 rounded-lg object-cover bg-gray-800"
                                                />
                                            ) : (
                                                <div className="w-12 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px]">No Img</div>
                                            )}
                                            <div>
                                                <p className="text-white font-medium">{project.title}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{project.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 text-sm">{project.category || "Uncategorized"}</td>
                                    <td className="py-5">
                                        <div className="flex gap-2">
                                            {project.link && <a href={project.link} target="_blank" className="p-1 hover:text-purple-400"><Globe size={14} /></a>}
                                            {project.github && <a href={project.github} target="_blank" className="p-1 hover:text-purple-400"><Code2 size={14} /></a>}
                                        </div>
                                    </td>
                                    <td className="py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(project)}
                                                className="p-2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                <Settings size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
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
                        className="bg-[#111114] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden p-8 shadow-2xl my-8"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">
                            {currentProject ? "Edit Project" : "Add New Project"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Project Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Technologies (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.technologies}
                                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                    placeholder="React, Node.js, Tailwind..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Short Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 h-20"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Long Description (Content Editor)</label>
                                <textarea
                                    value={formData.longDescription}
                                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 h-40"
                                    placeholder="Detailed overview of the project..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">Live Link</label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block mb-1">GitHub Link</label>
                                    <input
                                        type="url"
                                        value={formData.github}
                                        onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Upload Multiple Images</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-600/10 file:text-purple-400 hover:file:bg-purple-600/20"
                                />
                                <p className="text-[10px] text-gray-600 mt-1">First image will be the primary thumbnail.</p>
                            </div>
                        </form>
                        <div className="flex gap-3 pt-6 border-t border-white/5 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-medium transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e: any) => handleSubmit(e)}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-purple-600/20"
                            >
                                {currentProject ? "Update Segment" : "Create Segment"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
