import React from "react"
import { useViewModel } from '../../../kit/reactivity/react'

export class HomePageComponent {
  public isValue = true
  public title = 'Initial Value'

  public setTitle(value: string) {
    if (value.length < 5) {
      this.isValue = false
    } else {
      this.isValue = true
    }
    this.title = value
  }
}

export const HomePage = () => {
  const vm = useViewModel(HomePageComponent)

  return <div>
    <div 
      style={{ color: vm.isValue ? 'black' : 'red' }}>
      {vm.title}
    </div>
    <input 
      type="text" 
      onChange={e => vm.setTitle(e.target.value)} />
  </div>
}
