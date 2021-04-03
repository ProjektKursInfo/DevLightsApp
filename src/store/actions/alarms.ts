import { Alarm } from "@devlights/types";
import {
  AddAlarmAction,
  EditAlarmAction,
  RemoveAlarmAction,
  SetAlarmsAction,
} from "../types/alarm";

export function setAlarms(alarms: Alarm[]): SetAlarmsAction {
  return { type: "SET_ALARMS", alarms };
}

export function addAlarm(alarm: Alarm): AddAlarmAction {
  return { type: "ADD_ALARM", alarm };
}

export function editAlarm(alarm: Alarm): EditAlarmAction {
  return { type: "EDIT_ALARM", alarm, id: alarm.id };
}

export function removeAlarm(alarm: Alarm): RemoveAlarmAction {
  return { type: "REMOVE_ALARM", alarm };
}
