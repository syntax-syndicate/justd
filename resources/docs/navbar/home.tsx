import { Container, Heading } from "ui"

import { AppLayout } from "./app-layout"

export default function Home() {
  return (
    <Container>
      <Heading>Home</Heading>
    </Container>
  )
}

Home.layout = (page: React.ReactNode) => <AppLayout children={page} />