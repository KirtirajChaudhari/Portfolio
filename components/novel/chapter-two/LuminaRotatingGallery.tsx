"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

/* ════════════════════════════════════════ */
/*  Inline SVG Icons (no external deps)     */
/* ════════════════════════════════════════ */
const IconRewind = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m11 19-7-7 7-7v14z" />
        <path d="m18 19-7-7 7-7v14z" />
    </svg>
)
const IconPlay = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M5 3l14 9-14 9V3z" />
    </svg>
)
const IconPause = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
)
const IconForward = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 5 7 7-7 7V5z" />
        <path d="m12 5 7 7-7 7V5z" />
    </svg>
)
const IconX = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
)

/* ════════════════════════════════════════ */
/*  Control Button                          */
/* ════════════════════════════════════════ */
function CtrlBtn({
    children,
    onClick,
    title,
    primary = false,
    size = 48,
}: {
    children: React.ReactNode
    onClick: () => void
    title: string
    primary?: boolean
    size?: number
}) {
    const [h, setH] = useState(false)
    return (
        <button
            onClick={onClick}
            title={title}
            onMouseEnter={() => setH(true)}
            onMouseLeave={() => setH(false)}
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: `1px solid ${primary ? (h ? "#e11d48" : "#f43f5e") : h ? "#f43f5e" : "rgba(255,255,255,0.2)"}`,
                background: primary ? (h ? "#e11d48" : "#f43f5e") : (h ? "#1c1917" : "rgba(28,25,23,0.9)"),
                backdropFilter: "blur(12px)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                outline: "none",
                transform: h ? "scale(1.1)" : "scale(1)",
            }}
        >
            {children}
        </button>
    )
}

/* ════════════════════════════════════════ */
/*  Prop Shapes                             */
/* ════════════════════════════════════════ */
type FontValue = {
    fontFamily?: string
    fontWeight?: number | string
    fontStyle?: string
    fontSize?: number
}

import { InstagramEmbed } from "./InstagramEmbed";

export interface LuminaRotatingGalleryProps {
    items: { id: string; href: string }[];
    background?: { show: boolean; color: string }
    header?: {
        show: boolean
        title: string
        titleFont: FontValue
        titleColor: string
        titleAccentColor: string
        subtitleFont: FontValue
        subtitleColor: string
    }
    controlsBar?: {
        show: boolean
        showReverse: boolean
        showPlayPause: boolean
        showForward: boolean
        showSpeedIndicator: boolean
        speedFont: FontValue
        speedColor: string
    }
    cards?: {
        showLabels: boolean
        labelFont: FontValue
        labelColor: string
        cardWidth: number
        cardHeight: number
    }
    behavior?: {
        autoRotate: boolean
        hoverPause: boolean
        enableDrag: boolean
        enableLightbox: boolean
    }
    speedSettings?: {
        initialSpeed: number
        duration: number
        minSpeed: number
        maxSpeed: number
        speedStep: number
    }
}

