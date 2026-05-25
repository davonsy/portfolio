import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const rainSymbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>/?"
const trailSymbols = ["☆", "✧", "⚡", "♧"]
const sectionSeeds = [
    { key: "graphic", x: "8%", y: "22%" },
    { key: "motion", x: "56%", y: "18%" },
    { key: "three", x: "12%", y: "68%" },
    { key: "film", x: "48%", y: "72%" },
]

const splitColors = (value: string) =>
    value
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean)

const easeInOutCubic = (value: number) =>
    value < 0.5 ? 4 * value ** 3 : 1 - Math.pow(-2 * value + 2, 3) / 2

function MatrixRain({
    speed,
    colors,
    opacity = 0.62,
}: {
    speed: number
    colors: string[]
    opacity?: number
}) {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    React.useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        let columns: Array<{ y: number; speed: number; color: number; glitch: number }> = []
        let frame = 0
        let animation = 0
        let width = 0
        let height = 0
        const fontSize = 14

        const resize = () => {
            const ratio = window.devicePixelRatio || 1
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = Math.floor(width * ratio)
            canvas.height = Math.floor(height * ratio)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
            columns = Array.from({ length: Math.ceil(width / fontSize) }, () => ({
                y: Math.random() * -height,
                speed: (0.14 + Math.random() * 0.34) * speed,
                color: Math.floor(Math.random() * colors.length),
                glitch: Math.random(),
            }))
        }

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.085)"
            ctx.fillRect(0, 0, width, height)
            ctx.font = `${fontSize}px "SFMono-Regular", Consolas, monospace`
            ctx.textAlign = "center"

            columns.forEach((column, index) => {
                const glitch = column.glitch > 0.9 && frame % 56 < 3
                const character = rainSymbols[Math.floor(Math.random() * rainSymbols.length)]
                ctx.fillStyle = glitch ? "#ffffff" : colors[(Math.floor(frame / 72) + column.color + index) % colors.length]
                ctx.globalAlpha = glitch ? 0.68 : 0.18 + Math.random() * 0.3
                ctx.fillText(character, index * fontSize + fontSize / 2, column.y)
                column.y += fontSize * column.speed
                if (column.y > height + 220) {
                    column.y = -Math.random() * height * 0.45
                    column.speed = (0.14 + Math.random() * 0.34) * speed
                    column.color = Math.floor(Math.random() * colors.length)
                    column.glitch = Math.random()
                }
            })

            ctx.globalAlpha = 1
            frame += 1
            animation = window.requestAnimationFrame(draw)
        }

        resize()
        animation = window.requestAnimationFrame(draw)
        window.addEventListener("resize", resize)
        return () => {
            window.cancelAnimationFrame(animation)
            window.removeEventListener("resize", resize)
        }
    }, [speed, colors])

    return <canvas style={{ ...styles.rainCanvas, opacity }} ref={canvasRef} aria-hidden="true" />
}

