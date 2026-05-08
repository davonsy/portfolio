import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function ProjectDetailPage({
    title = "PROJECT TITLE",
    category = "GRAPHIC DESIGN",
    year = "2026",
    role = "ART DIRECTION / DESIGN",
    description = "Project description placeholder.",
    heroImage,
    backUrl = "/graphic-design",
}) {
    return (
        <section style={styles.page}>
            <a href={backUrl} style={styles.back}>BACK / INDEX</a>
            <div style={styles.kicker}>PROJECT / DETAIL</div>
            <h1 style={styles.title}>{title}</h1>
            <div style={styles.hero}>{heroImage ? <img src={heroImage} alt="" style={styles.image} /> : null}</div>
            <div style={styles.meta}>
                <span>CATEGORY / {category}</span>
                <span>YEAR / {year}</span>
                <span>ROLE / {role}</span>
            </div>
            <p style={styles.description}>{description}</p>
        </section>
    )
}

const styles: Record<string, React.CSSProperties> = {
    page: { width: "100%", minHeight: "100vh", padding: "16vh clamp(34px, 5vw, 86px) 7vh", color: "#fff", fontFamily: "Inter, sans-serif", textTransform: "uppercase" },
    back: { display: "inline-block", marginBottom: 14, color: "#a0a0a0", textDecoration: "none", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "2px 10px", fontSize: 10 },
    kicker: { width: "fit-content", marginBottom: 12, padding: "3px 10px", color: "#a0a0a0", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12 },
    title: { maxWidth: 980, margin: "0 0 24px", color: "transparent", WebkitTextFillColor: "transparent", WebkitTextStroke: "1.5px #90e06d", fontSize: "clamp(4rem, 11vw, 12rem)", fontWeight: 700, letterSpacing: "-.055em", lineHeight: 0.84 },
    hero: { width: "min(100%, 1100px)", aspectRatio: "16 / 9", overflow: "hidden", border: "1px solid rgba(255,255,255,.09)", background: "rgba(0,0,0,.35)", boxShadow: "0 28px 80px rgba(0,0,0,.42)" },
    image: { width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.72) contrast(1.12) brightness(.78)" },
    meta: { width: "min(100%, 1100px)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12, color: "rgba(255,255,255,.72)", fontSize: 10, fontWeight: 600, letterSpacing: ".05em" },
    description: { maxWidth: 720, marginTop: 22, color: "rgba(255,255,255,.72)", fontSize: "clamp(12px, 1.4vw, 18px)", lineHeight: 1.45 },
}

addPropertyControls(ProjectDetailPage, {
    title: { type: ControlType.String, title: "Title", defaultValue: "PROJECT TITLE" },
    category: { type: ControlType.String, title: "Category", defaultValue: "GRAPHIC DESIGN" },
    year: { type: ControlType.String, title: "Year", defaultValue: "2026" },
    role: { type: ControlType.String, title: "Role", defaultValue: "ART DIRECTION / DESIGN" },
    description: { type: ControlType.String, title: "Description", defaultValue: "Project description placeholder." },
    heroImage: { type: ControlType.Image, title: "Hero Image" },
    backUrl: { type: ControlType.String, title: "Back URL", defaultValue: "/graphic-design" },
})
