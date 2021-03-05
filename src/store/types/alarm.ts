import { Alarm } from "@devlights/types";
import {
  ADD_ALARM,
  REMOVE_ALARM,
  SET_ALARMS,
} from "./types";

export interface SetAlarmsAction {
  type: typeof SET_ALARMS;
  alarms: Alarm[];
}

export interface AddAlarmAction {
  type: typeof ADD_ALARM;
  alarm: Alarm;
}

export interface RemoveAlarmAction {
  type: typeof REMOVE_ALARM;
  alarm: Alarm;
}

export type AlarmActions =
    | SetAlarmsAction
    | AddAlarmAction
    | RemoveAlarmAction;
