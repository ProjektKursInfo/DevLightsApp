import { Alarm } from "@devlights/types";
import { AddAlarmAction, RemoveAlarmAction, SetAlarmsAction } from "../types/alarm";

export function setAlarms(alarms: Alarm[]): SetAlarmsAction {
  return { type: "SET_ALARMS", alarms };
}

export function addTag(alarm: Alarm): AddAlarmAction {
  return { type: "ADD_ALARM", alarm };
}

export function removeTag(alarm: Alarm): RemoveAlarmAction {
  return { type: "REMOVE_ALARM", alarm };
}
