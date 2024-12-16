"use client"

import {
  ColorWheel as ColorWheelPrimitive,
  type ColorWheelProps as ColorWheelPrimitiveProps,
  ColorWheelTrack,
} from "react-aria-components"

import { ColorThumb } from "./color-thumb"

export type ColorWheelProps = Omit<ColorWheelPrimitiveProps, "outerRadius" | "innerRadius">

const ColorWheel = (props: ColorWheelProps) => {
  return (
    <ColorWheelPrimitive {...props} outerRadius={100} innerRadius={74}>
      <ColorWheelTrack
        className="forced-colors:data-disabled:bg-[GrayText] disabled:bg-muted/75"
        style={({ defaultStyle, isDisabled }) => ({
          ...defaultStyle,
          background: isDisabled
            ? undefined
            : `${defaultStyle.background}, repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
        })}
      />
      <ColorThumb />
    </ColorWheelPrimitive>
  )
}

export { ColorWheel }