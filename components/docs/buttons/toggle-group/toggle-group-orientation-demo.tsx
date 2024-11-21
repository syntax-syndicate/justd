import {
  IconBell,
  IconBellFill,
  IconMoonFill,
  IconSun,
  IconTranslate,
  IconTranslateFill
} from "justd-icons"
import { Toggle, ToggleGroup } from "ui"

export default function ToggleGroupOrientationDemo() {
  return (
    <div>
      <ToggleGroup orientation="vertical">
        <Toggle>
          {({ isSelected }) => (
            <>
              {isSelected ? <IconMoonFill /> : <IconSun />}
              {isSelected ? "Dark" : "Light"}Mode
            </>
          )}
        </Toggle>
        <Toggle>
          {({ isSelected }) => (
            <>
              {isSelected ? <IconBellFill /> : <IconBell />}
              Notifications {isSelected ? "On" : "Off"}
            </>
          )}
        </Toggle>
        <Toggle>
          {({ isSelected }) => (
            <>
              {isSelected ? <IconTranslateFill /> : <IconTranslate />}
              Always Translate
            </>
          )}
        </Toggle>
      </ToggleGroup>
    </div>
  )
}
