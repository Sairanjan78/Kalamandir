import React, { useState, useRef, useEffect } from 'react';

const steps = [
    {
        num: '01',
        icon: '✦',
        title: 'Precision',
        desc: 'Every stroke is intentional, guided by decades of ancestral knowledge passed through generations.',
    },
    {
        num: '02',
        icon: '◈',
        title: 'Patience',
        desc: 'Complex designs can take weeks to complete, requiring immense focus and unwavering dedication.',
    },
    {
        num: '03',
        icon: '❧',
        title: 'Soul',
        desc: "More than just art — it's a piece of the artist's heart, culture, and story shared with you.",
    },
];

const ArtProcess = () => {
    const videoUrl = "/pic/making_process.mp4";
    const posterUrl = "/pic/poster_image.jpeg";
    const videoRef = useRef(null);
    const sectionRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    // Scroll entrance animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Auto-cycle steps
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep(prev => (prev + 1) % steps.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    // Video events
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const onCanPlay = () => setIsLoading(false);
        const onError = () => { setIsLoading(false); setHasError(true); };
        video.addEventListener('canplay', onCanPlay);
        video.addEventListener('error', onError);
        video.load();
        return () => {
            video.removeEventListener('canplay', onCanPlay);
            video.removeEventListener('error', onError);
        };
    }, []);

    return (
        <section className={`art-process-section ap-dark ${visible ? 'ap-visible' : ''}`} ref={sectionRef}>

            {/* Decorative blobs */}
            <div className="ap-blob ap-blob-1" />
            <div className="ap-blob ap-blob-2" />

            {/* Header */}
            <div className="ap-header">
                <span className="ap-tag">Craftsmanship</span>
                <h2 className="ap-title">The Art of Creation</h2>
                <p className="ap-subtitle">A glimpse into the meticulous process behind our handmade masterpieces.</p>
            </div>

            {/* Body */}
            <div className="ap-body">

                {/* Video */}
                <div className="ap-video-side">
                    <div className="ap-video-frame">
                        <div className="ap-frame-glow" />

                        {isLoading && (
                            <div className="ap-overlay-state">
                                <div className="ap-spinner" />
                                <span>Loading…</span>
                            </div>
                        )}
                        {hasError && (
                            <div className="ap-overlay-state">
                                <span className="ap-error-icon">⚠</span>
                                <p>Video unavailable</p>
                                <button onClick={() => window.location.reload()}>Retry</button>
                            </div>
                        )}

                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className="ap-video"
                            poster={posterUrl}
                            style={{ display: hasError ? 'none' : 'block' }}
                        >
                            <source src={videoUrl} type="video/mp4" />
                        </video>

                        {/* Corner accents */}
                        <span className="ap-corner ap-tl" />
                        <span className="ap-corner ap-tr" />
                        <span className="ap-corner ap-bl" />
                        <span className="ap-corner ap-br" />
                    </div>

                    {/* Floating badge */}
                    <div className="ap-badge">
                        <span className="ap-badge-icon">🏺</span>
                        <div>
                            <strong>100% Handmade</strong>
                            <small>Certified Artisans</small>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="ap-steps-side">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`ap-step ${activeStep === i ? 'ap-step-active' : ''}`}
                            onClick={() => setActiveStep(i)}
                        >
                            <div className="ap-step-icon-wrap">
                                <span className="ap-step-icon">{step.icon}</span>
                            </div>
                            <div className="ap-step-body">
                                <div className="ap-step-meta">
                                    <span className="ap-step-num">{step.num}</span>
                                    <h3 className="ap-step-title">{step.title}</h3>
                                </div>
                                <div className={`ap-step-desc ${activeStep === i ? 'open' : ''}`}>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Progress dots */}
                    <div className="ap-dots">
                        {steps.map((_, i) => (
                            <button
                                key={i}
                                className={`ap-dot ${activeStep === i ? 'active' : ''}`}
                                onClick={() => setActiveStep(i)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArtProcess;
