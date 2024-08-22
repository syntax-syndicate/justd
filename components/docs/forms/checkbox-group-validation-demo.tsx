"use client"

import React from "react"

import { Button, Checkbox, CheckboxGroup, Form } from "ui"

export default function CheckboxValidationDemo() {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <CheckboxGroup className="mb-4" label="Settings" isRequired>
        <Checkbox value="notifications">Enable notifications</Checkbox>
        <Checkbox value="auto_update">Auto-update applications</Checkbox>
        <Checkbox value="dark_mode">Enable dark mode</Checkbox>
        <Checkbox value="location_access">Allow location access</Checkbox>
        <Checkbox value="two_factor_auth">Enable two-factor authentication</Checkbox>
      </CheckboxGroup>
      <Button type="submit">Submit</Button>
    </Form>
  )
}
