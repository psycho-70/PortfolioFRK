'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useAppContext } from '@/Context/AppContext';

// ─────────────────────────────────────────────────────────────────────────────
// "THE DESCENT" v2 — your purple / fuchsia / pink palette
//
// DARK  → violet deep space: nebula clouds, twinkling stars, shooting stars,
//          a glowing fuchsia core with a dust ring, and a distant spiral galaxy.
// LIGHT → lavender dawn: soft pastel clouds, a lilac planet with a pink
//          atmosphere rim, and a pink sun. Low contrast so text stays readable.
//
// Same scroll story in both: the camera flies forward through the scene and the
// background colour shifts as you scroll.
//
// What's new vs v1
//  • Brand colours only (no cyan / orange / gold).
//  • Twinkling stars (custom shader, soft round points, per-star colour).
//  • Shooting stars (dark), fresnel atmosphere glow on the planet (light).
//  • Glowing core + rotating dust ring, spiral galaxy with a purple→pink gradient.
//  • Core / sun sit to one side so the text side stays clear, plus a soft CSS fade
//    in the middle of the screen for readability.
//  • Background + fog colour drift as you scroll.
//  • Scene is built ONCE and recoloured on theme change (no flash, no rebuild).
//  • Scroll progress is smoothed here, so it works with Lenis and needs no
//    ScrollTrigger. Pauses when the tab is hidden, still frame for "reduce motion".
// ─────────────────────────────────────────────────────────────────────────────

interface Palette {
    bg: number[]; // 3 stops: top of page → middle → bottom
    fogDensity: number;
    blending: THREE.Blending;
    ambient: number;
    coreLight: number;
    coreLightIntensity: number;
    rimLight: number;
    rimLightIntensity: number;

    nebula: number[];
    nebulaOpacity: [number, number];
    nebulaCount: number;

    starColors: number[][]; // far, mid, near
    starCount: number[];
    starOpacity: number[];
    twinkle: number;

    core: number;
    coreGlow: number;
    coreOpacity: number;
    haloOpacity: number;
    fill: number;
    fillOpacity: number;
    dust: number;
    dustOpacity: number;

    galaxyInner: number;
    galaxyOuter: number;

    planet: number;
    planetEmissive: number;
    atmosphere: number;
    atmosphereOpacity: number;
    sunCore: number;
    sunCoreOpacity: number;
    sunHalo: number;
    sunHaloOpacity: number;
    sunRay: number;
    sunRayOpacity: number;

    mask: string;
    progressGradient: string;
}

const DARK: Palette = {
    bg: [0x09061a, 0x12072b, 0x1e0a38],
    fogDensity: 0.02,
    blending: THREE.AdditiveBlending,
    ambient: 0.45,
    coreLight: 0xd946ef,
    coreLightIntensity: 3,
    rimLight: 0xa855f7,
    rimLightIntensity: 0.7,

    nebula: [0x5b21b6, 0x7e22ce, 0xc026d3, 0xdb2777],
    nebulaOpacity: [0.14, 0.3],
    nebulaCount: 22,

    starColors: [
        [0xe9d5ff, 0xc4b5fd, 0xf9a8d4],
        [0xffffff, 0xe9d5ff, 0xf0abfc],
        [0xffffff, 0xfbcfe8],
    ],
    starCount: [1800, 1100, 420],
    starOpacity: [0.7, 0.85, 0.95],
    twinkle: 0.55,

    core: 0xfdf4ff,
    coreGlow: 0xd946ef,
    coreOpacity: 0.8,
    haloOpacity: 0.4,
    fill: 0x7c3aed,
    fillOpacity: 0.14,
    dust: 0xf0abfc,
    dustOpacity: 0.85,

    galaxyInner: 0xf0abfc,
    galaxyOuter: 0x7c3aed,

    planet: 0,
    planetEmissive: 0,
    atmosphere: 0,
    atmosphereOpacity: 0,
    sunCore: 0,
    sunCoreOpacity: 0,
    sunHalo: 0,
    sunHaloOpacity: 0,
    sunRay: 0,
    sunRayOpacity: 0,

    mask: 'radial-gradient(ellipse 65% 70% at 50% 50%, rgba(0,0,0,0.75) 0%, #000 100%)',
    progressGradient: 'linear-gradient(90deg,#7c3aed,#d946ef,#ec4899)',
};

