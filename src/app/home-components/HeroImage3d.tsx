'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroImage3DProps {
    src: string;
    className?: string;
}

const vertexShader = /* glsl */ `
    varying vec2 vUv;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uHover;
    void main() {
        vUv = uv;
        vec3 p = position;
        // bulge toward the cursor
        float d = distance(uv, uMouse);
        p.z += smoothstep(0.6, 0.0, d) * 0.4 * uHover;
        // slow idle wave so the image always feels alive
        p.z += sin(uv.x * 4.0 + uTime) * 0.03 + cos(uv.y * 3.0 + uTime * 0.8) * 0.03;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
`;

const fragmentShader = /* glsl */ `
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform float uShift;
    varying vec2 vUv;

    float roundBox(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    void main() {
        vec2 dir = vUv - uMouse;
        float falloff = smoothstep(0.55, 0.0, length(dir));
        vec2 off = normalize(dir + 1e-5) * uShift * falloff;

        // RGB split that grows with cursor speed
        vec4 cr = texture2D(uTexture, vUv + off);
        vec4 cg = texture2D(uTexture, vUv);
        vec4 cb = texture2D(uTexture, vUv - off);
        vec3 col = vec3(cr.r, cg.g, cb.b);

        // soft purple wash from the bottom
        col = mix(col, col * vec3(0.7, 0.45, 1.0), (1.0 - vUv.y) * 0.35);

        float box = roundBox(vUv - 0.5, vec2(0.5), 0.07);
        float mask = 1.0 - smoothstep(0.0, 0.006, box);

        gl_FragColor = vec4(col, cg.a * mask);
        #include <colorspace_fragment>
    }
`;

const HeroImage3D = ({ src, className = '' }: HeroImage3DProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ---------- Renderer / scene / camera ----------
        // antialias OFF + pixelRatio capped = biggest GPU saving
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        renderer.domElement.style.display = 'block';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
        camera.position.z = 7;

        const group = new THREE.Group();
        scene.add(group);

        // ---------- Image plane ----------
        const uniforms = {
            uTexture: { value: null as THREE.Texture | null },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uTime: { value: 0 },
            uHover: { value: 0 },
            uShift: { value: 0 },
        };
        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
        });
        const planeH = 3.8;
        // 24×24 segments (was 48×48) — cuts vertex count by 75 %
        const geometry = new THREE.PlaneGeometry(1, 1, 24, 24);
        const plane = new THREE.Mesh(geometry, material);
        plane.scale.set(planeH * 0.8, planeH, 1);
        group.add(plane);

        const loader = new THREE.TextureLoader();
        const texture = loader.load(src, (tex) => {
            const aspect = tex.image.width / tex.image.height;
            plane.scale.set(planeH * aspect, planeH, 1);
        });
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        uniforms.uTexture.value = texture;

        // Rings removed — keeping image plane + particles only

        // ---------- Floating particles — 60 (was 140) ----------
        const COUNT = 60;
        const pos = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const r = 2.6 + Math.random() * 2.2;
            const a = Math.random() * Math.PI * 2;
            pos[i * 3] = Math.cos(a) * r;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0xd8b4fe,
            size: 0.045,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const particles = new THREE.Points(pGeo, pMat);
        group.add(particles);

        // ---------- Sizing ----------
        const resize = () => {
            const { clientWidth: w, clientHeight: h } = container;
            if (!w || !h) return;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);

        // ---------- Pointer input ----------
        const target = { rx: 0, ry: 0, mx: 0.5, my: 0.5, hover: 0 };
        const current = { rx: 0, ry: 0, mx: 0.5, my: 0.5 };

        const onMove = (e: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = (e.clientY - rect.top) / rect.height;
            target.ry = (nx - 0.5) * 0.9;
            target.rx = (ny - 0.5) * 0.6;
            target.mx = nx;
            target.my = 1 - ny;
            target.hover = 1;
        };
        const onLeave = () => {
            target.rx = 0;
            target.ry = 0;
            target.hover = 0;
        };
        container.addEventListener('pointermove', onMove);
        container.addEventListener('pointerleave', onLeave);

        // ---------- Loop ----------
        const clock = new THREE.Clock();
        let raf = 0;
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
        io.observe(container);

        const tick = () => {
            raf = requestAnimationFrame(tick);
            if (!visible) return;
            const t = clock.getElapsedTime();
            const speed = reduceMotion ? 0 : 1;

            current.rx += (target.rx - current.rx) * 0.07;
            current.ry += (target.ry - current.ry) * 0.07;
            const prevX = current.mx;
            const prevY = current.my;
            current.mx += (target.mx - current.mx) * 0.1;
            current.my += (target.my - current.my) * 0.1;

            // cursor speed drives the RGB split
            const vel = Math.hypot(current.mx - prevX, current.my - prevY);
            uniforms.uShift.value += (Math.min(vel * 2.2, 0.06) - uniforms.uShift.value) * 0.15;
            uniforms.uHover.value += (target.hover - uniforms.uHover.value) * 0.08;
            uniforms.uMouse.value.set(current.mx, current.my);
            uniforms.uTime.value = t * speed;

            group.rotation.x = current.rx;
            group.rotation.y = current.ry + Math.sin(t * 0.6) * 0.08 * speed;
            group.position.y = Math.sin(t * 0.9) * 0.1 * speed;

            particles.rotation.y = t * 0.05 * speed;

            renderer.render(scene, camera);
        };
        tick();

        // ---------- Cleanup ----------
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            container.removeEventListener('pointermove', onMove);
            container.removeEventListener('pointerleave', onLeave);
            geometry.dispose();
            material.dispose();
            texture.dispose();
            pGeo.dispose();
            pMat.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [src]);

    return <div ref={containerRef} className={`touch-pan-y ${className}`} aria-label="Portrait" role="img" />;
};

export default HeroImage3D;