import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

type Project = {
    label: string
    className: string
    image: string
}

type LinkItem = {
    label: string
    href: string
}

type FramerHomepageProps = {
    brandText: string
    portfolioText: string
    menuText: string
    loadingText: string
    worldwideText: string
    sectionOne: string
    sectionTwo: string
    sectionThree: string
    sectionFour: string
    instagramLabel: string
    instagramUrl: string
    linkedinLabel: string
    linkedinUrl: string
    emailLabel: string
    emailUrl: string
    backgroundColor: string
    panelColor: string
    accentGreen: string
    accentYellow: string
    rainbowDuration: number
    letterRainSpeed: number
    floatingAmount: number
    cursorTrailEnabled: boolean
    cursorTrailColors: string
    loadingBarColor: string
}

const baseProjects: Project[] = [
    {
        label: "GRAPHIC DESIGN",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
        className: "item-2",
    },
    {
        label: "MOTION GRAPHIC",
        image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop",
        className: "item-1",
    },
    {
        label: "3D & VFX",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop",
        className: "item-3",
    },
    {
        label: "FILM & PHOTOGRAPHY",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop",
        className: "item-4",
    },
]

const colorCycle = ["#90e06d", "#f7d147", "#ff4fd8", "#44d7ff", "#ff5a3d", "#b78cff", "#ffffff"]
const cursorSymbols = ["☆", "✧", "⚡", "♧"]
const layoutSlots = [
    { anchor: "top-left", x: [4, 10], y: [18, 28] },
    { anchor: "top-right", x: [4, 10], y: [30, 42] },
    { anchor: "bottom-left", x: [8, 18], y: [12, 22] },
    { anchor: "bottom-right", x: [4, 10], y: [10, 20] },
]

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)
const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress
const easeOutQuart = (value: number) => 1 - Math.pow(1 - value, 4)
const easeInOutCubic = (value: number) =>
    value < 0.5 ? 4 * value ** 3 : 1 - Math.pow(-2 * value + 2, 3) / 2
const randomBetween = ([min, max]: number[]) => min + Math.random() * (max - min)

function useLocalClock() {
    const [time, setTime] = React.useState("00:00:00")
    const [timeZoneLabel, setTimeZoneLabel] = React.useState("LOCAL")

    React.useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const timeString = new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(now)
            const zoneParts = new Intl.DateTimeFormat(undefined, {
                timeZoneName: "short",
            }).formatToParts(now)
            const shortZone = zoneParts.find((part) => part.type === "timeZoneName")?.value
            setTime(timeString)
            setTimeZoneLabel(shortZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "LOCAL")
        }

        updateTime()
        const timer = window.setInterval(updateTime, 1000)
        return () => window.clearInterval(timer)
    }, [])

    return { time, timeZoneLabel }
}

function useViewportSize() {
    const [size, setSize] = React.useState({ width: 1280, height: 800 })

    React.useEffect(() => {
        const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
        updateSize()
        window.addEventListener("resize", updateSize)
        return () => window.removeEventListener("resize", updateSize)
    }, [])

    return size
}

function useScrollProgress(locked: boolean) {
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
        let frame = 0
        const updateProgress = () => {
            frame = 0
            if (locked) {
                window.scrollTo(0, 0)
                setProgress(0)
                return
            }
            const scrollable = document.documentElement.scrollHeight - window.innerHeight
            setProgress(scrollable > 0 ? clamp(window.scrollY / scrollable) : 0)
        }
        const requestUpdate = () => {
            if (!frame) frame = window.requestAnimationFrame(updateProgress)
        }
        updateProgress()
        window.addEventListener("scroll", requestUpdate, { passive: true })
        window.addEventListener("resize", requestUpdate)
        return () => {
            if (frame) window.cancelAnimationFrame(frame)
            window.removeEventListener("scroll", requestUpdate)
            window.removeEventListener("resize", requestUpdate)
        }
    }, [locked])

    return progress
}

function createRandomLayout(projects: Project[]) {
    return projects.map((_, index) => {
        const slot = layoutSlots[index]
        const horizontalValue = `${randomBetween(slot.x).toFixed(2)}%`
        const verticalValue = `${randomBetween(slot.y).toFixed(2)}%`
        const placement: Record<string, string> = {}
        if (slot.anchor.includes("left")) placement.left = horizontalValue
        if (slot.anchor.includes("right")) placement.right = horizontalValue
        if (slot.anchor.includes("top")) placement.top = verticalValue
        if (slot.anchor.includes("bottom")) placement.bottom = verticalValue
        return placement
    })
}

