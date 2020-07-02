import { Subject, Unsubscriber, Callback } from '../observable'
import { isArray, isObject } from './check-type'

export function subscribe<T>(value: T, cb: Callback<T>): Unsubscriber {
  return (value as any).__subscribe(() => cb(value))
}

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

export function create<T = any>(source: T): T {
  const update$ = new Subject<void>()
  const proxy = observe(source, update$)
  proxy.__subscribe = update$.subscribe.bind(update$)
  return proxy
}

export function observe(
  source: any, 
  update$: Subject<void>
): any {
  if (isArray(source)) {
    return observeArray(source, update$)
  }
  if (isObject(source)) {
    return observeObject(source, update$)
  }
}

export const observeObject = (
  source: Array<any>, 
  update$: Subject<void>,
) => {
  for (const key in source) {
    if (isArray(source[key])) {
      source[key] = observeArray(source[key], update$)
    }
    if (isObject(source[key])) {
      source[key] = observeObject(source[key], update$)
    }
    const proxy: any = {}
    proxy[key] = source[key]
    Object.defineProperty(source, key, {
      enumerable: true,
      get: () => {
        return proxy[key]
      },
      set: (value) => {
        if (proxy[key] === value) {
          return true
        }
        proxy[key] = value
        update$.next()
      }
    })
  } 
  return source
}

export const observeArray = (
  source: Array<any>, 
  update$: Subject<void>,
) => {
  for (let i = 0; i < source.length; i++) {
    if (isArray(source[i])) {
      source[i] = observeArray(source[i], update$)
    }
    if (isObject(source[i])) {
      source[i] = observeObject(source[i], update$)
    }
  }
  for (const method of methodsToPatch) {
    patchMethod(source, method, () => {
      observeArray(source, update$)
      update$.next()
    })
  }
  return source
}

export const patchMethod = (target: any, methodKey: string, patch: () => void) => {
  const original = target[methodKey]
  
  target[methodKey] = function () {
    original.apply(target, arguments)
    patch()
  }
}