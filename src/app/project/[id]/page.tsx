'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowUpRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Github,
    Lock,
    Tag,
} from 'lucide-react';
import { useAppContext } from '@/Context/AppContext';
import { stripHtml, toDisplayHtml } from '@/lib/richText';

interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    category: string;
    createdAt: string;
    technologies: string[];
    github: string;
    link: string;
    isConfidential: boolean;
    images: string[];
}

const API_URL = (process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '').replace(/\/$/, '');
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072';
const ACCENT = 'linear-gradient(135deg,#a855f7,#ec4899)';

const imageUrl = (img?: string) => {
    if (!img) return FALLBACK_IMAGE;
    return img.startsWith('http') || img.startsWith('/') ? img : `${API_URL}/uploads/${img}`;
};

const formatDate = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function ProjectDetailPage() {
    const params = useParams<{ id: string }>();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { darkMode } = useAppContext();

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [imgIdx, setImgIdx] = useState(0);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();
        setIsLoading(true);
        setError('');
        setNotFound(false);

        (async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/public/projects/${encodeURIComponent(id)}`, {
                    signal: controller.signal,
                });
                if (res.status === 404) {
                    setNotFound(true);
                    return;
                }
                if (!res.ok) throw new Error(`Request failed (${res.status})`);
                const data = await res.json();

                const images = Array.isArray(data.images) && data.images.length > 0
                    ? data.images.map(imageUrl)
                    : data.image
                    ? [imageUrl(data.image)]
                    : [FALLBACK_IMAGE];

                setProject({
                    id: data.id,
                    title: data.title || 'Untitled project',
                    description: data.description || '',
                    longDescription: data.longDescription || '',
                    category: data.category || 'Development',
                    createdAt: data.createdAt || '',
                    technologies: Array.isArray(data.technologies) ? data.technologies : [],
                    github: data.github || '',
                    link: data.link || '',
                    isConfidential: Boolean(data.isConfidential),
                    images,
                });
                setImgIdx(0);
            } catch (e) {
                if ((e as Error).name !== 'AbortError') {
                    console.error('Error fetching project', e);
                    setError('Could not load this project right now.');
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        })();

        return () => controller.abort();
    }, [id, reloadKey]);

    useEffect(() => {
        if (!project) return;
        document.title = `${project.title} | Furqan Khattak`;
    }, [project]);

    const images = project?.images ?? [];
    const hasGallery = images.length > 1;

    const changeImage = (next: number) => {
        if (images.length === 0) return;
        setImgIdx(((next % images.length) + images.length) % images.length);
    };

    useEffect(() => {
        if (!hasGallery) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') changeImage(imgIdx + 1);
            if (e.key === 'ArrowLeft') changeImage(imgIdx - 1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [hasGallery, imgIdx]);

    const articleHtml = useMemo(() => {
        if (!project) return '';
        return toDisplayHtml(project.longDescription) || toDisplayHtml(project.description);
    }, [project]);

    const leadHtml = useMemo(() => {
        if (!project) return '';
        const longText = stripHtml(project.longDescription);
        const shortText = stripHtml(project.description);
        return longText && longText !== shortText ? toDisplayHtml(project.description) : '';
    }, [project]);

    const text = darkMode ? 'text-white' : 'text-gray-900';
    const soft = darkMode ? 'text-gray-300' : 'text-gray-600';
    const muted = darkMode ? 'text-gray-400' : 'text-gray-500';
    const panel = darkMode
        ? 'border-white/10 bg-white/[0.05]'
        : 'border-purple-100 bg-white shadow-lg shadow-purple-900/5';
    const chip = darkMode
        ? 'border-white/15 bg-white/[0.06] text-gray-200'
        : 'border-purple-200 bg-purple-50 text-gray-700';
    const divider = darkMode ? 'border-white/10' : 'border-gray-200';

    return (
        <main className="relative min-h-screen overflow-x-clip px-4 pb-24 pt-24 sm:px-6 md:pt-28">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full"
                    style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(147,51,234,0.2)' : 'rgba(192,132,252,0.24)'} 0%, transparent 70%)` }}
                />
                <div
                    className="absolute -right-40 bottom-10 h-[480px] w-[480px] rounded-full"
                    style={{ background: `radial-gradient(circle, ${darkMode ? 'rgba(236,72,153,0.14)' : 'rgba(249,168,212,0.3)'} 0%, transparent 70%)` }}
                />
            </div>

            <div className="relative z-10 mx-auto max-w-6xl">
                <Link
                    href="/project"
                    className={`mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-transform hover:-translate-x-0.5 ${chip}`}
                >
                    <ArrowLeft className="h-4 w-4" /> All projects
                </Link>

                {isLoading && (
                    <div className="animate-pulse space-y-6">
                        <div className={`h-10 w-3/4 rounded-xl ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                        <div className={`h-5 w-1/2 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                        <div className={`aspect-[16/9] rounded-3xl ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                        <div className={`h-4 w-full rounded ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                        <div className={`h-4 w-5/6 rounded ${darkMode ? 'bg-white/10' : 'bg-purple-100'}`} />
                    </div>
                )}

                {!isLoading && notFound && (
                    <div className={`rounded-3xl border p-10 text-center ${panel}`}>
                        <h1 className={`text-3xl font-black ${text}`}>Project not found</h1>
                        <p className={`mx-auto mt-3 max-w-md ${soft}`}>
                            This project may have been removed or the link is incorrect.
                        </p>
                        <Link
                            href="/project"
                            className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-105"
                            style={{ background: ACCENT }}
                        >
                            <ArrowLeft className="h-4 w-4" /> Back to projects
                        </Link>
                    </div>
                )}

                {!isLoading && !notFound && error && (
                    <div className={`rounded-3xl border p-10 text-center ${panel}`}>
                        <h1 className={`text-2xl font-bold ${text}`}>Something went wrong</h1>
                        <p className={`mx-auto mt-3 max-w-md ${soft}`}>{error}</p>
                        <button
                            type="button"
                            onClick={() => setReloadKey((k) => k + 1)}
                            className="mt-8 rounded-full px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-105"
                            style={{ background: ACCENT }}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !notFound && !error && project && (
                    <motion.article initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
                        <header>
                            <div className="flex flex-wrap items-center gap-3">
                                <span
                                    className="rounded-full px-4 py-1 text-sm font-semibold text-white shadow-lg shadow-purple-500/20"
                                    style={{ background: ACCENT }}
                                >
                                    {project.category}
                                </span>
                                {formatDate(project.createdAt) && (
                                    <span className={`flex items-center text-sm ${muted}`}>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {formatDate(project.createdAt)}
                                    </span>
                                )}
                                {project.isConfidential && (
                                    <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${chip}`}>
                                        <Lock className="h-3.5 w-3.5" /> Confidential
                                    </span>
                                )}
                            </div>

                            <h1 className={`mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl ${text}`}>
                                {project.title}
                            </h1>

                            {leadHtml && (
                                <div
                                    className={`project-rich mt-5 max-w-3xl text-lg ${soft}`}
                                    dangerouslySetInnerHTML={{ __html: leadHtml }}
                                />
                            )}

                            <div className="mt-7 flex flex-wrap gap-3">
                                {project.isConfidential ? (
                                    <div className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm ${panel} ${soft}`}>
                                        <Lock className="h-5 w-5 shrink-0 text-purple-500" />
                                        Demo and source are private for this project. Contact me to learn more.
                                    </div>
                                ) : (
                                    <>
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-transform hover:scale-105"
                                                style={{ background: ACCENT }}
                                            >
                                                <ExternalLink className="h-4 w-4" /> Live demo
                                                <ArrowUpRight className="h-4 w-4" />
                                            </a>
                                        )}
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 font-semibold transition-transform hover:scale-105 ${chip}`}
                                            >
                                                <Github className="h-4 w-4" /> View code
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </header>

                        {/* Gallery */}
                        <section className={`mt-10 overflow-hidden rounded-3xl border ${panel}`} aria-label="Project screenshots">
                            <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                                <Image
                                    key={images[imgIdx]}
                                    src={images[imgIdx]}
                                    alt={`${project.title} – image ${imgIdx + 1}`}
                                    fill
                                    priority
                                    unoptimized
                                    sizes="(max-width: 1024px) 100vw, 1100px"
                                    className="object-cover"
                                />
                                {hasGallery && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="Previous image"
                                            onClick={() => changeImage(imgIdx - 1)}
                                            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-transform hover:scale-110 sm:left-5"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Next image"
                                            onClick={() => changeImage(imgIdx + 1)}
                                            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-transform hover:scale-110 sm:right-5"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                        <span className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
                                            {imgIdx + 1} / {images.length}
                                        </span>
                                    </>
                                )}
                            </div>

                            {hasGallery && (
                                <div className="custom-scrollbar flex gap-3 overflow-x-auto p-3 sm:p-4">
                                    {images.map((img, i) => (
                                        <button
                                            key={`${img}-${i}`}
                                            type="button"
                                            aria-label={`Show image ${i + 1}`}
                                            aria-pressed={i === imgIdx}
                                            onClick={() => setImgIdx(i)}
                                            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                                                i === imgIdx
                                                    ? 'ring-2 ring-purple-500 ring-offset-2 ' + (darkMode ? 'ring-offset-[#0a0a0c]' : 'ring-offset-white')
                                                    : 'opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <Image src={img} alt="" fill unoptimized sizes="120px" className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Content + facts */}
                        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
                            <section>
                                <h2 className={`mb-5 text-sm font-bold uppercase tracking-[0.2em] ${muted}`}>Project overview</h2>
                                <div className="project-rich" dangerouslySetInnerHTML={{ __html: articleHtml }} />
                            </section>

                            <aside className="space-y-6">
                                <div className={`rounded-3xl border p-6 ${panel}`}>
                                    <h2 className={`mb-4 text-sm font-bold uppercase tracking-[0.2em] ${muted}`}>Details</h2>
                                    <dl className="space-y-4 text-sm">
                                        <div>
                                            <dt className={muted}>Category</dt>
                                            <dd className={`mt-1 font-semibold ${text}`}>{project.category}</dd>
                                        </div>
                                        {formatDate(project.createdAt) && (
                                            <div>
                                                <dt className={muted}>Published</dt>
                                                <dd className={`mt-1 font-semibold ${text}`}>{formatDate(project.createdAt)}</dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className={muted}>Screenshots</dt>
                                            <dd className={`mt-1 font-semibold ${text}`}>{images.length}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {project.technologies.length > 0 && (
                                    <div className={`rounded-3xl border p-6 ${panel}`}>
                                        <h2 className={`mb-4 flex items-center text-sm font-bold uppercase tracking-[0.2em] ${muted}`}>
                                            <Tag className="mr-2 h-4 w-4" /> Technologies
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech) => (
                                                <span key={tech} className={`rounded-full border px-3 py-1 text-sm font-medium ${chip}`}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!project.isConfidential && (project.link || project.github) && (
                                    <div className={`space-y-3 rounded-3xl border p-6 ${panel}`}>
                                        <h2 className={`text-sm font-bold uppercase tracking-[0.2em] ${muted}`}>Links</h2>
                                        {project.link && (
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center justify-between border-b pb-3 text-sm font-semibold transition-colors hover:text-purple-500 ${divider} ${text}`}
                                            >
                                                Live demo <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center justify-between text-sm font-semibold transition-colors hover:text-purple-500 ${text}`}
                                            >
                                                Source code <Github className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </aside>
                        </div>
                    </motion.article>
                )}
            </div>
        </main>
    );
}
