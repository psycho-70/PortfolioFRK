'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NavSceneProps {
    /** index of the hovered nav link, -1 for none */
    hovered: number;
    className?: string;
}

// one colour per link, purple -> pink
const PALETTE = ['#a855f7', '#9b5cf6', '#b45cf0', '#c05ce8', '#d055d6', '#e04fbf', '#ec4899'];
const IDLE = '#a855f7';

export default function NavScene({ hovered, className = '' }: NavSceneProps) {
    const ref = useRef<HTMLDivElement>(null);
    const state = useRef({ hovered, kick: 0 });

    useEffect(() => {
        state.current.hovered = hovered;
        state.current.kick = 1;
    }, [hovered]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.display = 'block';
        el.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 60);
        camera.position.z = 9;

        const root = new THREE.Group();
        scene.add(root);

        // wireframe torus knot
        const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.42, 180, 24);
        const knotMat = new THREE.MeshBasicMaterial({ color: IDLE, wireframe: true, transparent: true, opacity: 0.35 });
        const knot = new THREE.Mesh(knotGeo, knotMat);
        root.add(knot);

        // drifting particles
        const N = 450;
        const pos = new Float32Array(N * 3);
        for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 18;
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const pMat = new THREE.PointsMaterial({ color: IDLE, size: 0.04, transparent: true, opacity: 0.7, depthWrite: false });
        const dust = new THREE.Points(pGeo, pMat);
        scene.add(dust);

        const resize = () => {
            const w = el.clientWidth;
            const h = el.clientHeight;
            if (!w || !h) return;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            // wide screens: knot sits on the right; narrow: centred and softer
            const wide = camera.aspect > 1.2;
            root.position.set(wide ? 3.6 : 0, wide ? 0 : -2.2, 0);
            knotMat.opacity = wide ? 0.35 : 0.2;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(el);

        const mouse = { x: 0, y: 0 };
        const onMove = (e: PointerEvent) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('pointermove', onMove);

        const goal = new THREE.Color();
        const clock = new THREE.Clock();
        let raf = 0;
        const tick = () => {
            raf = requestAnimationFrame(tick);
            const t = clock.getElapsedTime();
            const s = state.current;
            const m = reduce ? 0 : 1;

            goal.set(s.hovered >= 0 ? PALETTE[s.hovered % PALETTE.length] : IDLE);
            knotMat.color.lerp(goal, 0.07);
            pMat.color.lerp(goal, 0.07);

            s.kick *= 0.92;
            knot.scale.setScalar(1 + s.kick * 0.18 * m);
            knot.rotation.x = t * 0.12 * m + s.kick * 0.4;
            knot.rotation.y = t * 0.18 * m + (s.hovered >= 0 ? s.hovered * 0.25 : 0);

            dust.rotation.y = t * 0.02 * m;
            root.rotation.y += (mouse.x * 0.4 - root.rotation.y) * 0.04;
            root.rotation.x += (mouse.y * 0.25 - root.rotation.x) * 0.04;

            renderer.render(scene, camera);
        };
        tick();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener('pointermove', onMove);
            [knotGeo, pGeo].forEach((g) => g.dispose());
            [knotMat, pMat].forEach((m) => m.dispose());
            renderer.dispose();
            el.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={ref} className={className} aria-hidden />;
}