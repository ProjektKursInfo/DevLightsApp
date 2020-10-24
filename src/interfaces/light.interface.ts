import Leds from "./led.interface";

export default interface Light {
    name: string,
    uuid: string,
    leds: Leds,
    count: number
}