import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

const items = [
    { key: "graphic", x: "8%", y: "22%" },
    { key: "motion", x: "56%", y: "18%" },
    { key: "three", x: "12%", y: "68%" },
    { key: "film", x: "48%", y: "72%" },
]

export default function HomeHero({
    graphicLabel = "GRAPHIC DESIGN",
    graphicUrl = "/graphic-design",
    motionLabel = "MOTION GRAPHIC",
    motionUrl = "/motion-graphic",
    threeLabel = "3D & VFX",
    threeUrl = "/3d-vfx",
    filmLabel = "FILM & PHOTOGRAPHY",
    filmUrl = "/film-photography",
    movement = 1,
}) {
    const refs = React.useRef<Array<HTMLAnchorElement | null>>([])

    React.useEffect(() => {
        const movers = items.map((_, index) => ({
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

    const labels = [
        [graphicLabel, graphicUrl],
        [motionLabel, motionUrl],
        [threeLabel, threeUrl],
        [filmLabel, filmUrl],
    ]

    return (
        <div style={styles.root}>
            <style>{css}</style>
            {items.map((item, index) => (
                <a
                    className="framer-home-float"
                    href={labels[index][1]}
                    key={item.key}
                    ref={(node) => {
                        refs.current[index] = node
                    }}
                    style={{ left: item.x, top: item.y } as React.CSSProperties}
                >
                    {labels[index][0]}
                </a>
            ))}
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    root: { position: "relative", width: "100%", height: "100vh", overflow: "hidden", fontFamily: "Inter, sans-serif", textTransform: "uppercase" },
}

const css = `
.framer-home-float {
    position: absolute;
    color: transparent;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 2px currentColor;
    font-size: clamp(3.5rem, 8vw, 9rem);
    font-weight: 700;
    letter-spacing: -.055em;
    line-height: .85;
    text-decoration: none;
    transform: translate3d(var(--x, 0px), var(--y, 0px), 0);
    animation: framerRainbowType 9s linear infinite;
}
.framer-home-float:hover { -webkit-text-stroke-width: 2.4px; }
@keyframes framerRainbowType {
    0%, 100% { color: #90e06d; text-shadow: 0 0 30px rgba(144,224,109,.25); }
    16% { color: #44d7ff; text-shadow: 0 0 30px rgba(68,215,255,.24); }
    32% { color: #b78cff; text-shadow: 0 0 30px rgba(183,140,255,.24); }
    48% { color: #ff4fd8; text-shadow: 0 0 30px rgba(255,79,216,.22); }
    64% { color: #ff5a3d; text-shadow: 0 0 30px rgba(255,90,61,.2); }
    82% { color: #f7d147; text-shadow: 0 0 30px rgba(247,209,71,.24); }
}`

addPropertyControls(HomeHero, {
    graphicLabel: { type: ControlType.String, title: "Graphic", defaultValue: "GRAPHIC DESIGN" },
    graphicUrl: { type: ControlType.String, title: "Graphic URL", defaultValue: "/graphic-design" },
    motionLabel: { type: ControlType.String, title: "Motion", defaultValue: "MOTION GRAPHIC" },
    motionUrl: { type: ControlType.String, title: "Motion URL", defaultValue: "/motion-graphic" },
    threeLabel: { type: ControlType.String, title: "3D", defaultValue: "3D & VFX" },
    threeUrl: { type: ControlType.String, title: "3D URL", defaultValue: "/3d-vfx" },
    filmLabel: { type: ControlType.String, title: "Film", defaultValue: "FILM & PHOTOGRAPHY" },
    filmUrl: { type: ControlType.String, title: "Film URL", defaultValue: "/film-photography" },
    movement: { type: ControlType.Number, title: "Movement", defaultValue: 1, min: 0, max: 2, step: 0.05 },
})