const LIGHT: Palette = {
    bg: [0xf5f0ff, 0xf3e8ff, 0xfce7f3],
    fogDensity: 0.012,
    blending: THREE.NormalBlending,
    ambient: 1.05,
    coreLight: 0xf0abfc,
    coreLightIntensity: 1.2,
    rimLight: 0xf9a8d4,
    rimLightIntensity: 0.5,

    nebula: [0xffffff, 0xe9d5ff, 0xfbcfe8],
    nebulaOpacity: [0.3, 0.5],
    nebulaCount: 24,

    starColors: [
        [0xc4b5fd, 0xd8b4fe],
        [0xa78bfa, 0xf9a8d4],
        [0xa855f7, 0xf472b6],
    ],
    starCount: [500, 300, 120],
    starOpacity: [0.5, 0.55, 0.6],
    twinkle: 0.25,

    core: 0xf5d0fe,
    coreGlow: 0xc084fc,
    coreOpacity: 0.35,
    haloOpacity: 0.22,
    fill: 0xf9a8d4,
    fillOpacity: 0.12,
    dust: 0xc084fc,
    dustOpacity: 0.5,

    galaxyInner: 0xf0abfc,
    galaxyOuter: 0x7c3aed,

    planet: 0xc4b5fd,
    planetEmissive: 0x8b5cf6,
    atmosphere: 0xf472b6,
    atmosphereOpacity: 0.55,
    sunCore: 0xf472b6,
    sunCoreOpacity: 0.45,
    sunHalo: 0xc084fc,
    sunHaloOpacity: 0.22,
    sunRay: 0xf9a8d4,
    sunRayOpacity: 0.12,

    // centre (where text lives) is mostly faded out
    mask: 'radial-gradient(ellipse 65% 70% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.85) 70%, #000 100%)',
    progressGradient: 'linear-gradient(90deg,#7c3aed,#d946ef,#ec4899)',
};

/* ───────────── helpers ───────────── */
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const rgb = (hex: number): [number, number, number] => [
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
];

function makeSoftCircleTexture(size = 128): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.7)');
    g.addColorStop(0.7, 'rgba(255,255,255,0.15)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
}

function makeNebulaTexture(size = 256): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
    g.addColorStop(0.7, 'rgba(255,255,255,0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = size * 0.35 + Math.random() * size * 0.15;
        const r = 8 + Math.random() * 25;
        const x = size / 2 + Math.cos(angle) * dist;
        const y = size / 2 + Math.sin(angle) * dist;
        const gg = ctx.createRadialGradient(x, y, 0, x, y, r);
        gg.addColorStop(0, `rgba(0,0,0,${0.3 + Math.random() * 0.4})`);
        gg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function makeCloudTexture(size = 256): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    for (let i = 0; i < 22; i++) {
        const x = size / 2 + (Math.random() - 0.5) * size * 0.35;
        const y = size / 2 + (Math.random() - 0.5) * size * 0.35;
        const r = size * (0.12 + Math.random() * 0.18);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

/* Twinkling round points (one draw call per layer) */
const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScale;
  uniform float uTwinkle;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 1.0 - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(uTime * (1.0 + aPhase * 0.6) + aPhase * 6.2831));
    vTw = tw;
    vColor = aColor;
    gl_PointSize = max(aSize * uScale / -mv.z * (0.7 + 0.3 * tw), 1.0);
  }
`;
const STAR_FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 1.6);
    gl_FragColor = vec4(vColor, a * uOpacity * vTw);
  }
`;

/* Fresnel rim glow for the planet atmosphere */
const ATMO_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float i = pow(clamp(1.0 + dot(vN, vV), 0.0, 1.0), 3.0);
    gl_FragColor = vec4(uColor, i * uOpacity);
  }