function MatrixRain({
    className = "",
    intensity = 0.52,
    progress,
    speed = 1,
}: {
    className?: string
    intensity?: number
    progress: number
    speed?: number
}) {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    const opacity = clamp((progress - 0.22) / 0.36) * intensity

    React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>/?"
        const palette = ["#90e06d", "#44d7ff", "#f7d147", "#ff4fd8", "#b78cff", "#ffffff"]
        const fontSize = className.includes("intro") ? 13 : 15
        let columns: Array<{ y: number; speed: number; colorOffset: number; glitch: number }> = []
        let frame = 0
        let width = 0
        let height = 0

        const resize = () => {
            const bounds = canvas.parentElement?.getBoundingClientRect()
            const pixelRatio = window.devicePixelRatio || 1
            width = bounds?.width || window.innerWidth
            height = bounds?.height || window.innerHeight
            canvas.width = Math.floor(width * pixelRatio)
            canvas.height = Math.floor(height * pixelRatio)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
            columns = Array.from({ length: Math.ceil(width / fontSize) }, () => ({
                y: Math.random() * -height,
                speed: (className.includes("intro") ? 0.24 + Math.random() * 0.58 : 0.16 + Math.random() * 0.38) * speed,
                colorOffset: Math.floor(Math.random() * palette.length),
                glitch: Math.random(),
            }))
        }

        const draw = () => {
            context.fillStyle = "rgba(0, 0, 0, 0.085)"
            context.fillRect(0, 0, width, height)
            context.font = `${fontSize}px Inter, monospace`
            context.textAlign = "center"

            columns.forEach((column, index) => {
                const isGlitchFrame = column.glitch > 0.86 && frame % 48 < 3
                const character = symbols[Math.floor(Math.random() * symbols.length)]
                const color = palette[(Math.floor(frame / 72) + column.colorOffset + index) % palette.length]
                const x = index * fontSize + fontSize / 2
                context.fillStyle = isGlitchFrame ? "#ffffff" : color
                context.globalAlpha = isGlitchFrame ? 0.72 : 0.18 + Math.random() * 0.36
                context.fillText(character, x, column.y)
                if (isGlitchFrame) {
                    context.globalAlpha = 0.18
                    context.fillText(character, x + 4, column.y)
                }
                column.y += fontSize * column.speed
                if (column.y > height + Math.random() * 220) {
                    column.y = -Math.random() * height * 0.45
                    column.speed = (className.includes("intro") ? 0.24 + Math.random() * 0.58 : 0.16 + Math.random() * 0.38) * speed
                    column.colorOffset = Math.floor(Math.random() * palette.length)
                    column.glitch = Math.random()
                }
            })

            context.globalAlpha = 1
            frame += 1
            frame = window.requestAnimationFrame(draw)
        }

        resize()
        frame = window.requestAnimationFrame(draw)
        window.addEventListener("resize", resize)
        return () => {
            window.cancelAnimationFrame(frame)
            window.removeEventListener("resize", resize)
        }
    }, [className, speed])

    return <canvas ref={canvasRef} className={`matrix-rain ${className}`} style={{ opacity }} aria-hidden="true" />
}

function LoadingTerminal({ progress, label, barColor }: { progress: number; label: string; barColor: string }) {
    const percentage = Math.min(100, Math.round(progress * 100))
    return (
        <div className="loading-terminal" aria-label={`${label} ${percentage}%`} style={{ "--loading-bar-color": barColor } as React.CSSProperties}>
            <div className="loading-terminal__header">
                <span>{label}</span>
                <span>{String(percentage).padStart(3, "0")}%</span>
            </div>
            <div className="loading-terminal__gauge" style={{ "--loading-progress": `${percentage}%` } as React.CSSProperties}>
                <span />
            </div>
        </div>
    )
}

function CinematicFrame({ frameProgress, letterRainSpeed }: { frameProgress: number; letterRainSpeed: number }) {
    const { width, height } = useViewportSize()
    const finalWidth = Math.min(width - 48, 1180, Math.max(320, (height - 170) * (16 / 9)))
    const finalHeight = finalWidth * (9 / 16)

    return (
        <div className="cinematic-video-display">
            <div
                className="video-frame"
                style={{
                    width: `${lerp(width, finalWidth, frameProgress)}px`,
                    height: `${lerp(height, finalHeight, frameProgress)}px`,
                    borderRadius: `${lerp(0, 22, frameProgress)}px`,
                    padding: `${lerp(0, 10, frameProgress)}px`,
                    transform: `translate3d(0, ${lerp(0, 18, frameProgress)}px, 0)`,
                }}
            >
                <MatrixRain className="matrix-rain-intro" intensity={1} progress={1} speed={letterRainSpeed} />
            </div>
        </div>
    )
}

