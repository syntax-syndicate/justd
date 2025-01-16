"use client"

import { Keyboard, type KeyboardProps } from "@/components/ui/keyboard"
import { cn } from "@/utils/classes"
import { IconSearch } from "justd-icons"
import { createContext, use, useEffect } from "react"
import { useFilter } from "react-aria"
import {
  UNSTABLE_Autocomplete as Autocomplete,
  type AutocompleteProps,
  Button,
  Collection,
  type CollectionRenderer,
  UNSTABLE_CollectionRendererContext as CollectionRendererContext,
  UNSTABLE_DefaultCollectionRenderer as DefaultCollectionRenderer,
  Dialog,
  Header,
  Menu as MenuPrimitive,
  type MenuProps,
  MenuSection,
  type MenuTriggerProps,
  Modal,
  ModalContext,
  ModalOverlay,
  OverlayTriggerStateContext,
  SearchField,
  type SearchFieldProps,
} from "react-aria-components"
import { twJoin } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { Input, Loader, Menu, type MenuSectionProps, composeTailwindRenderProps } from "ui"

interface CommandMenuProviderProps {
  isPending?: boolean
  escapeButton?: boolean
}

const CommandMenuContext = createContext<CommandMenuProviderProps | undefined>(undefined)

const useCommandMenu = () => {
  const context = use(CommandMenuContext)

  if (!context) {
    throw new Error("useCommandMenu must be used within a <CommandMenuProvider />")
  }

  return context
}

interface CommandMenuProps extends AutocompleteProps, MenuTriggerProps, CommandMenuProviderProps {
  isDismissable?: boolean
  "aria-label"?: string
  shortcut?: string
  isBlurred?: boolean
}

