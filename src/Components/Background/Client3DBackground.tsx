'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Hero3DScene = dynamic(() => import('./Hero3DScene'), { ssr: false });

const Client3DBackground = () => {
    return (
        <>
            {/* Fixed 3D WebGL scene — transparent so grid/orbs show through */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Hero3DScene />
            </div>

            {/* Full-page animated colour orbs — float behind every section */}
            <div className="page-orbs" aria-hidden="true">
                <div className="page-orbs__blob page-orbs__blob--1" />
                <div className="page-orbs__blob page-orbs__blob--2" />
                <div className="page-orbs__blob page-orbs__blob--3" />
                <div className="page-orbs__blob page-orbs__blob--4" />
            </div>
        </>
    );
};

export default Client3DBackground;
