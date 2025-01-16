"use client"
import { useEffect, useMemo, useState } from "react"
import { CommandMenu } from "ui"

import { useMediaQuery } from "@/utils/use-media-query"
import {
  IconBrandJustd,
  IconColorSwatch,
  IconColors,
  IconCube,
  IconHashtag,
  IconHome,
  IconNotepad,
  IconNotes,
  IconWindowVisit,
} from "justd-icons"
import { useRouter } from "next/navigation"

import { source } from "@/utils/source"
import { useDocsSearch } from "fumadocs-core/search/client"
import type { PageTree } from "fumadocs-core/server"
import { useDebouncedCallback } from "use-debounce"

export interface OpenCloseProps {
  openCmd: boolean
  setOpen?: (isOpen: boolean) => void
}

export function CommandPalette({ openCmd, setOpen }: OpenCloseProps) {
  const router = useRouter()

  const firstChild = source.pageTree.children[0]
  const pageTree = firstChild?.type === "folder" ? firstChild : source.pageTree

  const nonComponentPages = useMemo(
    () => pageTree.children.filter((item) => item.name !== "Components"),
    [pageTree],
  )

  const client = useDocsSearch({
    type: "fetch",
  })

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [value, setValue] = useState(client.search || "")

  const debouncedSetSearch = useDebouncedCallback((newValue: string) => {
    client.setSearch(newValue)
  }, 300)

  const onValueChange = (newValue: string) => {
    setValue(newValue)
    debouncedSetSearch(newValue)
  }

  useEffect(() => {
    setValue(client.search || "")
  }, [client.search])
  return (
    <CommandMenu
      shortcut="k"
      isBlurred
      isOpen={openCmd}
      onOpenChange={setOpen}
      inputValue={value}
      onInputChange={onValueChange}
      isPending={client.query.isLoading}
    >
      <CommandMenu.Search autoFocus={isDesktop} placeholder="Eg. Colors, Date, Chart, etc." />
      <CommandMenu.List className="scrollbar-hidden">
        {client.search === "" && (
          <>
            <CommandMenu.Section>
              <CommandMenu.Item href="/">
                <IconHome /> Home
              </CommandMenu.Item>
              <CommandMenu.Item href="/docs/2.x/getting-started/installation">
                <IconNotes /> Docs
              </CommandMenu.Item>
              <CommandMenu.Item href="/components">
                <IconCube /> Components
              </CommandMenu.Item>
              <CommandMenu.Item href="/colors">
                <IconColors /> Colors
              </CommandMenu.Item>
              <CommandMenu.Item href="/icons">
                <IconBrandJustd /> Icons
              </CommandMenu.Item>
              <CommandMenu.Item href="/themes">
                <IconColorSwatch /> Themes
              </CommandMenu.Item>
              <CommandMenu.Item href="/blocks">
                <IconWindowVisit /> Blocks
              </CommandMenu.Item>
              <CommandMenu.Item href="/blog">
                <IconNotepad /> Blog
              </CommandMenu.Item>
            </CommandMenu.Section>

            {nonComponentPages.map((item, index) => (
              <CommandComposed key={index} node={item} />
            ))}
          </>
        )}

        <CommandMenu.Section>
          {Array.isArray(client.query.data) &&
            client.query.data.map((item) => (
              <CommandMenu.Item
                key={item.id}
                textValue={item.content + item.id}
                onAction={() => router.push(item.url)}
              >
                {item.type !== "page" ? <div className="ms-4 h-full" /> : null}
                {item.type === "page" && <IconCube />}
                {item.type === "heading" && <IconHashtag />}
                {item.type === "text" && <IconNotepad />}
                <p className="w-0 flex-1 truncate">{item.content}</p>
              </CommandMenu.Item>
            ))}
        </CommandMenu.Section>
      </CommandMenu.List>
    </CommandMenu>
  )
}

const CommandComposed = ({
  node,
}: {
  node: PageTree.Node
}) => {
  const router = useRouter()

  if (node.type === "folder") {
    return (
      <CommandMenu.Section title={node.name as string}>
        {node.children.map((child, index) => (
          <CommandComposed key={index} node={child} />
        ))}
      </CommandMenu.Section>
    )
  }

  if (node.type === "separator") {
    return <CommandMenu.Separator />
  }

  if (node.type === "page") {
    return (
      <CommandMenu.Item
        onAction={() => {
          if (node.external) {
            window.open(node.url, "_blank")
          } else {
            router.push(node.url)
          }
        }}
      >
        {node.icon ? node.icon : <IconNotes />}
        {node.name}
      </CommandMenu.Item>
    )
  }
}
