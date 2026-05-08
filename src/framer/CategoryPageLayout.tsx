import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function CategoryPageLayout({
    kicker = "SELECTED / PROJECTS",
    title = "GRAPHIC DESIGN",
    description = "",
    children,
}) {
    return (
        <section style={styles.page}>
            <div style={styles.kicker}>{kicker}</div>
            <h1 style={styles.title}>{title}</h1>
            {description && <p style={styles.description}>{description}</p>}
            <div style={styles.content}>{children}</div>
        </section>
    )
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        width: "100%",
        minHeight: "100vh",
        padding: "16vh clamp(34px, 5vw, 86px) 7vh",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        textTransform: "uppercase",
    },
    kicker: {
        width: "fit-content",
        marginBottom: 12,
        padding: "3px 10px",
        color: "#a0a0a0",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: ".08em",
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: 12,
    },
    title: {
        maxWidth: 980,
        margin: "0 0 24px",
        color: "transparent",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "1.5px #90e06d",
        fontSize: "clamp(4rem, 11vw, 12rem)",
        fontWeight: 700,
        letterSpacing: "-.055em",
        lineHeight: 0.84,
    },
    description: {
        maxWidth: 720,
        margin: "-8px 0 28px",
        color: "rgba(255,255,255,.72)",
        fontSize: "clamp(12px, 1.4vw, 18px)",
        lineHeight: 1.45,
    },
    content: { width: "100%" },
}

addPropertyControls(CategoryPageLayout, {
    kicker: { type: ControlType.String, title: "Kicker", defaultValue: "SELECTED / PROJECTS" },
    title: { type: ControlType.String, title: "Title", defaultValue: "GRAPHIC DESIGN" },
    description: { type: ControlType.String, title: "Description", defaultValue: "" },
    children: { type: ControlType.ComponentInstance, title: "Content" },
})
