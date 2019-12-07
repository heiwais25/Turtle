import { List } from "immutable";
import { IProjectRecord } from "interfaces/project";
import { DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";

/**
 * Reordering process
 * 1. Delete from list
 * 2. Insert to the new index
 * 3. Change the order depending on the current list
 *
 * @param list
 * @param startIndex
 * @param endIndex
 */
export function reorderProject(
  list: List<IProjectRecord>,
  startIndex: number,
  endIndex: number
) {
  let newList = list;
  const removedItem = newList.get(startIndex);
  if (!removedItem) {
    return newList;
  }

  // Remove
  return newList
    .splice(startIndex, 1)
    .insert(endIndex, removedItem)
    .filter(item => !!item)
    .withMutations(list => list.map((item, idx) => item.set("order", idx)));
}

/**
 * Get changed project list by comparing current and previous project list.
 *
 * @export
 * @param {List<IProjectRecord>} currentProjectList
 * @param {List<IProjectRecord>} previousProjectList
 * @returns
 */
export function getChangedProjectList(
  currentProjectList: List<IProjectRecord>,
  previousProjectList: List<IProjectRecord>
) {
  const changedProjectList = currentProjectList.filter(
    (project, idx) => project !== previousProjectList.get(idx)
  );

  return changedProjectList;
}

/**
 * Style of droppable list
 *
 * @param _isDraggingOver
 */
export function getListStyle(_isDraggingOver: boolean) {
  const style: React.CSSProperties = {
    paddingTop: 4,
    paddingBottom: 4
  };

  return style;
}

/**
 * Style of draggable item
 *
 * @param isDragging
 * @param draggableStyle
 */
export function getItemStyle(
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) {
  const style: React.CSSProperties = {
    userSelect: "none",
    letterSpacing: 1,
    ...draggableStyle
  };
  if (isDragging) {
    style.background = "rgba(0, 0, 0, 0.08)";
  }
  return style;
}
