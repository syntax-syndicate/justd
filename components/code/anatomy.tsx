"use client"

import React, { useState } from "react"

import { CodeHighlighter } from "@/components/code/code-highlighter"
import { CopyButton } from "@/components/code/copy-button"
import { extractImports, extractJSX } from "@/resources/lib/utils"
import { Group } from "react-aria-components"

interface AnatomyProps extends React.HTMLAttributes<HTMLDivElement> {
  show: string
  message?: string
  title?: string
  ext?: string
}

export const Anatomy = ({ show, ...props }: AnatomyProps) => {
  const [rawSourceCode, setRawSourceCode] = useState<string | null>(null)
  const processedSourceCode = React.useMemo(() => rawSourceCode || null, [rawSourceCode])

  React.useEffect(() => {
    const fetchSourceCode = async () => {
      try {
        const response = await fetch(`/registry/anatomies/${show}.json`)
        if (response.ok) {
          const registryEntry = await response.json()
          setRawSourceCode(registryEntry.files?.[0]?.content || null)
        } else {
          console.error("Failed to fetch registry file:", response.status)
        }
      } catch (error) {
        console.error("Error loading source code:", error)
      }
    }

    fetchSourceCode()
  }, [show])
  if (processedSourceCode) {
    return (
      <section className="my-6 not-prose">
        <p className="mb-4 -mt-2">
          {props.message
            ? props.message
            : "Import the components and use them as shown below, adapting the structure to fit each component."}
        </p>
        {props.title && <figcaption data-rehype-pretty-code-title="">{props.title}</figcaption>}
        {processedSourceCode && (
          <>
            <Group className="relative group">
              <CopyButton className="absolute top-1 right-1" text={extractImports(processedSourceCode as string)} />
              <CodeHighlighter
                max96={false}
                removeLastLine
                code={extractImports(processedSourceCode as string)}
                lang={props.ext}
              />
            </Group>
            <Group className="relative mt-4 group">
              <CopyButton className="absolute top-1 right-1" text={extractJSX(processedSourceCode as string) as any} />
              <CodeHighlighter
                max96={false}
                className="[&_pre]:max-h-[30rem] **:[pre]:p-0"
                code={extractJSX(processedSourceCode as string) as any}
                lang={props.ext}
              />
            </Group>
          </>
        )}
      </section>
    )
  }
}
