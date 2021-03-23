import { Alarm } from "@devlights/types";
import defaultstate from "../defaultstate";
import { AlarmActions } from "../types/alarm";

export default function alarmsReducer(
  state = defaultstate.alarms,
  action: AlarmActions,
): Alarm[] {
  let alarms: Alarm[];
  let index: number;
  switch (action.type) {
    case "SET_ALARMS":
      alarms = action.alarms;
      return alarms;
    case "ADD_ALARM":
      alarms = [...state];
      return [...alarms, action.alarm];
    case "REMOVE_ALARM":
      alarms = [...state];
      index = alarms.findIndex((f) => f === action.alarm);
      if (index !== undefined) alarms.splice(index, 1);
      return alarms;
    default:
      return [...state];
  }
}
