// @ts-ignore
import * as React from "react"
// @ts-ignore
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { cn } from "../../lib/utils"

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) =>
  React.createElement('svg',
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      'aria-hidden': "true",
      ...props
    },
    React.createElement('path', { d: "M6 9l6 6 6-6" })
  )

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, ref: React.Ref<React.ElementRef<typeof AccordionPrimitive.Item>>) =>
  React.createElement(AccordionPrimitive.Item, {
    ref,
    className: cn("border-b", className),
    ...props,
  })
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>, ref: React.Ref<React.ElementRef<typeof AccordionPrimitive.Trigger>>) =>
  React.createElement(
    AccordionPrimitive.Header,
    { className: "flex" },
    React.createElement(
      AccordionPrimitive.Trigger,
      {
        ref,
        className: cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        ),
        ...props,
      },
      children,
      React.createElement(ChevronDown, {
        className: "h-4 w-4 shrink-0 transition-transform duration-200",
      })
    )
  )
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className = "", children, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & { children?: React.ReactNode }, ref: React.Ref<React.ElementRef<typeof AccordionPrimitive.Content>>) =>
  React.createElement(
    AccordionPrimitive.Content,
    {
      ref,
      className:
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      ...props,
    },
    React.createElement(
      "div",
      { className: cn("pb-4 pt-0", className) },
      children
    )
  )
)

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
