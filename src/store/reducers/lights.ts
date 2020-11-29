import { Light } from "../../interfaces";
import {
  EDIT_LED_COUNT,
  EDIT_LIGHT_COLOR,
  EDIT_LIGHT_NAME,

  SET_ALL_LIGHTS,
  SET_LIGHT_STATUS
} from "../actions/types";
import defaultstate from "../defaultstate";

function lightsReducer(
  state = defaultstate.lights,
  action: {type: string, [key: string]: any},
): Light[] {
  let lights: Light[];
  let light: Light;
  let index: number;
  switch (action.type) {
    case SET_ALL_LIGHTS:
      lights = action.lights;
      return lights;
    case EDIT_LIGHT_NAME:
      lights = [...state];
      index = lights.findIndex((l: Light) => (l.uuid === action.id));
      light = lights[index];
      light.name = action.name;
      lights[index] = light;
      return lights;
    case EDIT_LIGHT_COLOR:
      lights = [...state];
      index = lights.findIndex((l: Light) => (l.uuid === action.id));
      light = lights[index];
      light.leds.colors = action.colors;
      lights[index] = light;
      return lights;
    case EDIT_LED_COUNT:
      lights = [...state];
      index = lights.findIndex((l: Light) => (l.uuid === action.id));
      light = lights[index];
      light.count = action.count;
      lights[index] = light;
      return lights;
    case SET_LIGHT_STATUS:
      lights = [...state];
      index = lights.findIndex((l: Light) => (l.uuid === action.id));
      light = lights[index];
      light.isOn = action.isOn;
      lights[index] = light;
      console.log(light);
      return lights;
    default:
      return state;
  }
}
export default lightsReducer;
