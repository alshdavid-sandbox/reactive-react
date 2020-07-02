import { useEffect, useState } from "react"
import { create, subscribe } from "../create"

export const useViewModel = <T,>(source: T): T => {
  const [ vm ] = useState(source)
  const forceUpdate = useState(Object.create(null))[1]
  
  useEffect(() => {
    const vm$ = create(vm)
    const sub = subscribe(vm$, () => forceUpdate(Object.create(null)))
    return () => sub.unsubscribe()
  }, [source])

  return vm
}