const CommandMenu = ({
  onOpenChange,
  isDismissable = true,
  escapeButton = true,
  isPending,
  isBlurred,
  shortcut,
  ...props
}: CommandMenuProps) => {
  const { contains } = useFilter({ sensitivity: "base" })
  const filter = (textValue: string, inputValue: string) => contains(textValue, inputValue)
  useEffect(() => {
    if (!shortcut) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === shortcut && (e.metaKey || e.ctrlKey)) {
        onOpenChange?.(true)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [shortcut, onOpenChange])
  return (
    <CommandMenuContext value={{ isPending: isPending, escapeButton: escapeButton }}>
      <ModalContext value={{ isOpen: props.isOpen, onOpenChange: onOpenChange }}>
        <ModalOverlay
          isDismissable={isDismissable}
          className={twJoin([
            "fixed inset-0 z-50 max-h-(--visual-viewport-height) bg-dark/15 dark:bg-dark/40",
            "data-entering:fade-in data-exiting:fade-out data-entering:animate-in data-exiting:animate-in",
            isBlurred ? "backdrop-blur" : "",
          ])}
        >
          <Modal
            className={twJoin([
              "fixed top-auto bottom-0 left-[50%] z-50 grid h-[calc(100vh-35%)] w-full max-w-full translate-x-[-50%] gap-4 overflow-hidden rounded-t-2xl bg-overlay text-overlay-fg shadow-lg ring-1 ring-fg/10 sm:top-[6rem] sm:bottom-auto sm:h-auto sm:w-full sm:max-w-2xl sm:rounded-xl dark:ring-border forced-colors:border",
              "data-entering:fade-in-0 data-entering:slide-in-from-bottom sm:data-entering:slide-in-from-bottom-0 sm:data-entering:zoom-in-95 data-entering:animate-in data-entering:duration-300 sm:data-entering:duration-300",
              "data-exiting:fade-out sm:data-exiting:zoom-out-95 data-exiting:slide-out-to-bottom-56 sm:data-exiting:slide-out-to-bottom-0 data-exiting:animate-out data-exiting:duration-200",
            ])}
            {...props}
          >
            <Dialog aria-label={props["aria-label"] ?? "Command Menu"} className="outline-hidden">
              <Autocomplete filter={filter} {...props} />
            </Dialog>
          </Modal>
        </ModalOverlay>
      </ModalContext>
    </CommandMenuContext>
  )
}

interface CommandMenuSearchProps extends SearchFieldProps {
  placeholder?: string
  className?: string
}

const CommandMenuSearch = ({ className, placeholder, ...props }: CommandMenuSearchProps) => {
  const state = use(OverlayTriggerStateContext)!
  const { isPending, escapeButton } = useCommandMenu()
  return (
    <SearchField
      aria-label="Quick search"
      autoFocus
      className={cn("flex w-full items-center border-b px-2.5 py-1", className)}
      {...props}
    >
      {isPending ? (
        <Loader className="size-5" variant="spin" />
      ) : (
        <IconSearch
          data-slot="command-menu-search-icon"
          className="size-5 shrink-0 text-muted-fg"
        />
      )}
      <Input
        placeholder={placeholder ?? "Search..."}
        className="w-full [&::-webkit-search-cancel-button]:hidden"
      />
      {escapeButton && (
        <Button
          onPress={() => state?.close()}
          className="hidden cursor-pointer rounded border text-current/90 data-hovered:bg-muted lg:inline lg:px-1.5 lg:py-0.5 lg:text-xs"
        >
          Esc
        </Button>
      )}
    </SearchField>
  )
}

const CommandMenuList = <T extends object>({ className, ...props }: MenuProps<T>) => {
  return (
    <CollectionRendererContext.Provider value={renderer}>
      <MenuPrimitive
        className={cn(
          "flex max-h-96 flex-col overflow-y-auto p-2 *:[[role=group]]:mb-6 *:[[role=group]]:last:mb-0",
          className,
        )}
        {...props}
      />
    </CollectionRendererContext.Provider>
  )
}

const commandMenuSectionStyles = tv({
  slots: {
    section: "xss3 flex flex-col gap-y-[calc(var(--spacing)*0.25)]",
    header: "mb-1 block min-w-(--trigger-width) truncate px-2.5 text-muted-fg text-xs",
  },
})

const { section, header } = commandMenuSectionStyles()

const CommandMenuSection = <T extends object>({
  className,
  ref,
  ...props
}: MenuSectionProps<T>) => {
  return (
    <MenuSection ref={ref} className={section({ className })} {...props}>
      {"title" in props && <Header className={header()}>{props.title}</Header>}
      <Collection items={props.items}>{props.children}</Collection>
    </MenuSection>
  )
}

const CommandMenuItem = ({ className, ...props }: React.ComponentProps<typeof Menu.Item>) => {
  const textValue =
    props.textValue || (typeof props.children === "string" ? props.children : undefined)
  return (
    <Menu.Item
      {...props}
      textValue={textValue}
      className={composeTailwindRenderProps(className, "gap-y-0.5")}
    />
  )
}

interface CommandMenuDescriptionProps extends React.ComponentProps<"span"> {
  intent?: "danger" | "warning" | "primary" | "secondary" | "success"
}

const CommandMenuDescription = ({ intent, className, ...props }: CommandMenuDescriptionProps) => {
  return (
    <span
      {...props}
      slot="command-menu-description"
      className={cn(
        "ml-auto hidden text-sm sm:inline",
        intent === "danger"
          ? "text-danger/90 group-data-selected:text-fg/70"
          : intent === "warning"
            ? "text-warning/90 group-data-selected:text-fg/70"
            : intent === "success"
              ? "text-success/90 group-data-selected:text-fg/70"
              : intent === "primary"
                ? "text-fg/90 group-data-selected:text-white/70"
                : "text-muted-fg group-data-selected:text-fg/70",
        className,
      )}
    />
  )
}

const CommandMenuKeyboard = (props: KeyboardProps) => (
  <Keyboard
    classNames={{
      kbd: "hidden group-data-hovered:text-current/90 group-data-focused:text-current/90 lg:inline",
      base: "-mr-1",
    }}
    {...props}
  />
)

const renderer: CollectionRenderer = {
  CollectionRoot(props) {
    if (props.collection.size === 0) {
      return (
        // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
        <div role="menuitem" className="x3tmpy py-6 text-center text-muted-fg text-sm">
          No results found.
        </div>
      )
    }
    return <DefaultCollectionRenderer.CollectionRoot {...props} />
  },
  CollectionBranch: DefaultCollectionRenderer.CollectionBranch,
}

const CommandMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof Menu.Separator>) => (
  <Menu.Separator className={cn("-mx-2", className)} {...props} />
)

CommandMenu.Search = CommandMenuSearch
CommandMenu.List = CommandMenuList
CommandMenu.Item = CommandMenuItem
CommandMenu.Section = CommandMenuSection
CommandMenu.Description = CommandMenuDescription
CommandMenu.Keyboard = CommandMenuKeyboard
CommandMenu.Separator = CommandMenuSeparator

export type { CommandMenuProps, CommandMenuSearchProps, CommandMenuDescriptionProps }
export { CommandMenu }
