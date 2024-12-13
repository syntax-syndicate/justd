"use client"

import { Checkbox, CheckboxGroup } from "ui"

export default function CheckboxGroupDemo() {
  return (
    <CheckboxGroup label="Settings">
      <Checkbox value="notifications">Enable notifications</Checkbox>
      <Checkbox value="auto_update">Auto-update applications</Checkbox>
      <Checkbox value="dark_mode">Enable dark mode</Checkbox>
      <Checkbox value="location_access">Allow location access</Checkbox>
      <Checkbox value="two_factor_auth">Enable two-factor authentication</Checkbox>
    </CheckboxGroup>
  )
}
