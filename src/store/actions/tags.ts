import { AddTagAction, RemoveTagAction, SetTagsAction } from "../types/tags";

export function setTags(tags: string[]): SetTagsAction {
  return { type: "SET_TAGS", tags };
}

export function addTag(tag: string): AddTagAction {
  return { type: "ADD_TAG", tag };
}

export function removeTag(tag: string): RemoveTagAction {
  return { type: "REMOVE_TAG", tag };
}