function UtilityNav({
    brandText,
    portfolioText,
    menuText,
    projects,
    socialLinks,
    worldwideText,
}: {
    brandText: string
    portfolioText: string
    menuText: string
    projects: Project[]
    socialLinks: LinkItem[]
    worldwideText: string
}) {
    const { time, timeZoneLabel } = useLocalClock()
    const [menuOpen, setMenuOpen] = React.useState(false)
    const goHome = () => {
        setMenuOpen(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <nav className={`utility-nav ${menuOpen ? "menu-is-open" : ""}`}>
            <div className="nav-left">
                <div className="nav-left-stack">
                    <button className="nav-control nav-pill nav-home-control" type="button" onClick={goHome}>
                        <span>{brandText}</span>
                        <span>{portfolioText}</span>
                    </button>
                </div>
                <button className="nav-control nav-pill menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)}>
                    {menuText}
                </button>
                <div className="section-menu" aria-hidden={!menuOpen}>
                    {projects.map((project) => (
                        <button key={project.label} type="button">
                            {project.label}
                        </button>
                    ))}
                    <a href="https://davonsy-ascii.vercel.app/">ASCII Converter</a>
                </div>
            </div>
            <div className="nav-center">
                {time} ({timeZoneLabel})
                <br />
                {worldwideText}
            </div>
            <div className="nav-right">
                {socialLinks.map((link) => (
                    <a className="nav-pill" href={link.href} key={link.label}>
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    )
}

function PortfolioCanvas({
    projects,
    revealProgress,
    scrollProgress,
    onHoverStart,
    onHoverEnd,
    onProjectClick,
    projectColorIndexes,
    floatingAmount,
}: {
    projects: Project[]
    revealProgress: number
    scrollProgress: number
    onHoverStart: (project: Project) => void
    onHoverEnd: () => void
    onProjectClick: (label: string) => void
    projectColorIndexes: Record<string, number>
    floatingAmount: number
}) {
    const randomLayout = React.useMemo(() => createRandomLayout(projects), [projects])
    const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([])

    React.useEffect(() => {
        const maxTravel = [
            { x: 34, y: 22 },
            { x: 30, y: 24 },
            { x: 38, y: 26 },
            { x: 32, y: 22 },
        ]
        const movers = projects.map((_, index) => ({
            x: (Math.random() - 0.5) * 16,
            y: (Math.random() - 0.5) * 16,
            vx: (index % 2 === 0 ? 1 : -1) * (7 + Math.random() * 5),
            vy: (index % 2 === 0 ? -1 : 1) * (6 + Math.random() * 4),
            maxX: (maxTravel[index]?.x || 30) * floatingAmount,
            maxY: (maxTravel[index]?.y || 22) * floatingAmount,
        }))
        let frame = 0
        let previousTime = 0
        const animate = (time: number) => {
            if (!previousTime) previousTime = time
            const delta = Math.min((time - previousTime) / 1000, 0.04)
            previousTime = time
            movers.forEach((mover, index) => {
                mover.x += mover.vx * delta
                mover.y += mover.vy * delta
                if (Math.abs(mover.x) >= mover.maxX) {
                    mover.x = Math.sign(mover.x) * mover.maxX
                    mover.vx *= -0.96
                }
                if (Math.abs(mover.y) >= mover.maxY) {
                    mover.y = Math.sign(mover.y) * mover.maxY
                    mover.vy *= -0.96
                }
                itemRefs.current[index]?.style.setProperty("--float-x", `${mover.x.toFixed(2)}px`)
                itemRefs.current[index]?.style.setProperty("--float-y", `${mover.y.toFixed(2)}px`)
            })
            frame = window.requestAnimationFrame(animate)
        }
        frame = window.requestAnimationFrame(animate)
        return () => window.cancelAnimationFrame(frame)
    }, [projects])

    return (
        <div className="portfolio-canvas">
            <div className="graphic-nav-container">
                {projects.map((project, index) => {
                    const reveal = easeOutQuart(clamp((revealProgress - index * 0.12) / 0.58))
                    const parallax = scrollProgress * (index % 2 === 0 ? -38 : 32)
                    const colorIndex = projectColorIndexes[project.label]
                    const selectedColor = colorIndex === undefined ? undefined : colorCycle[colorIndex]
                    const placement = randomLayout[index]
                    return (
                        <button
                            className={`nav-item ${project.className} ${selectedColor ? "is-colorized" : ""}`}
                            key={project.label}
                            ref={(node) => {
                                itemRefs.current[index] = node
                            }}
                            onBlur={onHoverEnd}
                            onClick={() => onProjectClick(project.label)}
                            onFocus={() => onHoverStart(project)}
                            onMouseEnter={() => onHoverStart(project)}
                            onMouseLeave={onHoverEnd}
                            style={
                                {
                                    "--item-color": selectedColor,
                                    "--item-stroke-color": selectedColor,
                                    "--reveal-y": `${lerp(96, parallax, reveal)}px`,
                                    "--reveal-opacity": reveal,
                                    ...placement,
                                } as React.CSSProperties
                            }
                            type="button"
                        >
                            {project.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function MediaReveal({ activeProject, offset }: { activeProject: Project | null; offset: { x: number; y: number } }) {
    const transform = React.useMemo(
        () => `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(1)`,
        [offset.x, offset.y]
    )
    return (
        <div className="media-reveal" style={{ transform }}>
            <img src={activeProject?.image ?? ""} alt="Project Preview" />
        </div>
    )
}

function parseColorList(colors: string) {
    const parsed = colors
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean)
    return parsed.length ? parsed : colorCycle
}

function CursorParticles({ enabled, colors }: { enabled: boolean; colors: string }) {
    const [particles, setParticles] = React.useState<
        Array<{ id: string; symbol: string; color: string; x: number; y: number; driftX: number; driftY: number; rotate: number; size: number }>
    >([])
    const lastSpawnRef = React.useRef(0)

    React.useEffect(() => {
        if (!enabled) return
        const palette = parseColorList(colors)
        const handlePointerMove = (event: PointerEvent) => {
            const now = performance.now()
            if (now - lastSpawnRef.current < 70) return
            lastSpawnRef.current = now
            const cluster = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, (_, index) => ({
                id: `${now}-${index}-${Math.random()}`,
                symbol: cursorSymbols[Math.floor(Math.random() * cursorSymbols.length)],
                color: palette[Math.floor(Math.random() * palette.length)],
                x: event.clientX + (Math.random() - 0.5) * 34,
                y: event.clientY + (Math.random() - 0.5) * 34,
                driftX: (Math.random() - 0.5) * 42,
                driftY: (Math.random() - 0.5) * 42,
                rotate: (Math.random() - 0.5) * 92,
                size: 10 + Math.random() * 8,
            }))
            setParticles((current) => [...current.slice(-28), ...cluster])
            window.setTimeout(() => {
                const clusterIds = new Set(cluster.map((particle) => particle.id))
                setParticles((current) => current.filter((item) => !clusterIds.has(item.id)))
            }, 1050)
        }
        window.addEventListener("pointermove", handlePointerMove, { passive: true })
        return () => window.removeEventListener("pointermove", handlePointerMove)
    }, [enabled, colors])

    if (!enabled) return null

    return (
        <div className="cursor-particles" aria-hidden="true">
            {particles.map((particle) => (
                <span
                    key={particle.id}
                    style={
                        {
                            "--particle-color": particle.color,
                            "--particle-x": `${particle.x}px`,
                            "--particle-y": `${particle.y}px`,
                            "--particle-drift-x": `${particle.driftX}px`,
                            "--particle-drift-y": `${particle.driftY}px`,
                            "--particle-rotate": `${particle.rotate}deg`,
                            "--particle-size": `${particle.size}px`,
                        } as React.CSSProperties
                    }
                >
                    {particle.symbol}
                </span>
            ))}
        </div>
    )
}

const styles = `
.fk-homepage{--bg-color:#000;--panel-bg:#161616;--text-primary:#fff;--accent-green:#90e06d;--accent-yellow:#f7d147;--font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--text-tiny:10px;--text-massive:clamp(4.8rem,11vw,11.5rem);--page-padding:24px;position:relative;width:100vw;min-height:280vh;background:var(--bg-color);color:var(--text-primary);font-family:var(--font-family);text-transform:uppercase;overflow-x:hidden}
.fk-homepage *{box-sizing:border-box}
.scroll-stage{position:sticky;top:0;width:100vw;height:100vh;padding:var(--page-padding);overflow:hidden}
.bg-canvas{position:absolute;inset:var(--page-padding);z-index:9;background:transparent;border:2px solid var(--accent-green);border-radius:24px;pointer-events:none;animation:rainbow-border var(--rainbow-duration,9s) linear infinite;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 28px rgba(144,224,109,.18);opacity:1;transform:scale(1);transition:opacity 1.15s cubic-bezier(.19,1,.22,1),transform 1.35s cubic-bezier(.19,1,.22,1),box-shadow .5s ease}
.utility-nav{position:absolute;top:var(--page-padding);left:var(--page-padding);width:calc(100% - var(--page-padding)*2);padding:24px 32px;display:flex;justify-content:space-between;z-index:12;font-size:var(--text-tiny);font-weight:500;letter-spacing:.02em;color:#a0a0a0;pointer-events:none;border-bottom:1px solid rgba(255,255,255,.05);opacity:1;transition:opacity 1s ease}
.utility-nav>div{pointer-events:auto;line-height:1.6;opacity:0;transform:translate3d(0,-72px,0)}
.utility-nav>.nav-center{transform:translateX(-50%) translateY(-72px)}
.nav-left{min-width:148px;text-align:left;color:#a0a0a0}.nav-center{position:fixed;left:50%;top:calc(var(--page-padding) + 24px);text-align:center;color:var(--text-primary);transform:translateX(-50%)}.nav-right{text-align:right;display:grid;justify-items:end;gap:4px}
.nav-left-stack{display:grid;justify-items:start;margin-bottom:4px}.nav-pill{color:inherit;text-decoration:none;display:inline-block;background:rgba(255,255,255,.05);padding:2px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.05);min-height:20px;transition:all .2s ease}.nav-control{appearance:none;font:inherit;line-height:inherit;text-align:left;cursor:pointer}.menu-toggle{margin-top:0}.nav-home-control{display:grid;gap:0;padding:2px 10px;line-height:inherit}.nav-home-control span{display:block}.nav-pill:hover,.nav-pill:focus-visible,.menu-is-open .menu-toggle{background:var(--accent-green);color:#000;border-color:var(--accent-green)}
.section-menu{position:absolute;top:calc(100% + 12px);left:32px;width:min(300px,calc(100vw - 64px));display:grid;gap:1px;padding:8px;background:linear-gradient(90deg,rgba(144,224,109,.05),rgba(68,215,255,.05)),rgba(0,0,0,.72);border:1px solid rgba(144,224,109,.2);box-shadow:0 26px 54px rgba(0,0,0,.54),0 0 28px rgba(144,224,109,.08);opacity:0;visibility:hidden;transform:translate3d(0,-8px,0) scaleY(.96);transform-origin:top left;pointer-events:none;transition:opacity .36s ease,transform .48s cubic-bezier(.19,1,.22,1),visibility .36s}.section-menu:before{content:"";position:absolute;inset:3px;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.22) .7px,transparent .8px);background-size:4px 4px;opacity:.12;mix-blend-mode:screen}.menu-is-open .section-menu{opacity:1;visibility:visible;transform:translate3d(0,0,0) scaleY(1);pointer-events:auto}.section-menu button,.section-menu a{position:relative;z-index:1;width:100%;display:block;padding:10px 12px;color:rgba(255,255,255,.78);font:inherit;letter-spacing:.08em;line-height:1.1;text-align:left;background:rgba(255,255,255,.035);border:0;cursor:pointer;text-decoration:none;transition:background-color .24s ease,color .24s ease,transform .32s cubic-bezier(.19,1,.22,1)}.section-menu button:hover,.section-menu button:focus-visible,.section-menu a:hover,.section-menu a:focus-visible{color:#000;background:var(--accent-green);transform:translateX(4px)}
.loading-terminal{position:absolute;left:50%;top:50%;z-index:13;transform:translate(-50%,-50%);display:grid;gap:10px;width:min(320px,72vw);padding:12px 14px;color:rgba(226,255,235,.86);font-family:"SFMono-Regular",Consolas,"Liberation Mono","Courier New",monospace;font-size:11px;font-weight:600;letter-spacing:.18em;line-height:1;text-align:center;background:linear-gradient(90deg,rgba(144,224,109,.05),rgba(68,215,255,.06)),rgba(0,0,0,.28);border:1px solid rgba(144,224,109,.22);box-shadow:0 0 22px rgba(0,0,0,.72),0 0 24px rgba(144,224,109,.08);text-shadow:0 0 14px rgba(144,224,109,.34);transition:opacity .75s ease,transform .75s cubic-bezier(.19,1,.22,1)}.loading-terminal:before{content:"";position:absolute;inset:3px;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.24) .7px,transparent .8px);background-size:4px 4px;opacity:.18;mix-blend-mode:screen}.loading-terminal__header,.loading-terminal__gauge{position:relative;z-index:1}.loading-terminal__header{display:flex;align-items:center;justify-content:space-between;gap:24px}.loading-terminal__gauge{height:8px;overflow:hidden;background:repeating-linear-gradient(to right,rgba(144,224,109,.14) 0,rgba(144,224,109,.14) 1px,transparent 1px,transparent 8px),rgba(255,255,255,.04);border:1px solid rgba(144,224,109,.2)}.loading-terminal__gauge span{display:block;width:var(--loading-progress,0%);height:100%;background:linear-gradient(90deg,var(--loading-bar-color,#90e06d),rgba(68,215,255,.72),rgba(247,209,71,.65)),repeating-linear-gradient(to right,rgba(255,255,255,.22) 0,rgba(255,255,255,.22) 2px,transparent 2px,transparent 7px);box-shadow:0 0 18px rgba(144,224,109,.22);transition:width .16s linear}
.cinematic-video-display{position:absolute;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;pointer-events:none;overflow:hidden;opacity:1;transition:opacity 1.25s cubic-bezier(.19,1,.22,1)}.cinematic-video-display:before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:22px;background:linear-gradient(to bottom,rgba(0,0,0,.72),transparent 22%,transparent 66%,rgba(0,0,0,.82)),linear-gradient(to right,rgba(0,0,0,.62),transparent 28%,transparent 72%,rgba(0,0,0,.62));opacity:.82}.cinematic-video-display:after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:22px;background:linear-gradient(to right,rgba(144,224,109,.12),transparent 18%,transparent 82%,rgba(247,209,71,.08)),repeating-linear-gradient(to bottom,rgba(255,255,255,.035) 0,rgba(255,255,255,.035) 1px,transparent 1px,transparent 5px);mix-blend-mode:screen;opacity:.34}.video-frame{position:relative;max-width:100vw;max-height:100vh;background:#050505;overflow:hidden;box-shadow:0 0 90px rgba(0,0,0,.72);will-change:width,height,transform,border-radius}.video-frame:before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(circle at 50% 48%,transparent 0%,rgba(0,0,0,.18) 44%,rgba(0,0,0,.82) 100%),linear-gradient(to bottom,rgba(0,0,0,.18),transparent 38%,rgba(0,0,0,.44))}.video-frame:after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;background:repeating-linear-gradient(to bottom,rgba(255,255,255,.025) 0,rgba(255,255,255,.025) 1px,transparent 1px,transparent 6px);mix-blend-mode:screen;opacity:.38}
.matrix-rain{position:absolute;inset:0;z-index:4;width:100%;height:100%;pointer-events:none;mix-blend-mode:screen;transition:opacity .6s ease;filter:blur(.2px) saturate(.88);mask-image:linear-gradient(to bottom,transparent 0%,rgba(0,0,0,.82) 28%,rgba(0,0,0,.92) 86%,transparent 100%)}.matrix-rain-intro{z-index:1;filter:blur(.1px) saturate(1.08) contrast(1.16);mask-image:none}
.portfolio-canvas{position:absolute;inset:0;z-index:5;display:flex;align-items:flex-end;justify-content:center;padding-bottom:5vh;opacity:1;transition:opacity 1.1s ease}.graphic-nav-container{position:relative;width:100%;max-width:1400px;height:60vh}.nav-item{position:absolute;appearance:none;background:transparent;border:0;padding:0;font-size:var(--text-massive);font-weight:700;letter-spacing:-.05em;line-height:.85;cursor:pointer;user-select:none;opacity:var(--reveal-opacity,0);color:transparent;-webkit-text-fill-color:transparent;-webkit-text-stroke:2px currentColor;transform:translate3d(calc(var(--float-x,0px) + var(--hover-drift-x,0px)),calc(var(--reveal-y,96px) + var(--float-y,0px) + var(--hover-drift-y,0px)),0);will-change:opacity,transform;animation:rainbow-type var(--rainbow-duration,9s) linear infinite;text-shadow:0 0 28px rgba(255,255,255,.16);transition:transform .4s cubic-bezier(.19,1,.22,1),color .45s cubic-bezier(.19,1,.22,1),text-shadow .45s ease,-webkit-text-stroke .45s ease}.item-1{z-index:3;animation-delay:-1.5s;font-size:clamp(3.7rem,7.8vw,8.4rem)}.item-2{z-index:1;font-size:clamp(3.6rem,7.4vw,8rem)}.item-3{z-index:4;animation-delay:-3s}.item-4{z-index:2;font-size:clamp(3.5rem,7.2vw,7.9rem);animation-delay:-4.5s}.nav-item.is-colorized{animation:none;color:var(--item-color);-webkit-text-fill-color:transparent;-webkit-text-stroke-color:var(--item-color);text-shadow:0 0 30px color-mix(in srgb,var(--item-color) 34%,transparent)}.portfolio-canvas:hover .nav-item{opacity:calc(var(--reveal-opacity,0)*.72);-webkit-text-stroke-width:1.5px}.portfolio-canvas .nav-item:hover,.portfolio-canvas .nav-item:focus-visible{--hover-drift-x:10px;--hover-drift-y:-10px;color:var(--item-color,currentColor);-webkit-text-stroke-width:2px;transform:translate3d(calc(var(--float-x,0px) + var(--hover-drift-x)),calc(var(--reveal-y,0px) + var(--float-y,0px) + var(--hover-drift-y)),0) scale(1.018);z-index:30}
.media-reveal{position:fixed;top:50%;left:50%;width:40vw;min-width:300px;aspect-ratio:16/9;background:var(--panel-bg);padding:12px;border-radius:24px;border:2px solid #333;opacity:0;visibility:hidden;z-index:20;pointer-events:none;transition:opacity .4s ease,transform .5s cubic-bezier(.19,1,.22,1),visibility .4s;box-shadow:0 30px 60px rgba(0,0,0,.8)}.media-reveal img{width:100%;height:100%;object-fit:cover;border-radius:12px}.fk-homepage.is-hovering .media-reveal{opacity:1;visibility:visible}.fk-homepage.is-hovering .bg-canvas{box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 0 34px rgba(255,255,255,.12)}
.cursor-particles{position:fixed;inset:0;z-index:60;pointer-events:none;overflow:hidden}.cursor-particles span{position:absolute;left:var(--particle-x);top:var(--particle-y);color:var(--particle-color);font-size:var(--particle-size,13px);font-family:"SFMono-Regular",Consolas,"Liberation Mono","Courier New",monospace;line-height:1;-webkit-text-fill-color:transparent;-webkit-text-stroke:.8px var(--particle-color);text-shadow:0 0 12px color-mix(in srgb,var(--particle-color) 45%,transparent);opacity:0;transform:translate3d(-50%,-50%,0) scale(.72) rotate(0deg);animation:cursor-particle 1.05s cubic-bezier(.19,1,.22,1) forwards;will-change:opacity,transform}
.intro-locked .bg-canvas,.intro-locked .portfolio-canvas,.intro-locked .utility-nav{opacity:0!important}.intro-locked .scroll-stage>.matrix-rain{opacity:0!important}.intro-locked .bg-canvas{transform:scale(1.015)}.sequence-started .bg-canvas,.sequence-started .cinematic-video-display,.sequence-started .portfolio-canvas,.sequence-started .utility-nav{opacity:1}.sequence-started .utility-nav>div{animation:nav-drop 1.25s cubic-bezier(.19,1,.22,1) both}.sequence-started .utility-nav>.nav-center{animation:nav-center-drop 1.25s cubic-bezier(.19,1,.22,1) .18s both}.sequence-started .loading-terminal{opacity:0;transform:translate(-50%,calc(-50% + 10px))}
@keyframes nav-drop{from{opacity:0;transform:translate3d(0,-72px,0);filter:blur(8px)}to{opacity:1;transform:translate3d(0,0,0);filter:blur(0)}}@keyframes nav-center-drop{from{opacity:0;transform:translateX(-50%) translateY(-72px);filter:blur(8px)}to{opacity:1;transform:translateX(-50%) translateY(0);filter:blur(0)}}@keyframes rainbow-border{0%,100%{border-color:#90e06d;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 28px rgba(144,224,109,.2)}16%{border-color:#44d7ff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 28px rgba(68,215,255,.2)}32%{border-color:#b78cff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 28px rgba(183,140,255,.2)}48%{border-color:#ff4fd8;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 28px rgba(255,79,216,.18)}64%{border-color:#ff5a3d;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 28px rgba(255,90,61,.18)}82%{border-color:#f7d147;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 28px rgba(247,209,71,.2)}}@keyframes rainbow-type{0%,100%{color:#90e06d;text-shadow:0 0 30px rgba(144,224,109,.25)}16%{color:#44d7ff;text-shadow:0 0 30px rgba(68,215,255,.24)}32%{color:#b78cff;text-shadow:0 0 30px rgba(183,140,255,.24)}48%{color:#ff4fd8;text-shadow:0 0 30px rgba(255,79,216,.22)}64%{color:#ff5a3d;text-shadow:0 0 30px rgba(255,90,61,.2)}82%{color:#f7d147;text-shadow:0 0 30px rgba(247,209,71,.24)}}@keyframes cursor-particle{0%{opacity:0;transform:translate3d(-50%,-50%,0) scale(.55) rotate(0deg)}18%{opacity:.78}100%{opacity:0;transform:translate3d(calc(-50% + var(--particle-drift-x)),calc(-50% + var(--particle-drift-y)),0) scale(1.08) rotate(var(--particle-rotate))}}
@media(max-width:760px){.fk-homepage{--page-padding:14px;--text-massive:clamp(3.5rem,18vw,6.8rem)}.utility-nav{padding:18px;gap:14px}.utility-nav>div{max-width:33%}.graphic-nav-container{height:55vh}.nav-right{gap:3px}.section-menu{left:18px;width:min(280px,calc(100vw - 36px))}}
`

export default function FramerHomepage(props: Partial<FramerHomepageProps>) {
    const {
        brandText = "YUSUKE / KOGURE",
        portfolioText = "PORTFOLIO",
        menuText = "MENU",
        loadingText = "LOADING",
        worldwideText = "WORLDWIDE",
        instagramLabel = "INSTAGRAM",
        instagramUrl = "https://www.instagram.com",
        linkedinLabel = "LINKEDIN",
        linkedinUrl = "https://www.linkedin.com",
        emailLabel = "EMAIL",
        emailUrl = "mailto:studio@example.com",
        sectionOne = "GRAPHIC DESIGN",
        sectionTwo = "MOTION GRAPHIC",
        sectionThree = "3D & VFX",
        sectionFour = "FILM & PHOTOGRAPHY",
        backgroundColor = "#000000",
        panelColor = "#161616",
        accentGreen = "#90e06d",
        accentYellow = "#f7d147",
        rainbowDuration = 9,
        letterRainSpeed = 1,
        floatingAmount = 1,
        cursorTrailEnabled = true,
        cursorTrailColors = "#90e06d,#f7d147,#ff4fd8,#44d7ff,#ff5a3d,#b78cff,#ffffff",
        loadingBarColor = "#90e06d",
    } = props

    const [activeProject, setActiveProject] = React.useState<Project | null>(null)
    const [hovering, setHovering] = React.useState(false)
    const [offset, setOffset] = React.useState({ x: 0, y: 0 })
    const [introLocked, setIntroLocked] = React.useState(true)
    const [sequenceStarted, setSequenceStarted] = React.useState(false)
    const [loadingProgress, setLoadingProgress] = React.useState(0)
    const [autoRevealProgress, setAutoRevealProgress] = React.useState(0)
    const [projectColorIndexes, setProjectColorIndexes] = React.useState<Record<string, number>>({})
    const progress = useScrollProgress(introLocked)
    const frameProgress = easeInOutCubic(clamp(progress / 0.58))

    const projects = React.useMemo(
        () =>
            baseProjects.map((project, index) => ({
                ...project,
                label: [sectionOne, sectionTwo, sectionThree, sectionFour][index] || project.label,
            })),
        [sectionOne, sectionTwo, sectionThree, sectionFour]
    )
    const socialLinks = React.useMemo(
        () => [
            { label: instagramLabel, href: instagramUrl },
            { label: linkedinLabel, href: linkedinUrl },
            { label: emailLabel, href: emailUrl },
        ],
        [instagramLabel, instagramUrl, linkedinLabel, linkedinUrl, emailLabel, emailUrl]
    )

    React.useEffect(() => {
        let revealFrame = 0
        let revealStart = 0
        let loadingFrame = 0
        let loadingStart = 0
        const rainIntroDuration = 1900
        const revealDuration = 2200
        window.scrollTo(0, 0)
        document.body.classList.add("intro-scroll-locked")

        const animateReveal = (time: number) => {
            if (!revealStart) revealStart = time
            const progressValue = clamp((time - revealStart) / revealDuration)
            setAutoRevealProgress(easeInOutCubic(progressValue))
            if (progressValue < 1) revealFrame = window.requestAnimationFrame(animateReveal)
        }
        const unlockIntro = () => {
            setLoadingProgress(1)
            setSequenceStarted(true)
            document.body.classList.remove("intro-scroll-locked")
            setIntroLocked(false)
            revealFrame = window.requestAnimationFrame(animateReveal)
        }
        const animateLoading = (time: number) => {
            if (!loadingStart) loadingStart = time
            const progressValue = clamp((time - loadingStart) / rainIntroDuration)
            setLoadingProgress(easeInOutCubic(progressValue))
            if (progressValue < 1) {
                loadingFrame = window.requestAnimationFrame(animateLoading)
                return
            }
            unlockIntro()
        }
        loadingFrame = window.requestAnimationFrame(animateLoading)
        return () => {
            if (loadingFrame) window.cancelAnimationFrame(loadingFrame)
            if (revealFrame) window.cancelAnimationFrame(revealFrame)
            document.body.classList.remove("intro-scroll-locked")
        }
    }, [])

    React.useEffect(() => {
        const handlePointerMove = (event: MouseEvent) => {
            if (!hovering) return
            setOffset({
                x: (event.clientX / window.innerWidth - 0.5) * 20,
                y: (event.clientY / window.innerHeight - 0.5) * 20,
            })
        }
        document.addEventListener("mousemove", handlePointerMove)
        return () => document.removeEventListener("mousemove", handlePointerMove)
    }, [hovering])

    return (
        <main
            className={`fk-homepage ${hovering ? "is-hovering" : ""} ${
                sequenceStarted ? "sequence-started intro-complete" : "intro-locked"
            }`}
            style={
                {
                    "--bg-color": backgroundColor,
                    "--panel-bg": panelColor,
                    "--accent-green": accentGreen,
                    "--accent-yellow": accentYellow,
                    "--rainbow-duration": `${rainbowDuration}s`,
                    "--loading-bar-color": loadingBarColor,
                } as React.CSSProperties
            }
        >
            <style>{styles}</style>
            <section className="scroll-stage">
                <div className="bg-canvas" />
                <CinematicFrame frameProgress={frameProgress} letterRainSpeed={letterRainSpeed} />
                <MatrixRain progress={Math.max(autoRevealProgress, progress)} speed={letterRainSpeed} />
                <LoadingTerminal progress={loadingProgress} label={loadingText} barColor={loadingBarColor} />
                <UtilityNav
                    brandText={brandText}
                    portfolioText={portfolioText}
                    menuText={menuText}
                    projects={projects}
                    socialLinks={socialLinks}
                    worldwideText={worldwideText}
                />
                <PortfolioCanvas
                    projects={projects}
                    revealProgress={Math.max(autoRevealProgress, progress)}
                    scrollProgress={progress}
                    onHoverStart={(project) => {
                        setActiveProject(project)
                        setHovering(true)
                    }}
                    onHoverEnd={() => {
                        setHovering(false)
                        setOffset({ x: 0, y: 0 })
                    }}
                    onProjectClick={(label) => {
                        setProjectColorIndexes((current) => ({
                            ...current,
                            [label]: ((current[label] ?? -1) + 1) % colorCycle.length,
                        }))
                    }}
                    projectColorIndexes={projectColorIndexes}
                    floatingAmount={floatingAmount}
                />
            </section>
            <MediaReveal activeProject={activeProject} offset={offset} />
            <CursorParticles enabled={cursorTrailEnabled} colors={cursorTrailColors} />
        </main>
    )
}

addPropertyControls(FramerHomepage, {
    brandText: { type: ControlType.String, title: "Brand", defaultValue: "YUSUKE / KOGURE" },
    portfolioText: { type: ControlType.String, title: "Portfolio", defaultValue: "PORTFOLIO" },
    menuText: { type: ControlType.String, title: "Menu", defaultValue: "MENU" },
    loadingText: { type: ControlType.String, title: "Loading", defaultValue: "LOADING" },
    worldwideText: { type: ControlType.String, title: "Clock Sub", defaultValue: "WORLDWIDE" },
    sectionOne: { type: ControlType.String, title: "Section 1", defaultValue: "GRAPHIC DESIGN" },
    sectionTwo: { type: ControlType.String, title: "Section 2", defaultValue: "MOTION GRAPHIC" },
    sectionThree: { type: ControlType.String, title: "Section 3", defaultValue: "3D & VFX" },
    sectionFour: { type: ControlType.String, title: "Section 4", defaultValue: "FILM & PHOTOGRAPHY" },
    instagramLabel: { type: ControlType.String, title: "Social 1", defaultValue: "INSTAGRAM" },
    instagramUrl: { type: ControlType.String, title: "URL 1", defaultValue: "https://www.instagram.com" },
    linkedinLabel: { type: ControlType.String, title: "Social 2", defaultValue: "LINKEDIN" },
    linkedinUrl: { type: ControlType.String, title: "URL 2", defaultValue: "https://www.linkedin.com" },
    emailLabel: { type: ControlType.String, title: "Social 3", defaultValue: "EMAIL" },
    emailUrl: { type: ControlType.String, title: "URL 3", defaultValue: "mailto:studio@example.com" },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#000000" },
    panelColor: { type: ControlType.Color, title: "Panel", defaultValue: "#161616" },
    accentGreen: { type: ControlType.Color, title: "Accent A", defaultValue: "#90e06d" },
    accentYellow: { type: ControlType.Color, title: "Accent B", defaultValue: "#f7d147" },
    rainbowDuration: {
        type: ControlType.Number,
        title: "Rainbow Speed",
        defaultValue: 9,
        min: 3,
        max: 24,
        step: 0.5,
        unit: "s",
    },
    letterRainSpeed: {
        type: ControlType.Number,
        title: "Rain Speed",
        defaultValue: 1,
        min: 0.2,
        max: 2.5,
        step: 0.05,
    },
    floatingAmount: {
        type: ControlType.Number,
        title: "Float Amount",
        defaultValue: 1,
        min: 0,
        max: 2,
        step: 0.05,
    },
    cursorTrailEnabled: {
        type: ControlType.Boolean,
        title: "Cursor Trail",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    cursorTrailColors: {
        type: ControlType.String,
        title: "Trail Colors",
        defaultValue: "#90e06d,#f7d147,#ff4fd8,#44d7ff,#ff5a3d,#b78cff,#ffffff",
    },
    loadingBarColor: {
        type: ControlType.Color,
        title: "Load Bar",
        defaultValue: "#90e06d",
    },
})
