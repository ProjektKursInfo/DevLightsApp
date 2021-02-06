import { ADD_TAG, REMOVE_TAG, SET_TAGS } from "./types";

export interface SetTagsAction {
  type: typeof SET_TAGS;
  tags: string[]
}

export interface AddTagAction {
  type: typeof ADD_TAG;
  tag: string
}

export interface RemoveTagAction {
  type: typeof REMOVE_TAG;
  tag: string
}

export type TagActionTypes = SetTagsAction | AddTagAction | RemoveTagAction;
