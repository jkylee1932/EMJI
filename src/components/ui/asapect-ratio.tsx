import * as React from "react"

type AspectRatioProps = React.HTMLAttributes<HTMLDivElement> & {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 4 / 3, style, children, ...props }, ref) => (
    <div
      ref={ref}
      style={{ position: "relative", width: "100%", paddingBottom: `${100 / ratio}%`, ...style }}
      {...props}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>
    </div>
  )
)

export { AspectRatio }
