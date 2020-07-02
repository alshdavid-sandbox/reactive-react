import React from "react"
import { useViewModel } from '../../../kit/reactivity/react'

export class HomePageComponent {
  title = 'Hello World'
}

export const HomePage = () => {
  const vm = useViewModel(new HomePageComponent())

  return <div>
    <div>{vm.title}</div>
    <input 
      type="text" 
      onChange={e => vm.title = e.target.value} />
  </div>
}
