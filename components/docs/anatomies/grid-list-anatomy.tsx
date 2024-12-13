import { GridList } from "ui"

export default function GridListAnatomy() {
  return (
    <GridList selectionMode="single" aria-label="Bands">
      <GridList.Item>Nirvana</GridList.Item>
      <GridList.Item>Radiohead</GridList.Item>
      <GridList.Item>Arctic Monkeys</GridList.Item>
    </GridList>
  )
}