`;

/* ═════════════════════════════════════════════════════════════════════════ */
const ModernPortfolioHero3DScene: React.FC = () => {
    const { darkMode } = useAppContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const mountRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const darkRef = useRef(darkMode);
    darkRef.current = darkMode;
    const applyThemeRef = useRef<((dark: boolean) => void) | null>(null);

    /* ───────────── Build the scene once ───────────── */
    useEffect(() => {
        const mount = mountRef.current;
        const container = containerRef.current;
        if (!mount || !container) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
        } catch {
            return; // no WebGL → page just has no 3D background
        }
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        renderer.setPixelRatio(pixelRatio);
        renderer.toneMapping = THREE.NoToneMapping; // colours stay exactly as in the palette
        renderer.domElement.style.display = 'block';
        mount.appendChild(renderer.domElement);

        /* ---- Scene, rig (moves with scroll) and camera ---- */
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x09061a, 0.02);

        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 800);
        const rig = new THREE.Group();
        rig.position.set(0, 0, 18);
        rig.add(camera);
        scene.add(rig);

        /* ---- Shared uniforms ---- */
        const uTime = { value: 0 };
        const uScale = { value: 800 };

        const makeStarMaterial = () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uTime,
                    uScale,
                    uTwinkle: { value: 0.5 },
                    uOpacity: { value: 1 },
                },
                vertexShader: STAR_VERT,
                fragmentShader: STAR_FRAG,
                transparent: true,
                depthWrite: false,
            });

        const buildPoints = (
            count: number,
            pos: (i: number) => [number, number, number],
            size: (i: number) => number
        ) => {
            const p = new Float32Array(count * 3);
            const s = new Float32Array(count);
            const ph = new Float32Array(count);
            const c = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const [x, y, z] = pos(i);
                p[i * 3] = x;
                p[i * 3 + 1] = y;
                p[i * 3 + 2] = z;
                s[i] = size(i);
                ph[i] = Math.random();
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
            geo.setAttribute('aSize', new THREE.BufferAttribute(s, 1));
            geo.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
            geo.setAttribute('aColor', new THREE.BufferAttribute(c, 3));
            return geo;
        };

        const paint = (geo: THREE.BufferGeometry, hexes: number[], count: number) => {
            const attr = geo.getAttribute('aColor') as THREE.BufferAttribute;
            for (let i = 0; i < attr.count; i++) {
                const [r, g, b] = rgb(hexes[(Math.random() * hexes.length) | 0]);
                attr.setXYZ(i, r, g, b);
            }
            attr.needsUpdate = true;
            geo.setDrawRange(0, Math.min(count, attr.count));
        };

        /* ---- Textures ---- */
        const softCircleTex = makeSoftCircleTexture(128);
        const nebulaTex = makeNebulaTexture(256);
        const cloudTex = makeCloudTexture(256);

        /* ---- Lights ---- */
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        const rimLight = new THREE.DirectionalLight(0xa855f7, 0.7);
        rimLight.position.set(-8, 4, -6);
        scene.add(ambient, rimLight);

        const root = new THREE.Group();
        scene.add(root);

        /* ═════ LAYER 1 — nebula gas (dark) / pastel clouds (light) ═════ */
        const nebulaGroup = new THREE.Group();
        root.add(nebulaGroup);

        interface NebulaSprite {
            sprite: THREE.Sprite;
            basePos: THREE.Vector3;
            speed: number;
            phase: number;
            baseOpacity: number;
        }
        const NEBULA_MAX = 28;
        const nebulaSprites: NebulaSprite[] = [];
        for (let i = 0; i < NEBULA_MAX; i++) {
            const mat = new THREE.SpriteMaterial({ transparent: true, depthWrite: false });
            const sprite = new THREE.Sprite(mat);
            const radius = 5 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            sprite.position.set(x, y, z);
            const s = 4 + Math.random() * 8;
            sprite.scale.set(s, s, 1);
            nebulaGroup.add(sprite);
            nebulaSprites.push({
                sprite,
                basePos: new THREE.Vector3(x, y, z),
                speed: 0.1 + Math.random() * 0.15,
                phase: Math.random() * Math.PI * 2,
                baseOpacity: 0.2,
            });
        }

        /* ═════ LAYER 2–4 — twinkling stars (dark) / soft motes (light) ═════ */
        interface StarLayer {
            points: THREE.Points;
            geo: THREE.BufferGeometry;
            mat: THREE.ShaderMaterial;
            scrollMult: number;
            parallax: number;
        }
        const starLayers: StarLayer[] = [];
        const addStarLayer = (
            maxCount: number,
            spread: number,
            depth: number,
            size: number,
            baseZ: number,
            scrollMult: number,
            parallax: number
        ) => {
            const geo = buildPoints(
                maxCount,
                () => [rand(-0.5, 0.5) * spread, rand(-0.5, 0.5) * spread, rand(-0.5, 0.5) * depth],
                () => size * (0.6 + Math.random() * 0.8)
            );
            const mat = makeStarMaterial();
            const points = new THREE.Points(geo, mat);
            points.position.z = baseZ;
            points.frustumCulled = false;
            scene.add(points);
            starLayers.push({ points, geo, mat, scrollMult, parallax });
        };
        addStarLayer(1800, 260, 90, 0.1, -60, 0.4, 0.3);
        addStarLayer(1100, 200, 70, 0.16, -25, 1.2, 0.8);
        addStarLayer(420, 160, 50, 0.32, -5, 2.8, 1.5);

        /* ═════ LAYER 5 — glowing core (offset to one side) ═════ */
        const coreGroup = new THREE.Group();
        root.add(coreGroup);

        const coreLight = new THREE.PointLight(0xd946ef, 3, 40);
        coreGroup.add(coreLight);

        const coreMat = new THREE.SpriteMaterial({ map: softCircleTex, transparent: true, depthWrite: false });
        const coreSprite = new THREE.Sprite(coreMat);
        coreGroup.add(coreSprite);

        const haloMat = new THREE.SpriteMaterial({ map: nebulaTex, transparent: true, depthWrite: false });
        const halo = new THREE.Sprite(haloMat);
        coreGroup.add(halo);

        const fillMat = new THREE.SpriteMaterial({ map: nebulaTex, transparent: true, depthWrite: false });
        const fill = new THREE.Sprite(fillMat);
        fill.scale.set(30, 30, 1);
        fill.position.z = -5;
        coreGroup.add(fill);

        // Dust ring orbiting the core
        const DUST_COUNT = 600;
        const dustGeo = buildPoints(
            DUST_COUNT,
            () => {
                const a = Math.random() * Math.PI * 2;
                const r = 3.4 + (Math.random() - 0.5) + (Math.random() - 0.5);
                return [Math.cos(a) * r, rand(-0.12, 0.12), Math.sin(a) * r];
            },
            () => 0.07 * (0.6 + Math.random() * 0.8)
        );
        const dustMat = makeStarMaterial();
        const dustRing = new THREE.Points(dustGeo, dustMat);
        dustRing.frustumCulled = false;
        const dustTilt = new THREE.Group();
        dustTilt.rotation.x = 1.15;
        dustTilt.rotation.z = 0.3;
        dustTilt.add(dustRing);
        coreGroup.add(dustTilt);

        /* ═════ LAYER 6a — spiral galaxy (dark only) ═════ */
        const galaxyGroup = new THREE.Group();
        galaxyGroup.position.z = -80;
        galaxyGroup.rotation.x = Math.PI / 2.8;
        scene.add(galaxyGroup);

        const GALAXY_COUNT = 1400;
        const galaxyGeo = buildPoints(
            GALAXY_COUNT,
            (i) => {
                const r = Math.pow(Math.random(), 0.6) * 35;
                const arm = (i % 3) * ((Math.PI * 2) / 3);
                const theta = arm + r * 0.12 + rand(-0.35, 0.35); // arms curve outwards
                return [Math.cos(theta) * r, Math.sin(theta) * r * 0.4, rand(-1, 1)];
            },
            () => 0.6 + Math.random() * 0.6
        );
        const galaxyMat = makeStarMaterial();
        const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
        galaxyPoints.frustumCulled = false;
        galaxyGroup.add(galaxyPoints);

        /* ═════ LAYER 6b — lilac planet + pink sun (light only) ═════ */
        const planetGroup = new THREE.Group();
        planetGroup.position.set(0, -27, -34);
        scene.add(planetGroup);

        const planetMat = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0.05, emissiveIntensity: 0.08 });
        const planetMesh = new THREE.Mesh(new THREE.SphereGeometry(22, 48, 48), planetMat);
        planetGroup.add(planetMesh);

        const atmoMat = new THREE.ShaderMaterial({
            uniforms: { uColor: { value: new THREE.Vector3(1, 0.5, 0.7) }, uOpacity: { value: 0.5 } },
            vertexShader: ATMO_VERT,
            fragmentShader: ATMO_FRAG,
            transparent: true,
            side: THREE.BackSide,
            depthWrite: false,
        });
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(24.5, 48, 48), atmoMat);
        planetGroup.add(atmosphere);

        const sunGroup = new THREE.Group();
        sunGroup.position.set(10, 14, -30);
        scene.add(sunGroup);

        const sunCoreMat = new THREE.SpriteMaterial({ map: softCircleTex, transparent: true, depthWrite: false });
        const sunCore = new THREE.Sprite(sunCoreMat);
        sunGroup.add(sunCore);

        const sunHaloMat = new THREE.SpriteMaterial({ map: nebulaTex, transparent: true, depthWrite: false });
        const sunHalo = new THREE.Sprite(sunHaloMat);
        sunHalo.scale.set(22, 22, 1);
        sunGroup.add(sunHalo);

        const sunRays = new THREE.Group();
        const rayMats: THREE.SpriteMaterial[] = [];
        for (let i = 0; i < 8; i++) {
            const m = new THREE.SpriteMaterial({
                map: nebulaTex,
                transparent: true,
                depthWrite: false,
                rotation: (i / 8) * Math.PI * 2,
            });
            const ray = new THREE.Sprite(m);
            ray.scale.set(28, 1, 1);
            sunRays.add(ray);
            rayMats.push(m);
        }
        sunGroup.add(sunRays);

        const sunLight = new THREE.DirectionalLight(0xfbcfe8, 1.1);
        sunLight.position.set(10, 14, -10);
        scene.add(sunLight);

        /* ═════ Shooting stars (dark only, live in camera space) ═════ */
        interface Shooter {
            sprite: THREE.Sprite;
            active: boolean;
            t: number;
            dur: number;
            from: THREE.Vector3;
            to: THREE.Vector3;
            next: number;
        }
        const shooters: Shooter[] = Array.from({ length: 3 }, (_, i) => {
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: softCircleTex,
                    color: 0xf5d0fe,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    fog: false,
                })
            );
            sprite.scale.set(3.5, 0.08, 1);
            camera.add(sprite);
            return {
                sprite,
                active: false,
                t: 0,
                dur: 1,
                from: new THREE.Vector3(),
                to: new THREE.Vector3(),
                next: 2 + i * 2 + Math.random() * 3,
            };
        });

        /* ---- Animated base sizes (the loop multiplies these by a pulse) ---- */
        const coreBase = { s: 4 };
        const haloBase = { s: 14 };
        const sunBase = { s: 6 };

        /* ---- Theme: recolour in place, no rebuild ---- */
        let isDark = darkRef.current;
        let bgStops: THREE.Color[] = (isDark ? DARK : LIGHT).bg.map((h) => new THREE.Color(h));
        const bgColor = new THREE.Color(bgStops[0]);

        const applyTheme = (dark: boolean) => {
            const p = dark ? DARK : LIGHT;
            isDark = dark;
            bgStops = p.bg.map((h) => new THREE.Color(h));
            (scene.fog as THREE.FogExp2).density = p.fogDensity;

            ambient.intensity = p.ambient;
            rimLight.color.set(p.rimLight);
            rimLight.intensity = p.rimLightIntensity;
            coreLight.color.set(p.coreLight);
            coreLight.intensity = p.coreLightIntensity;

            nebulaSprites.forEach((ns, i) => {
                const m = ns.sprite.material as THREE.SpriteMaterial;
                ns.sprite.visible = i < p.nebulaCount;
                m.map = dark ? nebulaTex : cloudTex;
                m.color.set(p.nebula[i % p.nebula.length]);
                m.blending = p.blending;
                ns.baseOpacity = rand(p.nebulaOpacity[0], p.nebulaOpacity[1]);
                m.opacity = ns.baseOpacity;
                m.needsUpdate = true;
            });

            starLayers.forEach((layer, i) => {
                paint(layer.geo, p.starColors[i], p.starCount[i]);
                layer.mat.uniforms.uOpacity.value = p.starOpacity[i];
                layer.mat.uniforms.uTwinkle.value = p.twinkle;
                layer.mat.blending = p.blending;
                layer.mat.needsUpdate = true;
            });

            coreMat.color.set(p.core);
            coreMat.opacity = p.coreOpacity;
            haloMat.color.set(p.coreGlow);
            haloMat.opacity = p.haloOpacity;
            fillMat.color.set(p.fill);
            fillMat.opacity = p.fillOpacity;
            [coreMat, haloMat, fillMat].forEach((m) => {
                m.blending = p.blending;
                m.needsUpdate = true;
            });

            paint(dustGeo, [p.dust, p.coreGlow], DUST_COUNT);
            dustMat.uniforms.uOpacity.value = p.dustOpacity;
            dustMat.uniforms.uTwinkle.value = p.twinkle;
            dustMat.blending = p.blending;
            dustMat.needsUpdate = true;

            // Galaxy: pink (inner) → purple (outer) gradient
            const gAttr = galaxyGeo.getAttribute('aColor') as THREE.BufferAttribute;
            const gPos = galaxyGeo.getAttribute('position') as THREE.BufferAttribute;
            const inner = new THREE.Color(p.galaxyInner);
            const outer = new THREE.Color(p.galaxyOuter);
            const tmp = new THREE.Color();
            for (let i = 0; i < gAttr.count; i++) {
                const r = Math.hypot(gPos.getX(i), gPos.getY(i) / 0.4) / 35;
                tmp.copy(inner).lerp(outer, Math.min(1, r));
                const [rr, gg, bb] = rgb(tmp.getHex());
                gAttr.setXYZ(i, rr, gg, bb);
            }
            gAttr.needsUpdate = true;
            galaxyMat.uniforms.uOpacity.value = 0.55;
            galaxyMat.uniforms.uTwinkle.value = 0.3;
            galaxyMat.blending = THREE.AdditiveBlending;
            galaxyMat.needsUpdate = true;

            galaxyGroup.visible = dark;
            shooters.forEach((s) => (s.sprite.visible = dark));

            planetGroup.visible = !dark;
            sunGroup.visible = !dark;
            sunLight.visible = !dark;
            if (!dark) {
                planetMat.color.set(p.planet);
                planetMat.emissive.set(p.planetEmissive);
                const [ar, ag, ab] = rgb(p.atmosphere);
                (atmoMat.uniforms.uColor.value as THREE.Vector3).set(ar, ag, ab);
                atmoMat.uniforms.uOpacity.value = p.atmosphereOpacity;
                sunCoreMat.color.set(p.sunCore);
                sunCoreMat.opacity = p.sunCoreOpacity;
                sunHaloMat.color.set(p.sunHalo);
                sunHaloMat.opacity = p.sunHaloOpacity;
                rayMats.forEach((m) => {
                    m.color.set(p.sunRay);
                    m.opacity = p.sunRayOpacity;
                });
            }

            container.style.maskImage = p.mask;
            container.style.setProperty('-webkit-mask-image', p.mask);
            if (progressRef.current) progressRef.current.style.background = p.progressGradient;
        };
        applyThemeRef.current = applyTheme;
        applyTheme(darkRef.current);

        /* ---- Layout (keeps the bright core on one side, away from text) ---- */
        const layout = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            uScale.value = (h * pixelRatio) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

            const landscape = camera.aspect >= 1;
            coreGroup.position.set(landscape ? Math.min(2.8, camera.aspect * 1.5) : 0.9, landscape ? 0.3 : 2.6, 0);
            sunGroup.position.set(landscape ? 10 : 4, 14, -30);
        };
        layout();

        /* ---- GSAP: the scroll story (driven by the smoothed progress below) ---- */
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
        tl
            // Phase 1: approach
            .to(rig.position, { z: 9, duration: 0.4 }, 0)
            .to(haloBase, { s: 20, duration: 0.4 }, 0)
            .to(coreBase, { s: 6, duration: 0.4 }, 0)
            .to(sunBase, { s: 10, duration: 0.4 }, 0)
            // Phase 2: dive into the glow
            .to(rig.position, { z: -4, duration: 0.3 }, 0.4)
            .to(rig.rotation, { z: 0.12, duration: 0.3 }, 0.4)
            .to(coreGroup.scale, { x: 2.2, y: 2.2, z: 2.2, duration: 0.3 }, 0.4)
            .to(sunBase, { s: 14, duration: 0.3 }, 0.4)
            .to(planetGroup.position, { y: -32, duration: 0.3 }, 0.4)
            // Phase 3: break through into open space / sky
            .to(rig.position, { z: -20, duration: 0.3 }, 0.7)
            .to(nebulaGroup.rotation, { z: 1.0, ease: 'power1.inOut', duration: 0.3 }, 0.7)
            .to(coreGroup.scale, { x: 0.25, y: 0.25, z: 0.25, ease: 'power2.in', duration: 0.25 }, 0.7)
            .to(galaxyGroup.rotation, { z: Math.PI * 0.4, duration: 0.3 }, 0.7)
            .to(planetGroup.position, { y: -40, duration: 0.3 }, 0.7)
            .to(sunBase, { s: 20, ease: 'power2.in', duration: 0.3 }, 0.7);

        /* ---- Mouse parallax (camera sits inside the rig, so no clash with scroll) ---- */
        const mouse = { x: 0, y: 0 };
        const camX = gsap.quickTo(camera.position, 'x', { duration: 1.2, ease: 'power3' });
        const camY = gsap.quickTo(camera.position, 'y', { duration: 1.2, ease: 'power3' });

        const onMouse = (e: MouseEvent) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
            camX(mouse.x * 2.2);
            camY(-mouse.y * 1.6);
        };

        /* ---- Scroll ---- */
        let targetScroll = 0;
        let scrollP = 0;
        let scrollVel = 0;

        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            targetScroll = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${targetScroll})`;
            if (reduceMotion) {
                scrollP = targetScroll;
                requestAnimationFrame(() => frame());
            }
        };
        const onResize = () => {
            layout();
            if (reduceMotion) frame();
        };

        /* ---- Frame ---- */
        const clock = new THREE.Clock();

        const frame = () => {
            const t = clock.getElapsedTime();
            uTime.value = t;

            // Smooth scroll → drives the GSAP story + background colour
            if (!reduceMotion) scrollP += (targetScroll - scrollP) * 0.07;
            scrollVel = THREE.MathUtils.lerp(scrollVel, Math.min(Math.abs(targetScroll - scrollP) * 30, 1.5), 0.1);
            tl.progress(scrollP);

            const s2 = scrollP * 2;
            const seg = Math.min(1, Math.floor(s2));
            bgColor.copy(bgStops[seg]).lerp(bgStops[seg + 1], s2 - seg);
            renderer.setClearColor(bgColor, 1);
            (scene.fog as THREE.FogExp2).color.copy(bgColor);

            // Nebula / clouds breathe and drift
            nebulaSprites.forEach((ns) => {
                if (!ns.sprite.visible) return;
                ns.sprite.position.x = ns.basePos.x + Math.sin(t * ns.speed + ns.phase) * 0.4;
                ns.sprite.position.y = ns.basePos.y + Math.cos(t * ns.speed * 0.8 + ns.phase) * 0.5;
                (ns.sprite.material as THREE.SpriteMaterial).opacity =
                    ns.baseOpacity * (0.8 + Math.sin(t * 0.6 + ns.phase) * 0.2);
            });
            nebulaGroup.rotation.y = t * 0.015;

            // Stars: parallax + stretch when scrolling fast
            starLayers.forEach((layer) => {
                layer.points.scale.z = 1 + scrollVel * layer.scrollMult * 2;
                layer.points.position.x = mouse.x * layer.parallax * 2;
                layer.points.position.y = -mouse.y * layer.parallax * 1.5;
                layer.points.rotation.z = t * 0.01 * (1 / layer.scrollMult);
            });

            // Core pulse + dust ring
            const pulse = 1 + Math.sin(t * 1.6) * 0.04;
            coreSprite.scale.set(coreBase.s * pulse, coreBase.s * pulse, 1);
            halo.scale.set(haloBase.s * pulse, haloBase.s * pulse, 1);
            dustRing.rotation.y = t * 0.12;

            if (isDark) {
                galaxyPoints.rotation.z += 0.0004;

                // Shooting stars
                shooters.forEach((sh) => {
                    const m = sh.sprite.material as THREE.SpriteMaterial;
                    if (!sh.active) {
                        if (t > sh.next) {
                            sh.active = true;
                            sh.t = 0;
                            sh.dur = rand(0.7, 1.2);
                            sh.from.set(rand(-16, 6), rand(5, 11), -30);
                            const dx = rand(10, 16);
                            const dy = -rand(4, 7);
                            sh.to.set(sh.from.x + dx, sh.from.y + dy, -30);
                            m.rotation = Math.atan2(dy, dx);
                        }
                    } else {
                        sh.t += 0.016 / sh.dur;
                        const u = Math.min(sh.t, 1);
                        sh.sprite.position.lerpVectors(sh.from, sh.to, u);
                        m.opacity = Math.sin(u * Math.PI) * 0.9;
                        if (sh.t >= 1) {
                            sh.active = false;
                            m.opacity = 0;
                            sh.next = t + rand(3, 8);
                        }
                    }
                });
            } else {
                planetMesh.rotation.y += 0.0006;
                sunRays.rotation.z += 0.0008;
                const sp = 1 + Math.sin(t * 0.9) * 0.03;
                sunCore.scale.set(sunBase.s * sp, sunBase.s * sp, 1);
            }

            renderer.render(scene, camera);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMouse, { passive: true });
        window.addEventListener('resize', onResize);
        onScroll();

        let raf = 0;
        let running = true;
        const loop = () => {
            if (!running) return;
            raf = requestAnimationFrame(loop);
            frame();
        };
        const onVisibility = () => {
            if (document.hidden) {
                running = false;
                cancelAnimationFrame(raf);
            } else if (!running && !reduceMotion) {
                running = true;
                clock.getDelta();
                loop();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);

        if (reduceMotion) {
            running = false;
            frame();
        } else {
            loop();
        }

        /* ---- Cleanup ---- */
        return () => {
            running = false;
            cancelAnimationFrame(raf);
            applyThemeRef.current = null;
            tl.kill();
            gsap.killTweensOf(camera.position);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('resize', onResize);
            document.removeEventListener('visibilitychange', onVisibility);

            scene.traverse((obj) => {
                const o = obj as THREE.Mesh | THREE.Points | THREE.Sprite;
                if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose();
                const mat = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
                if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
                else if (mat) mat.dispose();
            });
            shooters.forEach((s) => (s.sprite.material as THREE.Material).dispose());
            softCircleTex.dispose();
            nebulaTex.dispose();
            cloudTex.dispose();
            renderer.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, []);

    /* ───────────── Theme change: just recolour ───────────── */
    useEffect(() => {
        applyThemeRef.current?.(darkMode);
    }, [darkMode]);

    return (
        <>
            <div
                ref={containerRef}
                aria-hidden="true"
                style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
            >
                <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
            </div>

            {/* Scroll progress bar (transform only, so it never triggers layout) */}
            <div
                ref={progressRef}
                aria-hidden="true"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: 'linear-gradient(90deg,#7c3aed,#d946ef,#ec4899)',
                    transform: 'scaleX(0)',
                    transformOrigin: '0 50%',
                    zIndex: 100,
                    pointerEvents: 'none',
                }}
            />
        </>
    );
};

export default ModernPortfolioHero3DScene;