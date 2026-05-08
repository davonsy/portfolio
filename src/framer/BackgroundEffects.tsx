import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>/?"
const trailSymbols = ["☆", "✧", "⚡", "♧"]

const splitColors = (value: string) =>
    value
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean)

function MatrixRain({ speed, colors }: { speed: number; colors: string[] }) {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

    React.useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        let columns: Array<{ y: number; speed: number; color: number; glitch: number }> = []
        let frame = 0
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
                speed: (0.16 + Math.random() * 0.38) * speed,
                color: Math.floor(Math.random() * colors.length),
                glitch: Math.random(),
            }))
        }

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.085)"
            ctx.fillRect(0, 0, width, height)
            ctx.font = `${fontSize}px Inter, monospace`
            ctx.textAlign = "center"

            columns.forEach((column, index) => {
                const glitch = column.glitch > 0.88 && frame % 52 < 3
                const character = symbols[Math.floor(Math.random() * symbols.length)]
                ctx.fillStyle = glitch ? "#ffffff" : colors[(Math.floor(frame / 72) + column.color + index) % colors.length]
                ctx.globalAlpha = glitch ? 0.7 : 0.18 + Math.random() * 0.32
                ctx.fillText(character, index * fontSize + fontSize / 2, column.y)
                column.y += fontSize * column.speed
                if (column.y > height + 220) {
                    column.y = -Math.random() * height * 0.45
                    column.speed = (0.16 + Math.random() * 0.38) * speed
                    column.color = Math.floor(Math.random() * colors.length)
                    column.glitch = Math.random()
                }
            })

            ctx.globalAlpha = 1
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
    }, [speed, colors])

    return <canvas style={styles.rainCanvas} ref={canvasRef} aria-hidden="true" />
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
            <style>{cursorStyles}</style>
            {particles.map((particle) => (
                <span
                    className="cursor-symbol-particle"
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

export default function BackgroundEffects({
    backgroundColor = "#000000",
    borderColorA = "#90e06d",
    borderColorB = "#f7d147",
    rainSpeed = 1,
    rainbowDuration = 9,
    rainColors = "#90e06d,#44d7ff,#f7d147,#ff4fd8,#b78cff,#ffffff",
    cursorTrail = true,
    cursorTrailColors = "#90e06d,#f7d147,#ff4fd8,#44d7ff,#ff5a3d,#b78cff,#ffffff",
    showBorder = true,
}) {
    const matrixColors = React.useMemo(() => splitColors(rainColors), [rainColors])
    const trailColors = React.useMemo(() => splitColors(cursorTrailColors), [cursorTrailColors])

    return (
        <div style={{ ...styles.root, background: backgroundColor }}>
            <style>{`
                @keyframes bgRainbowBorder {
                    0%, 100% { border-color: ${borderColorA}; box-shadow: 0 0 28px ${borderColorA}33; }
                    50% { border-color: ${borderColorB}; box-shadow: 0 0 28px ${borderColorB}33; }
                }
            `}</style>
            <MatrixRain speed={rainSpeed} colors={matrixColors.length ? matrixColors : ["#90e06d"]} />
            {showBorder && <div style={{ ...styles.border, animationDuration: `${rainbowDuration}s` }} />}
            <CursorTrail enabled={cursorTrail} colors={trailColors.length ? trailColors : ["#90e06d"]} />
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    root: { position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" },
    rainCanvas: { position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "screen", opacity: 0.62 },
    border: {
        position: "absolute",
        inset: 24,
        border: "2px solid #90e06d",
        borderRadius: 24,
        animationName: "bgRainbowBorder",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
    },
    cursorLayer: { position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 999 },
}

const cursorStyles = `
.cursor-symbol-particle {
    position: absolute;
    font-family: "SFMono-Regular", Consolas, monospace;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: .8px currentColor;
    text-shadow: 0 0 12px currentColor;
    transform: translate3d(-50%, -50%, 0) scale(.72);
    animation: cursorSymbolFade 1.05s cubic-bezier(.19,1,.22,1) forwards;
}
@keyframes cursorSymbolFade {
    0% { opacity: 0; transform: translate3d(-50%, -50%, 0) scale(.55) rotate(0deg); }
    18% { opacity: .78; }
    100% { opacity: 0; transform: translate3d(calc(-50% + var(--dx)), calc(-50% + var(--dy)), 0) scale(1.08) rotate(var(--rotate)); }
}`

addPropertyControls(BackgroundEffects, {
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#000000" },
    borderColorA: { type: ControlType.Color, title: "Border A", defaultValue: "#90e06d" },
    borderColorB: { type: ControlType.Color, title: "Border B", defaultValue: "#f7d147" },
    rainbowDuration: { type: ControlType.Number, title: "Rainbow", defaultValue: 9, min: 3, max: 24, step: 0.5, unit: "s" },
    rainSpeed: { type: ControlType.Number, title: "Rain Speed", defaultValue: 1, min: 0.2, max: 2.5, step: 0.05 },
    rainColors: { type: ControlType.String, title: "Rain Colors", defaultValue: "#90e06d,#44d7ff,#f7d147,#ff4fd8,#b78cff,#ffffff" },
    showBorder: { type: ControlType.Boolean, title: "Border", defaultValue: true },
    cursorTrail: { type: ControlType.Boolean, title: "Cursor Trail", defaultValue: true },
    cursorTrailColors: { type: ControlType.String, title: "Trail Colors", defaultValue: "#90e06d,#f7d147,#ff4fd8,#44d7ff,#ff5a3d,#b78cff,#ffffff" },
})
