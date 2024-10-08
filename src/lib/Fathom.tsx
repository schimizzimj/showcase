'use client';

import { load, trackPageview } from "fathom-client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from 'next/navigation';

const FATHOM_SITE_ID = 'FOJEAWOJ';

function TrackPageView () {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        load(FATHOM_SITE_ID, {
            includedDomains: ['schimizzi.io'],
            auto: false,
        });
    }, []);

    useEffect(() => {
        if (!pathname) return;

        trackPageview({
            url: `${pathname}${searchParams}`,
            referrer: document.referrer,
        });
    }, [pathname, searchParams]);

    return null;
}

export default function Fathom() {
    return (
        <Suspense fallback={null}>
            <TrackPageView />
        </Suspense>
    );
}