/* ════════════════════════════════════════ */
/*  Main Component                          */
/* ════════════════════════════════════════ */
export function LuminaRotatingGallery({
    items = [],
    background = { show: false, color: "transparent" },
    controlsBar = {
        show: true,
        showReverse: true,
        showPlayPause: true,
        showForward: true,
        showSpeedIndicator: true,
        speedFont: { fontFamily: "var(--font-inter)", fontWeight: 600, fontStyle: "normal", fontSize: 10 },
        speedColor: "#78716c",
    },
    cards = {
        showLabels: false,
        labelFont: { fontFamily: "var(--font-inter)", fontWeight: 500, fontStyle: "normal", fontSize: 12 },
        labelColor: "#ffffff",
        cardWidth: 326,
        cardHeight: 450,
    },
    behavior = {
        autoRotate: true,
        hoverPause: true,
        enableDrag: true,
        enableLightbox: true,
    },
    speedSettings = {
        initialSpeed: 1,
        duration: 25,
        minSpeed: 0.2,
        maxSpeed: 3.0,
        speedStep: 0.2,
    },
}: LuminaRotatingGalleryProps) {
    const n = items.length
    const { cardWidth, cardHeight } = cards
    const radius = Math.round((cardWidth * n) / (2 * Math.PI)) + 60
    const { autoRotate, hoverPause, enableDrag, enableLightbox } = behavior
    const { initialSpeed, duration, minSpeed, maxSpeed, speedStep } = speedSettings

    const isStatic = false; // Replaced useIsStaticRenderer

    const [isPaused, setIsPaused] = useState(!autoRotate)
    const [speed, setSpeed] = useState(initialSpeed)
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
    const [hovered, setHovered] = useState(false)

    const dragRef = useRef({ active: false, startX: 0 })
    const rotRef = useRef({ manual: 0, auto: 0, last: 0 })
    const carouselRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const rafRef = useRef<number>(0)
    const hoveredRef = useRef(false)
    const isPausedRef = useRef(isPaused)
    const speedRef = useRef(speed)

    useEffect(() => {
        hoveredRef.current = hovered
    }, [hovered])
    useEffect(() => {
        isPausedRef.current = isPaused
    }, [isPaused])
    useEffect(() => {
        speedRef.current = speed
    }, [speed])

    /* ── Animation loop (start/stop helpers) ── */
    const startLoop = useCallback(() => {
        if (rafRef.current) return // already running
        rotRef.current.last = performance.now()
        const tick = (now: number) => {
            const dt = (now - rotRef.current.last) / 1000
            rotRef.current.last = now
            const go =
                autoRotate &&
                !dragRef.current.active &&
                !isPausedRef.current &&
                (!hoverPause || !hoveredRef.current)
            if (go)
                rotRef.current.auto += (360 / duration) * speedRef.current * dt
            if (carouselRef.current)
                carouselRef.current.style.transform = `rotateY(${rotRef.current.manual + rotRef.current.auto}deg)`
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
    }, [autoRotate, duration, hoverPause])

    const stopLoop = useCallback(() => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = 0
        }
    }, [])

    /* ── Static rendering fallback ── */
    useEffect(() => {
        if (isStatic && carouselRef.current) {
            carouselRef.current.style.transform = `rotateY(${rotRef.current.manual + rotRef.current.auto}deg)`
        }
    }, [isStatic])

    /* ── Visibility-gated animation ── */
    useEffect(() => {
        if (isStatic) return
        const el = viewportRef.current
        if (!el) return

        if (typeof IntersectionObserver === "undefined") {
            startLoop()
            return () => stopLoop()
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    startLoop()
                } else {
                    stopLoop()
                }
            },
            { threshold: 0.01 }
        )
        io.observe(el)

        return () => {
            io.disconnect()
            stopLoop()
        }
    }, [isStatic, startLoop, stopLoop])

    /* ── Drag ── */
    const onDown = useCallback(
        (x: number) => {
            if (!enableDrag) return
            dragRef.current = { active: true, startX: x }
        },
        [enableDrag]
    )
    const onMove = useCallback((x: number) => {
        if (!dragRef.current.active) return
        rotRef.current.manual += (x - dragRef.current.startX) * 0.4
        dragRef.current.startX = x
    }, [])
    const onUp = useCallback(() => {
        dragRef.current.active = false
    }, [])

    useEffect(() => {
        const mm = (e: MouseEvent) => onMove(e.clientX)
        const mu = () => onUp()
        const tm = (e: TouchEvent) => onMove(e.touches[0].clientX)
        const tu = () => onUp()
        window.addEventListener("mousemove", mm)
        window.addEventListener("mouseup", mu)
        window.addEventListener("touchmove", tm, { passive: true })
        window.addEventListener("touchend", tu)
        return () => {
            window.removeEventListener("mousemove", mm)
            window.removeEventListener("mouseup", mu)
            window.removeEventListener("touchmove", tm)
            window.removeEventListener("touchend", tu)
        }
    }, [onMove, onUp])

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxSrc(null)
        }
        window.addEventListener("keydown", h)
        return () => window.removeEventListener("keydown", h)
    }, [])

    const handleSlower = () =>
        setSpeed((s) => Math.max(minSpeed, +(s - speedStep).toFixed(1)))
    const handleFaster = () =>
        setSpeed((s) => Math.min(maxSpeed, +(s + speedStep).toFixed(1)))
    const hasCtrl =
        controlsBar.showReverse ||
        controlsBar.showPlayPause ||
        controlsBar.showForward ||
        controlsBar.showSpeedIndicator

    if (!items || items.length === 0) return null;

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 0",
                background: background.show ? background.color : "transparent",
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Carousel */}
            <div
                ref={viewportRef}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseDown={(e) => onDown(e.clientX)}
                onTouchStart={(e) => onDown(e.touches[0].clientX)}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 1000,
                    height: cardHeight + 80,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    perspective: 1200,
                    cursor: enableDrag ? "grab" : "default",
                }}
            >
                <div
                    ref={carouselRef}
                    style={{
                        position: "relative",
                        width: cardWidth,
                        height: cardHeight,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {items.map((p, i) => {
                        const ang = (360 / n) * i
                        const CardTag = enableLightbox ? "button" : "div"
                        return (
                            <CardTag
                                key={i}
                                type={enableLightbox ? "button" : undefined}
                                onClick={() =>
                                    enableLightbox && setLightboxSrc(p.href)
                                }
                                aria-label={enableLightbox ? "View image" : undefined}
                                style={{
                                    position: "absolute",
                                    width: cardWidth,
                                    height: cardHeight,
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
                                    transform: `rotateY(${ang}deg) translateZ(${radius}px)`,
                                    backfaceVisibility: "hidden",
                                    cursor: enableLightbox ? "pointer" : "default",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    padding: 0,
                                    margin: 0,
                                    background: "var(--surface)",
                                    font: "inherit",
                                    textAlign: "left",
                                    display: "block",
                                    appearance: "none",
                                    WebkitAppearance: "none",
                                }}
                            >
                                <div style={{ width: "100%", height: "100%", pointerEvents: enableDrag ? "none" : "auto", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                                    <div style={{ marginTop: "-50px" /* offset the header */ }}>
                                        <InstagramEmbed url={p.href} />
                                    </div>
                                </div>
                            </CardTag>
                        )
                    })}
                </div>
            </div>

            {/* Controls */}
            {controlsBar.show && hasCtrl && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginTop: 24,
                        justifyContent: "center",
                    }}
                >
                    {controlsBar.showReverse && (
                        <CtrlBtn onClick={handleSlower} title="Reverse / Slower">
                            <IconRewind size={18} />
                        </CtrlBtn>
                    )}
                    {controlsBar.showPlayPause && (
                        <CtrlBtn
                            onClick={() => setIsPaused((p) => !p)}
                            title={isPaused ? "Play" : "Pause"}
                            primary
                            size={56}
                        >
                            {isPaused ? <IconPlay size={20} /> : <IconPause size={20} />}
                        </CtrlBtn>
                    )}
                    {controlsBar.showForward && (
                        <CtrlBtn onClick={handleFaster} title="Forward / Faster">
                            <IconForward size={18} />
                        </CtrlBtn>
                    )}
                    {controlsBar.showSpeedIndicator && (
                        <span
                            className="glass-panel"
                            style={{
                                ...controlsBar.speedFont,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--text)",
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: 999,
                                padding: "6px 14px",
                                userSelect: "none",
                            }}
                        >
                            {speed.toFixed(1)}x
                        </span>
                    )}
                </div>
            )}

            {/* Lightbox */}
            {lightboxSrc && (
                <div
                    onClick={() => setLightboxSrc(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1000,
                        background: "rgba(0,0,0,0.85)",
                        backdropFilter: "blur(12px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "rgFadeIn 0.3s ease",
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setLightboxSrc(null)
                        }}
                        style={{
                            position: "absolute",
                            top: 24,
                            right: 24,
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.2)",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <IconX size={20} />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={lightboxSrc}
                        alt="Preview"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            borderRadius: 16,
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                            animation: "rgScaleIn 0.4s ease",
                        }}
                    />
                </div>
            )}

            <style>{`
        @keyframes rgFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rgScaleIn { from { transform: scale(0.9) } to { transform: scale(1) } }
      `}</style>
        </div>
    )
}
