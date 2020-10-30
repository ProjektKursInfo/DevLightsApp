import { Light } from "../../interfaces";
import {
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,

  SET_ALL_LIGHTS
} from "../actions/types";
import defaultstate from "../defaultstate";

function lights(state = defaultstate.lights, action: any) {
  let lights: Light[];
  let light: Light;
  let index: number;
  switch (action.type) {
    case SET_ALL_LIGHTS:
      lights = action.lights;
      return lights;
    case EDIT_LIGHT_NAME:
      lights = [...state];
      index = lights.findIndex((l) => (l.uuid = action.id));
      light = lights[index];
      light.name = action.name;
      lights[index] = light;
      return lights;
    case EDIT_LIGHT_COLOR:
      lights = [...state];
      index = lights.findIndex((l) => (l.uuid = action.id));
      light = lights[index];
      light.leds.colors = action.colors;
      lights[index] = light;
      return lights;
    case EDIT_LED_COUNT:
      lights = [...state];
      index = lights.findIndex((l) => (l.uuid = action.id));
      light = lights[index];
      light.count = action.count;
      lights[index] = light;
      return lights;
    default:
      return state;
  }
}
export default lights;
