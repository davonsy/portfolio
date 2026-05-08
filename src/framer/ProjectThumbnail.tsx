import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function ProjectThumbnail({
    title = "PROJECT TITLE",
    category = "GRAPHIC DESIGN",
    year = "2026",
    image,
    link = "/projects/project-title",
}) {
    return (
        <a href={link} style={styles.card}>
            <div style={styles.imageWrap}>
                {image ? <img src={image} alt="" style={styles.image} /> : <div style={styles.placeholder} />}
            </div>
            <div style={styles.meta}>
                <span>{title}</span>
                <span>{category}</span>
                <span>{year}</span>
            </div>
        </a>
    )
}

const styles: Record<string, React.CSSProperties> = {
    card: {
        display: "grid",
        gridTemplateRows: "auto auto",
        overflow: "hidden",
        color: "rgba(255,255,255,.78)",
        textDecoration: "none",
        background: "linear-gradient(135deg, rgba(144,224,109,.08), rgba(68,215,255,.04)), rgba(255,255,255,.035)",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 20px 50px rgba(0,0,0,.32)",
        fontFamily: "Inter, sans-serif",
        textTransform: "uppercase",
    },
    imageWrap: { aspectRatio: "16 / 9", overflow: "hidden", background: "rgba(0,0,0,.35)" },
    image: { width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.72) contrast(1.12) brightness(.78)" },
    placeholder: {
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at 30% 20%, rgba(144,224,109,.16), transparent 24%), repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 1px, transparent 1px 8px)",
    },
    meta: {
        display: "grid",
        gridTemplateColumns: "1fr auto auto",
        gap: 10,
        padding: 12,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: ".04em",
        borderTop: "1px solid rgba(255,255,255,.06)",
    },
}

addPropertyControls(ProjectThumbnail, {
    title: { type: ControlType.String, title: "Title", defaultValue: "PROJECT TITLE" },
    category: { type: ControlType.String, title: "Category", defaultValue: "GRAPHIC DESIGN" },
    year: { type: ControlType.String, title: "Year", defaultValue: "2026" },
    image: { type: ControlType.Image, title: "Thumbnail" },
    link: { type: ControlType.String, title: "Link", defaultValue: "/projects/project-title" },
})
