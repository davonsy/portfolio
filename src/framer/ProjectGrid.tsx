import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function ProjectGrid({ children, columns = 4, gap = 12 }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap,
                width: "100%",
            }}
        >
            {children}
        </div>
    )
}

addPropertyControls(ProjectGrid, {
    children: { type: ControlType.ComponentInstance, title: "Items" },
    columns: { type: ControlType.Number, title: "Columns", defaultValue: 4, min: 1, max: 6, step: 1 },
    gap: { type: ControlType.Number, title: "Gap", defaultValue: 12, min: 0, max: 40, step: 1 },
})
