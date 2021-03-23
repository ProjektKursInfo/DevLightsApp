import defaultstate from "../defaultstate";
import { TagActionTypes } from "../types/tags";

export default function tagsReducer(
  state = defaultstate.tags,
  action: TagActionTypes,
): string[] {
  let tags: string[];
  let index: number;
  switch (action.type) {
    case "SET_TAGS":
      tags = action.tags;
      return tags;
    case "ADD_TAG":
      tags = [...state];
      if (!tags.includes(action.tag)) tags = [...state, action.tag];
      return tags;
    case "REMOVE_TAG":
      tags = [...state];
      index = tags.findIndex((f) => f === action.tag);
      if (index !== undefined) tags.splice(index, 1);
      return tags;
    default:
      return [...state];
  }
}