function CursorTrail({ enabled, colors }: { enabled: boolean; colors: string[] }) {
    const [particles, setParticles] = React.useState<any[]>([])
    const lastSpawn = React.useRef(0)

    React.useEffect(() => {
        if (!enabled) return

        const move = (event: PointerEvent) => {
            const now = performance.now()
            if (now - lastSpawn.current < 70) return
            lastSpawn.current = now
            const cluster = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, (_, index) => ({
                id: `${now}-${index}-${Math.random()}`,
                symbol: trailSymbols[Math.floor(Math.random() * trailSymbols.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                x: event.clientX + (Math.random() - 0.5) * 34,
                y: event.clientY + (Math.random() - 0.5) * 34,
                dx: (Math.random() - 0.5) * 42,
                dy: (Math.random() - 0.5) * 42,
                rotate: (Math.random() - 0.5) * 92,
                size: 10 + Math.random() * 8,
            }))
            setParticles((current) => [...current.slice(-28), ...cluster])
            window.setTimeout(() => {
                const ids = new Set(cluster.map((item) => item.id))
                setParticles((current) => current.filter((item) => !ids.has(item.id)))
            }, 1050)
        }

        window.addEventListener("pointermove", move, { passive: true })
        return () => window.removeEventListener("pointermove", move)
    }, [enabled, colors])

    if (!enabled) return null

    return (
        <div style={styles.cursorLayer}>
            {particles.map((particle) => (
                <span
                    className="homepage-cursor-particle"
                    key={particle.id}
                    style={
                        {
                            left: particle.x,
                            top: particle.y,
                            color: particle.color,
                            fontSize: particle.size,
                            "--dx": `${particle.dx}px`,
                            "--dy": `${particle.dy}px`,
                            "--rotate": `${particle.rotate}deg`,
                        } as React.CSSProperties
                    }
                >
                    {particle.symbol}
                </span>
            ))}
        </div>
    )
}

function BackgroundLayer({
    backgroundColor,
    borderColorA,
    borderColorB,
    rainSpeed,
    rainbowDuration,
    rainColors,
    cursorTrail,
    cursorTrailColors,
    showBorder,
    rainOpacity = 0.62,
}: any) {
    const matrixColors = React.useMemo(() => splitColors(rainColors), [rainColors])
    const trailColors = React.useMemo(() => splitColors(cursorTrailColors), [cursorTrailColors])

    return (
        <div style={{ ...styles.background, background: backgroundColor }}>
            <MatrixRain speed={rainSpeed} colors={matrixColors.length ? matrixColors : ["#90e06d"]} opacity={rainOpacity} />
            {showBorder && (
                <div
                    className="homepage-rainbow-border"
                    style={
                        {
                            animationDuration: `${rainbowDuration}s`,
                            "--border-a": borderColorA,
                            "--border-b": borderColorB,
                        } as React.CSSProperties
                    }
                />
            )}
            <CursorTrail enabled={cursorTrail} colors={trailColors.length ? trailColors : ["#90e06d"]} />
        </div>
    )
}

function LoadingIntro({ progress, label, barColor }: { progress: number; label: string; barColor: string }) {
    const percentage = Math.min(100, Math.round(progress * 100))

    return (
        <div style={styles.loading}>
            <div style={styles.loadingHeader}>
                <span>{label}</span>
                <span>{String(percentage).padStart(3, "0")}%</span>
            </div>
            <div style={styles.gauge}>
                <span
                    style={{
                        ...styles.gaugeFill,
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${barColor}, rgba(68,215,255,.72), rgba(247,209,71,.65))`,
                    }}
                />
            </div>
        </div>
    )
}

function TopNav({
    brandText,
    portfolioText,
    menuText,
    graphicLabel,
    graphicUrl,
    motionLabel,
    motionUrl,
    threeLabel,
    threeUrl,
    filmLabel,
    filmUrl,
    aboutText,
    aboutUrl,
    socialOne,
    socialOneUrl,
    socialTwo,
    socialTwoUrl,
    socialThree,
    socialThreeUrl,
}: any) {
    const [open, setOpen] = React.useState(false)
    const [clock, setClock] = React.useState("00:00:00")
    const [zone, setZone] = React.useState("LOCAL")

    React.useEffect(() => {
        const update = () => {
            const now = new Date()
            setClock(
                new Intl.DateTimeFormat(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                }).format(now)
            )
            const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(now)
            setZone(parts.find((part) => part.type === "timeZoneName")?.value || "LOCAL")
        }
        update()
        const timer = window.setInterval(update, 1000)
        return () => window.clearInterval(timer)
    }, [])

    const sections = [
        [graphicLabel, graphicUrl],
        [motionLabel, motionUrl],
        [threeLabel, threeUrl],
        [filmLabel, filmUrl],
        [aboutText, aboutUrl],
        ["ASCII Converter", "https://davonsy-ascii.vercel.app/"],
    ]

    return (
        <nav style={styles.nav}>
            <div style={styles.navLeft}>
                <a className="homepage-nav-pill homepage-home-button" href="/">
                    <span>{brandText}</span>
                    <span>{portfolioText}</span>
                </a>
                <button className="homepage-nav-pill homepage-menu-button" onClick={() => setOpen(!open)}>
                    {menuText}
                </button>
                <div
                    style={{
                        ...styles.menu,
                        opacity: open ? 1 : 0,
                        transform: open ? "translateY(0)" : "translateY(-8px)",
                        pointerEvents: open ? "auto" : "none",
                    }}
                >
                    {sections.map(([label, url]) => (
                        <a className="homepage-menu-item" href={url} key={label}>
                            {label}
                        </a>
                    ))}
                </div>
            </div>
            <div style={styles.navCenter}>
                {clock} ({zone})
                <br />
                WORLDWIDE
            </div>
            <div style={styles.navRight}>
                <a className="homepage-nav-pill" href={socialOneUrl}>
                    {socialOne}
                </a>
                <a className="homepage-nav-pill" href={socialTwoUrl}>
                    {socialTwo}
                </a>
                <a className="homepage-nav-pill" href={socialThreeUrl}>
                    {socialThree}
                </a>
            </div>
        </nav>
    )
}

function HomeHero({ labels, movement, rainbowDuration }: { labels: string[][]; movement: number; rainbowDuration: number }) {
    const refs = React.useRef<Array<HTMLAnchorElement | null>>([])

    React.useEffect(() => {
        const movers = sectionSeeds.map((_, index) => ({
            x: 0,
            y: 0,
            vx: (index % 2 === 0 ? 1 : -1) * (8 + Math.random() * 4) * movement,
            vy: (index % 2 === 0 ? -1 : 1) * (6 + Math.random() * 4) * movement,
            maxX: 34 * movement,
            maxY: 22 * movement,
        }))
        let frame = 0
        let previous = 0

        const animate = (time: number) => {
            if (!previous) previous = time
            const delta = Math.min((time - previous) / 1000, 0.04)
            previous = time
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
                refs.current[index]?.style.setProperty("--x", `${mover.x}px`)
                refs.current[index]?.style.setProperty("--y", `${mover.y}px`)
            })
            frame = requestAnimationFrame(animate)
        }

        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [movement])

    return (
        <div style={styles.hero}>
            {sectionSeeds.map((item, index) => (
                <a
                    className="homepage-float"
                    href={labels[index][1]}
                    key={item.key}
                    ref={(node) => {
                        refs.current[index] = node
                    }}
                    style={
                        {
                            left: item.x,
                            top: item.y,
                            animationDuration: `${rainbowDuration}s`,
                        } as React.CSSProperties
                    }
                >
                    {labels[index][0]}
                </a>
            ))}
        </div>
    )
}

export default function HomepageComposition({
    brandText = "YUSUKE / KOGURE",
    portfolioText = "PORTFOLIO",
    menuText = "MENU",
    loadingText = "LOADING",
    loadingBarColor = "#90e06d",
    introDuration = 1900,
    backgroundColor = "#000000",
    borderColorA = "#90e06d",
    borderColorB = "#f7d147",
    rainColors = "#90e06d,#44d7ff,#f7d147,#ff4fd8,#b78cff,#ffffff",
    rainSpeed = 1,
    rainbowDuration = 9,
    cursorTrail = true,
    cursorTrailColors = "#90e06d,#f7d147,#ff4fd8,#44d7ff,#ff5a3d,#b78cff,#ffffff",
    graphicLabel = "GRAPHIC DESIGN",
    graphicUrl = "/graphic-design",
    motionLabel = "MOTION GRAPHIC",
    motionUrl = "/motion-graphic",
    threeLabel = "3D & VFX",
    threeUrl = "/3d-vfx",
    filmLabel = "FILM & PHOTOGRAPHY",
    filmUrl = "/film-photography",
    aboutText = "ABOUT / CONTACT",
    aboutUrl = "/about-contact",
    socialOne = "INSTAGRAM",
    socialOneUrl = "https://www.instagram.com",
    socialTwo = "LINKEDIN",
    socialTwoUrl = "https://www.linkedin.com",
    socialThree = "EMAIL",
    socialThreeUrl = "mailto:studio@example.com",
    movement = 1,
}) {
    const [introProgress, setIntroProgress] = React.useState(0)
    const [introComplete, setIntroComplete] = React.useState(false)

    React.useEffect(() => {
        let frame = 0
        let started = 0

        const animate = (time: number) => {
            if (!started) started = time
            const rawProgress = Math.min(1, (time - started) / introDuration)
            setIntroProgress(easeInOutCubic(rawProgress))
            if (rawProgress < 1) {
                frame = requestAnimationFrame(animate)
                return
            }
            setIntroComplete(true)
        }

        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [introDuration])

    const sectionLabels = [
        [graphicLabel, graphicUrl],
        [motionLabel, motionUrl],
        [threeLabel, threeUrl],
        [filmLabel, filmUrl],
    ]

    return (
        <main style={styles.root}>
            <style>{globalCss}</style>
            <BackgroundLayer
                backgroundColor={backgroundColor}
                borderColorA={borderColorA}
                borderColorB={borderColorB}
                rainSpeed={rainSpeed}
                rainbowDuration={rainbowDuration}
                rainColors={rainColors}
                cursorTrail={cursorTrail && introComplete}
                cursorTrailColors={cursorTrailColors}
                showBorder={introComplete}
            />
            <div
                style={{
                    ...styles.introLayer,
                    opacity: introComplete ? 0 : 1,
                    pointerEvents: introComplete ? "none" : "auto",
                }}
            >
                <BackgroundLayer
                    backgroundColor="transparent"
                    borderColorA={borderColorA}
                    borderColorB={borderColorB}
                    rainSpeed={rainSpeed * 1.08}
                    rainbowDuration={rainbowDuration}
                    rainColors={rainColors}
                    cursorTrail={false}
                    cursorTrailColors={cursorTrailColors}
                    showBorder={false}
                    rainOpacity={0.86}
                />
                <LoadingIntro progress={introProgress} label={loadingText} barColor={loadingBarColor} />
            </div>
            <div
                style={{
                    ...styles.homeLayer,
                    opacity: introComplete ? 1 : 0,
                    transform: introComplete ? "translateY(0) scale(1)" : "translateY(18px) scale(.992)",
                    filter: introComplete ? "blur(0)" : "blur(8px)",
                }}
            >
                <TopNav
                    brandText={brandText}
                    portfolioText={portfolioText}
                    menuText={menuText}
                    graphicLabel={graphicLabel}
                    graphicUrl={graphicUrl}
                    motionLabel={motionLabel}
                    motionUrl={motionUrl}
                    threeLabel={threeLabel}
                    threeUrl={threeUrl}
                    filmLabel={filmLabel}
                    filmUrl={filmUrl}
                    aboutText={aboutText}
                    aboutUrl={aboutUrl}
                    socialOne={socialOne}
                    socialOneUrl={socialOneUrl}
                    socialTwo={socialTwo}
                    socialTwoUrl={socialTwoUrl}
                    socialThree={socialThree}
                    socialThreeUrl={socialThreeUrl}
                />
                <HomeHero labels={sectionLabels} movement={movement} rainbowDuration={rainbowDuration} />
            </div>
        </main>
    )
}

const styles: Record<string, React.CSSProperties> = {
    root: {
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#000",
        color: "#fff",
    },
    background: {
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
    },
    rainCanvas: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        mixBlendMode: "screen",
    },
    introLayer: {
        position: "fixed",
        inset: 0,
        zIndex: 30,
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        transition: "opacity .72s ease",
    },
    homeLayer: {
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        transition: "opacity 1.05s ease, transform 1.05s cubic-bezier(.19,1,.22,1), filter 1.05s ease",
    },
    loading: {
        position: "relative",
        zIndex: 4,
        display: "grid",
        gap: 10,
        width: "min(320px, 72vw)",
        padding: "12px 14px",
        color: "rgba(226,255,235,.86)",
        fontFamily: `"SFMono-Regular", Consolas, "Liberation Mono", "Courier New", monospace`,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".18em",
        background: "linear-gradient(90deg, rgba(144,224,109,.05), rgba(68,215,255,.06)), rgba(0,0,0,.28)",
        border: "1px solid rgba(144,224,109,.22)",
        boxShadow: "0 0 22px rgba(0,0,0,.72), 0 0 24px rgba(144,224,109,.08)",
    },
    loadingHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
    },
    gauge: {
        height: 8,
        overflow: "hidden",
        background:
            "repeating-linear-gradient(to right, rgba(144,224,109,.14) 0, rgba(144,224,109,.14) 1px, transparent 1px, transparent 8px), rgba(255,255,255,.04)",
        border: "1px solid rgba(144,224,109,.2)",
    },
    gaugeFill: {
        display: "block",
        height: "100%",
        boxShadow: "0 0 18px rgba(144,224,109,.22)",
        transition: "width .16s linear",
    },
    nav: {
        position: "relative",
        width: "100%",
        minHeight: 96,
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: ".02em",
        textTransform: "uppercase",
        animation: "homepageNavEnter .9s cubic-bezier(.19,1,.22,1) both .12s",
    },
    navLeft: { position: "relative", display: "grid", justifyItems: "start", gap: 4 },
    navCenter: {
        position: "absolute",
        left: "50%",
        top: 24,
        transform: "translateX(-50%)",
        color: "#fff",
        textAlign: "center",
        lineHeight: 1.6,
    },
    navRight: { display: "grid", justifyItems: "end", gap: 4 },
    menu: {
        position: "absolute",
        top: "100%",
        left: 0,
        width: 300,
        display: "grid",
        gap: 1,
        padding: 8,
        background: "rgba(0,0,0,.78)",
        border: "1px solid rgba(144,224,109,.2)",
        boxShadow: "0 26px 54px rgba(0,0,0,.54)",
        transition: "opacity .36s ease, transform .48s cubic-bezier(.19,1,.22,1)",
        zIndex: 10,
    },
    hero: {
        position: "relative",
        width: "100%",
        minHeight: "calc(100vh - 96px)",
        overflow: "hidden",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        textTransform: "uppercase",
    },
    cursorLayer: {
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 999,
    },
}

const globalCss = `
.homepage-rainbow-border {
    position: absolute;
    inset: 24px;
    border: 2px solid var(--border-a);
    border-radius: 24px;
    animation: homepageRainbowBorder linear infinite;
}
@keyframes homepageRainbowBorder {
    0%, 100% { border-color: var(--border-a); box-shadow: 0 0 28px color-mix(in srgb, var(--border-a) 28%, transparent); }
    50% { border-color: var(--border-b); box-shadow: 0 0 28px color-mix(in srgb, var(--border-b) 28%, transparent); }
}
.homepage-nav-pill,
.homepage-menu-item {
    color: #a0a0a0;
    text-decoration: none;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 12px;
    padding: 2px 10px;
    min-height: 20px;
    font: inherit;
    line-height: 1.6;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
}
.homepage-nav-pill:hover,
.homepage-menu-item:hover {
    background: #90e06d;
    color: #000;
    border-color: #90e06d;
}
.homepage-home-button {
    display: grid;
}
.homepage-menu-button {
    appearance: none;
    cursor: pointer;
    text-align: left;
}
.homepage-menu-item {
    display: block;
    border-radius: 0;
    color: rgba(255,255,255,.78);
}
.homepage-float {
    position: absolute;
    color: transparent;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 2px currentColor;
    font-size: clamp(3.1rem, 7.4vw, 8.6rem);
    font-weight: 700;
    letter-spacing: -.055em;
    line-height: .85;
    text-decoration: none;
    transform: translate3d(var(--x, 0px), var(--y, 0px), 0);
    animation: homepageRainbowType linear infinite, homepageTypeEnter 1.2s cubic-bezier(.19,1,.22,1) both .16s;
}
.homepage-float:hover {
    -webkit-text-stroke-width: 2.4px;
}
@keyframes homepageRainbowType {
    0%, 100% { color: #90e06d; text-shadow: 0 0 30px rgba(144,224,109,.25); }
    16% { color: #44d7ff; text-shadow: 0 0 30px rgba(68,215,255,.24); }
    32% { color: #b78cff; text-shadow: 0 0 30px rgba(183,140,255,.24); }
    48% { color: #ff4fd8; text-shadow: 0 0 30px rgba(255,79,216,.22); }
    64% { color: #ff5a3d; text-shadow: 0 0 30px rgba(255,90,61,.2); }
    82% { color: #f7d147; text-shadow: 0 0 30px rgba(247,209,71,.24); }
}
@keyframes homepageTypeEnter {
    from { opacity: 0; transform: translate3d(var(--x, 0px), calc(var(--y, 0px) + 24px), 0) scale(.985); filter: blur(8px); }
    to { opacity: 1; transform: translate3d(var(--x, 0px), var(--y, 0px), 0) scale(1); filter: blur(0); }
}
@keyframes homepageNavEnter {
    from { opacity: 0; transform: translateY(-28px); filter: blur(7px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
.homepage-cursor-particle {
    position: absolute;
    font-family: "SFMono-Regular", Consolas, monospace;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: .8px currentColor;
    text-shadow: 0 0 12px currentColor;
    transform: translate3d(-50%, -50%, 0) scale(.72);
    animation: homepageCursorSymbolFade 1.05s cubic-bezier(.19,1,.22,1) forwards;
}
@keyframes homepageCursorSymbolFade {
    0% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(.55) rotate(0deg); }
    18% { opacity: .78; }
    100% { opacity: 0; transform: translate3d(calc(-50% + var(--dx)), calc(-50% + var(--dy)), 0) scale(1.08) rotate(var(--rotate)); }
}
@media (max-width: 760px) {
    .homepage-rainbow-border { inset: 14px; border-radius: 18px; }
    .homepage-float { font-size: clamp(2.4rem, 13vw, 4.8rem); -webkit-text-stroke-width: 1.25px; max-width: 86vw; }
    .homepage-nav-pill, .homepage-menu-item { padding: 2px 8px; }
}
`

addPropertyControls(HomepageComposition, {
    brandText: { type: ControlType.String, title: "Brand", defaultValue: "YUSUKE / KOGURE" },
    portfolioText: { type: ControlType.String, title: "Portfolio", defaultValue: "PORTFOLIO" },
    menuText: { type: ControlType.String, title: "Menu", defaultValue: "MENU" },
    loadingText: { type: ControlType.String, title: "Loading", defaultValue: "LOADING" },
    loadingBarColor: { type: ControlType.Color, title: "Load Bar", defaultValue: "#90e06d" },
    introDuration: { type: ControlType.Number, title: "Intro", defaultValue: 1900, min: 600, max: 5000, step: 100, unit: "ms" },
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#000000" },
    borderColorA: { type: ControlType.Color, title: "Border A", defaultValue: "#90e06d" },
    borderColorB: { type: ControlType.Color, title: "Border B", defaultValue: "#f7d147" },
    rainColors: { type: ControlType.String, title: "Rain Colors", defaultValue: "#90e06d,#44d7ff,#f7d147,#ff4fd8,#b78cff,#ffffff" },
    rainSpeed: { type: ControlType.Number, title: "Rain Speed", defaultValue: 1, min: 0.2, max: 2.5, step: 0.05 },
    rainbowDuration: { type: ControlType.Number, title: "Rainbow", defaultValue: 9, min: 3, max: 24, step: 0.5, unit: "s" },
    cursorTrail: { type: ControlType.Boolean, title: "Cursor Trail", defaultValue: true },
    cursorTrailColors: { type: ControlType.String, title: "Trail Colors", defaultValue: "#90e06d,#f7d147,#ff4fd8,#44d7ff,#ff5a3d,#b78cff,#ffffff" },
    graphicLabel: { type: ControlType.String, title: "Graphic", defaultValue: "GRAPHIC DESIGN" },
    graphicUrl: { type: ControlType.String, title: "Graphic URL", defaultValue: "/graphic-design" },
    motionLabel: { type: ControlType.String, title: "Motion", defaultValue: "MOTION GRAPHIC" },
    motionUrl: { type: ControlType.String, title: "Motion URL", defaultValue: "/motion-graphic" },
    threeLabel: { type: ControlType.String, title: "3D", defaultValue: "3D & VFX" },
    threeUrl: { type: ControlType.String, title: "3D URL", defaultValue: "/3d-vfx" },
    filmLabel: { type: ControlType.String, title: "Film", defaultValue: "FILM & PHOTOGRAPHY" },
    filmUrl: { type: ControlType.String, title: "Film URL", defaultValue: "/film-photography" },
    aboutText: { type: ControlType.String, title: "About", defaultValue: "ABOUT / CONTACT" },
    aboutUrl: { type: ControlType.String, title: "About URL", defaultValue: "/about-contact" },
    socialOne: { type: ControlType.String, title: "Social 1", defaultValue: "INSTAGRAM" },
    socialOneUrl: { type: ControlType.String, title: "Social URL 1", defaultValue: "https://www.instagram.com" },
    socialTwo: { type: ControlType.String, title: "Social 2", defaultValue: "LINKEDIN" },
    socialTwoUrl: { type: ControlType.String, title: "Social URL 2", defaultValue: "https://www.linkedin.com" },
    socialThree: { type: ControlType.String, title: "Social 3", defaultValue: "EMAIL" },
    socialThreeUrl: { type: ControlType.String, title: "Social URL 3", defaultValue: "mailto:studio@example.com" },
    movement: { type: ControlType.Number, title: "Movement", defaultValue: 1, min: 0, max: 2, step: 0.05 },
})
