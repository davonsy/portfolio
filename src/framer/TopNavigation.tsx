import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function TopNavigation({
    brandText = "YUSUKE / KOGURE",
    portfolioText = "PORTFOLIO",
    menuText = "MENU",
    sectionOne = "GRAPHIC DESIGN",
    sectionOneUrl = "/graphic-design",
    sectionTwo = "MOTION GRAPHIC",
    sectionTwoUrl = "/motion-graphic",
    sectionThree = "3D & VFX",
    sectionThreeUrl = "/3d-vfx",
    sectionFour = "FILM & PHOTOGRAPHY",
    sectionFourUrl = "/film-photography",
    aboutText = "ABOUT / CONTACT",
    aboutUrl = "/about-contact",
    socialOne = "INSTAGRAM",
    socialOneUrl = "https://www.instagram.com",
    socialTwo = "LINKEDIN",
    socialTwoUrl = "https://www.linkedin.com",
    socialThree = "EMAIL",
    socialThreeUrl = "mailto:studio@example.com",
}) {
    const [open, setOpen] = React.useState(false)
    const [clock, setClock] = React.useState("00:00:00")
    const [zone, setZone] = React.useState("LOCAL")

    React.useEffect(() => {
        const update = () => {
            const now = new Date()
            setClock(new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now))
            const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(now)
            setZone(parts.find((part) => part.type === "timeZoneName")?.value || "LOCAL")
        }
        update()
        const timer = window.setInterval(update, 1000)
        return () => window.clearInterval(timer)
    }, [])

    const sections = [
        [sectionOne, sectionOneUrl],
        [sectionTwo, sectionTwoUrl],
        [sectionThree, sectionThreeUrl],
        [sectionFour, sectionFourUrl],
        [aboutText, aboutUrl],
    ]

    return (
        <nav style={styles.nav}>
            <div style={styles.left}>
                <a style={{ ...styles.pill, ...styles.home }} href="/">
                    <span>{brandText}</span>
                    <span>{portfolioText}</span>
                </a>
                <button style={styles.pillButton} onClick={() => setOpen(!open)}>
                    {menuText}
                </button>
                <div style={{ ...styles.menu, opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(-8px)", pointerEvents: open ? "auto" : "none" }}>
                    {sections.map(([label, url]) => (
                        <a style={styles.menuItem} href={url} key={label}>
                            {label}
                        </a>
                    ))}
                </div>
            </div>
            <div style={styles.center}>
                {clock} ({zone})
                <br />
                WORLDWIDE
            </div>
            <div style={styles.right}>
                <a style={styles.pill} href={socialOneUrl}>{socialOne}</a>
                <a style={styles.pill} href={socialTwoUrl}>{socialTwo}</a>
                <a style={styles.pill} href={socialThreeUrl}>{socialThree}</a>
            </div>
        </nav>
    )
}

const pillBase: React.CSSProperties = {
    color: "#a0a0a0",
    textDecoration: "none",
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 12,
    padding: "2px 10px",
    font: "inherit",
    minHeight: 20,
}

const styles: Record<string, React.CSSProperties> = {
    nav: {
        position: "relative",
        width: "100%",
        minHeight: 96,
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        fontFamily: "Inter, sans-serif",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: ".02em",
        textTransform: "uppercase",
    },
    left: { position: "relative", display: "grid", justifyItems: "start", gap: 4 },
    center: { position: "absolute", left: "50%", top: 24, transform: "translateX(-50%)", color: "#fff", textAlign: "center", lineHeight: 1.6 },
    right: { display: "grid", justifyItems: "end", gap: 4 },
    pill: pillBase,
    pillButton: { ...pillBase, cursor: "pointer", appearance: "none" },
    home: { display: "grid", lineHeight: 1.6 },
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
    menuItem: { ...pillBase, borderRadius: 0, color: "rgba(255,255,255,.78)" },
}

addPropertyControls(TopNavigation, {
    brandText: { type: ControlType.String, title: "Brand", defaultValue: "YUSUKE / KOGURE" },
    portfolioText: { type: ControlType.String, title: "Portfolio", defaultValue: "PORTFOLIO" },
    menuText: { type: ControlType.String, title: "Menu", defaultValue: "MENU" },
    sectionOne: { type: ControlType.String, title: "Section 1", defaultValue: "GRAPHIC DESIGN" },
    sectionOneUrl: { type: ControlType.String, title: "URL 1", defaultValue: "/graphic-design" },
    sectionTwo: { type: ControlType.String, title: "Section 2", defaultValue: "MOTION GRAPHIC" },
    sectionTwoUrl: { type: ControlType.String, title: "URL 2", defaultValue: "/motion-graphic" },
    sectionThree: { type: ControlType.String, title: "Section 3", defaultValue: "3D & VFX" },
    sectionThreeUrl: { type: ControlType.String, title: "URL 3", defaultValue: "/3d-vfx" },
    sectionFour: { type: ControlType.String, title: "Section 4", defaultValue: "FILM & PHOTOGRAPHY" },
    sectionFourUrl: { type: ControlType.String, title: "URL 4", defaultValue: "/film-photography" },
    aboutText: { type: ControlType.String, title: "About", defaultValue: "ABOUT / CONTACT" },
    aboutUrl: { type: ControlType.String, title: "About URL", defaultValue: "/about-contact" },
    socialOne: { type: ControlType.String, title: "Social 1", defaultValue: "INSTAGRAM" },
    socialOneUrl: { type: ControlType.String, title: "URL", defaultValue: "https://www.instagram.com" },
    socialTwo: { type: ControlType.String, title: "Social 2", defaultValue: "LINKEDIN" },
    socialTwoUrl: { type: ControlType.String, title: "URL", defaultValue: "https://www.linkedin.com" },
    socialThree: { type: ControlType.String, title: "Social 3", defaultValue: "EMAIL" },
    socialThreeUrl: { type: ControlType.String, title: "URL", defaultValue: "mailto:studio@example.com" },
})
