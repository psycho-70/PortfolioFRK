"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Users,
    Trash2,
    Edit3,
    Briefcase,
    CheckCircle2,
    Clock,
    Search,
    RefreshCw,
    X,
    UploadCloud
} from "lucide-react";

interface TeamMember {
    id?: string;
    name: string;
    position: string;
    image?: string;
    expertise: string;
    skills: string[];
    status: "Available" | "Busy";
    projects: number;
    experience: string;
}

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        position: "",
        expertise: "",
        skills: "",
        status: "Available",
        projects: "0",
        experience: "1+ years",
        image: ""
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchTeam = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_URL}/api/admin/team`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setTeam(data);
            } else {
                console.error("Team API error:", data);
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("adminToken");
                    window.location.href = "/admin/login";
                }
            }
        } catch (error) {
            console.error("Error fetching team members", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const resetForm = () => {
        setFormData({
            name: "",
            position: "",
            expertise: "",
            skills: "",
            status: "Available",
            projects: "0",
            experience: "1+ years",
            image: ""
        });
        setSelectedFile(null);
        setImagePreview("");
        setCurrentMember(null);
    };

    const handleOpenModal = (member: TeamMember | null = null) => {
        if (member) {
            setCurrentMember(member);
            setFormData({
                name: member.name || "",
                position: member.position || "",
                expertise: member.expertise || "",
                skills: Array.isArray(member.skills) ? member.skills.join(", ") : "",
                status: member.status || "Available",
                projects: String(member.projects || 0),
                experience: member.experience || "1+ years",
                image: member.image || ""
            });
            if (member.image) {
                const isExternal = member.image.startsWith("http") || member.image.startsWith("/");
                setImagePreview(isExternal ? member.image : `${API_URL}/uploads/${member.image}`);
            } else {
                setImagePreview("");
            }
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = localStorage.getItem("adminToken");

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("position", formData.position);
            data.append("expertise", formData.expertise);
            data.append("status", formData.status);
            data.append("projects", formData.projects);
            data.append("experience", formData.experience);

            const skillsArray = formData.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            data.append("skills", JSON.stringify(skillsArray));

            if (selectedFile) {
                data.append("image", selectedFile);
            } else if (formData.image) {
                data.append("image", formData.image);
            }

            const url = currentMember?.id
                ? `${API_URL}/api/admin/team/${currentMember.id}`
                : `${API_URL}/api/admin/team`;

            const res = await fetch(url, {
                method: currentMember?.id ? "PATCH" : "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchTeam();
            } else {
                const err = await res.json().catch(() => null);
                alert(err?.error || "Failed to save team member");
            }
        } catch (error) {
            console.error("Error saving team member:", error);
            alert("Error saving team member");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm("Are you sure you want to remove this team member?")) return;

        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${API_URL}/api/admin/team/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setTeam((prev) => prev.filter((m) => m.id !== id));
            } else {
                alert("Failed to delete team member");
            }
        } catch (error) {
            console.error("Error deleting team member", error);
        }
    };

    const filteredTeam = team.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name: string) =>
        name
            .replace(/\./g, " ")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    const resolveImageUrl = (img?: string) => {
        if (!img) return "";
        if (img.startsWith("http") || img.startsWith("/")) return img;
        return `${API_URL}/uploads/${img}`;
    };

    return (
        <div className="space-y-8">
            {/* Header with Search and Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Users className="text-purple-400" size={28} />
                        Team Members
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage all collaborators and team profiles displayed across your portfolio
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={fetchTeam}
                        title="Refresh"
                        className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-purple-500/30 transition-all"
                    >
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/25 active:scale-95"
                    >
                        <Plus size={18} />
                        Add Member
                    </button>
                </div>
            </div>

            {/* Search filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or position..."
                    className="w-full bg-[#111114] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
            </div>

            {/* Team Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse bg-[#111114] border border-white/5 rounded-2xl p-6 h-64" />
                    ))}
                </div>
            ) : filteredTeam.length === 0 ? (
                <div className="bg-[#111114] border border-white/5 rounded-3xl p-16 text-center">
                    <Users className="mx-auto text-gray-600 mb-4" size={48} />
                    <h4 className="text-lg font-bold text-white">No team members found</h4>
                    <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                        {searchQuery ? "Try a different search term." : "Click 'Add Member' above to create your first team profile."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeam.map((member) => {
                        const imgUrl = resolveImageUrl(member.image);
                        return (
                            <div
                                key={member.id || member.name}
                                className="group relative bg-[#111114] border border-white/5 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Top Row: Avatar + Status Badge + Actions */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="relative">
                                            {imgUrl ? (
                                                <img
                                                    src={imgUrl}
                                                    alt={member.name}
                                                    className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-md bg-white/5"
                                                    onError={(e) => {
                                                        (e.target as HTMLElement).style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                                                    {getInitials(member.name)}
                                                </div>
                                            )}
                                            <span
                                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#111114] ${
                                                    member.status === "Available" ? "bg-emerald-400" : "bg-orange-400"
                                                }`}
                                                title={member.status}
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(member)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-purple-600/20 text-gray-400 hover:text-purple-300 transition-colors"
                                                title="Edit member"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                                title="Delete member"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Name & Position */}
                                    <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                        {member.name}
                                    </h4>
                                    <p className="text-sm font-semibold text-purple-400 mt-0.5">
                                        {member.position}
                                    </p>

                                    {/* Expertise description */}
                                    <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                                        {member.expertise || "No bio description provided."}
                                    </p>

                                    {/* Skills pills */}
                                    {member.skills && member.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                            {member.skills.slice(0, 4).map((s) => (
                                                <span
                                                    key={s}
                                                    className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                            {member.skills.length > 4 && (
                                                <span className="px-2 py-0.5 text-[11px] text-gray-500 font-medium">
                                                    +{member.skills.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer meta: Experience & Completed Projects */}
                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase size={14} className="text-gray-500" />
                                        <span>{member.projects} Projects</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-gray-500" />
                                        <span>{member.experience}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/70 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#111114] border border-white/10 w-full max-w-xl rounded-3xl overflow-hidden p-6 sm:p-8 shadow-2xl my-8 relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-6 top-6 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                {currentMember ? "Edit Team Member" : "Add Team Member"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Provide profile details and skills for this collaborator.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 block mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            placeholder="e.g. Nasir Khan"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 block mb-1">
                                            Position / Role *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            required
                                            placeholder="e.g. Software Engineer"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 block mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Busy">Busy</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 block mb-1">
                                            Projects Done
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.projects}
                                            onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                                            min="0"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 block mb-1">
                                            Experience
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            placeholder="e.g. 4+ years"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-400 block mb-1">
                                        Skills (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        placeholder="React, Node.js, UI/UX, TypeScript..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-400 block mb-1">
                                        Expertise &amp; Bio
                                    </label>
                                    <textarea
                                        value={formData.expertise}
                                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                        rows={3}
                                        placeholder="Brief description of their responsibilities, specialities..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-400 block mb-1">
                                        Profile Photo
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-14 h-14 rounded-xl object-cover border border-white/10"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                                                <UploadCloud size={20} />
                                            </div>
                                        )}
                                        <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-purple-400 transition-colors">
                                            Choose Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-semibold text-gray-300 transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-purple-600/25 disabled:opacity-50 text-sm"
                                    >
                                        {isSubmitting ? "Saving..." : currentMember ? "Update Member" : "Save Member"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
