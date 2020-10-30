import { isEqual } from 'lodash'
import { Leds } from './interfaces'

export const ledsEquality = (left: Leds, right: Leds): boolean => {
    return isEqual(left.colors, right.colors) || isEqual(left.pattern, right.pattern)
}