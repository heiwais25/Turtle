import { DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { ISubTaskRecord } from "interfaces/task";
import { List } from "immutable";

/**
 * Reordering process
 * 1. Delete from list
 * 2. Insert to the new index
 * 3. Change the order depending on the current list
 *
 * @param task
 * @param startIndex
 * @param endIndex
 */
export function reorderSubTaskList(
  subTaskList: List<ISubTaskRecord>,
  origStartIndex: number,
  origEndIndex: number,
  withFinished: boolean
) {
  let startIndex = origStartIndex;
  let endIndex = origEndIndex;
  if (!withFinished) {
    const unfinishedSubTaskList = subTaskList.filterNot(
      item => item.isFinished
    );
    const startItem = unfinishedSubTaskList.get(origStartIndex);
    const endItem = unfinishedSubTaskList.get(origEndIndex);
    if (!startItem || !endItem) {
      return subTaskList;
    }

    startIndex = subTaskList.findIndex(item => item._id === startItem._id);
    endIndex = subTaskList.findIndex(item => item._id === endItem._id);
  }

  const removedItem = subTaskList.get(startIndex);
  if (!removedItem) {
    return subTaskList;
  }

  return subTaskList
    .splice(startIndex, 1)
    .insert(endIndex, removedItem)
    .filter(item => !!item)
    .withMutations(list => list.map((item, idx) => item.set("order", idx)));
}

/**
 * Decorate the style of sub task in list while drag and drop operation
 *
 * @export
 * @param {boolean} isDragging
 * @param {(DraggingStyle | NotDraggingStyle | undefined)} draggableStyle
 * @returns
 */
export function getItemStyle(
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) {
  const style: React.CSSProperties = {
    userSelect: "none",
    letterSpacing: 1,
    ...draggableStyle
  };
  return style;
}
