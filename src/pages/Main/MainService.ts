import {
  DraggableLocation,
  DraggingStyle,
  NotDraggingStyle
} from "react-beautiful-dnd";
import { ProcessTypes } from "electronMain/interfaces/task";
import { ITaskRecord, ITaskListGroupRecord } from "interfaces/task";
import { List } from "immutable";

export function processToggle(
  updatedTask: ITaskRecord,
  taskListGroup: ITaskListGroupRecord
) {
  let newTaskListGroup = taskListGroup;
  // Remove task from the tasklist that includes
  (Object.keys(taskListGroup.toJS()) as ProcessTypes[]).some(key => {
    const index = taskListGroup[key].findIndex(
      item => item._id === updatedTask._id
    );
    if (index >= 0) {
      newTaskListGroup = newTaskListGroup.set(
        key,
        taskListGroup[key].splice(index, 1).filter(item => !!item)
      );
      return true;
    }
    return false;
  });

  // Push to the updated task list
  // updatedTask.order = 0;
  newTaskListGroup = newTaskListGroup.update(updatedTask.process, taskList =>
    taskList.unshift(updatedTask)
  );
  return newTaskListGroup;
}

export const processDragEnd = (
  source: DraggableLocation,
  destination: DraggableLocation,
  taskListGroup: ITaskListGroupRecord
) => {
  const sourceType = source.droppableId as ProcessTypes;
  const destinationType = destination.droppableId as ProcessTypes;
  let newTaskListGroup: ITaskListGroupRecord = taskListGroup;
  // Reorder in the list
  if (sourceType === destinationType) {
    const reorderedItems = reorderTaskInSameTaskList(
      taskListGroup[sourceType],
      source.index,
      destination.index
    );
    newTaskListGroup = taskListGroup.set(sourceType, reorderedItems);
  } else {
    // Move to other list
    const { sourceList, destinationList } = moveTaskToOtherTaskList(
      taskListGroup[sourceType],
      taskListGroup[destinationType],
      source,
      destination
    );
    newTaskListGroup = taskListGroup
      .set(sourceType, sourceList)
      .set(destinationType, destinationList);
  }
  return newTaskListGroup;
};

/**
 * Process reorder in single list and update order by it's idx
 *
 * @param taskList task list that reorder process occurs
 * @param startIndex index of dragged item
 * @param endIndex index of dropped item
 */
function reorderTaskInSameTaskList(
  taskList: List<ITaskRecord>,
  startIndex: number,
  endIndex: number
) {
  const removedElement = taskList.get(startIndex);
  if (!removedElement) {
    return taskList;
  }

  return taskList
    .splice(startIndex, 1)
    .splice(endIndex, 0, removedElement)
    .filter(item => !!item)
    .withMutations(list => {
      list.map((item, idx) => item.set("order", idx));
    });
}

/**
 * Process moving item between two lists and update the order by it's idx
 *
 * @param list
 * @param startIndex
 * @param endIndex
 */
function moveTaskToOtherTaskList(
  sourceList: List<ITaskRecord>,
  destinationList: List<ITaskRecord>,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) {
  const destProcess = droppableDestination.droppableId as ProcessTypes;
  let removedElement = sourceList.get(droppableSource.index);
  if (!removedElement) {
    return {
      sourceList,
      destinationList
    };
  }

  let newSourceList = sourceList;
  let newDestinationList = destinationList;

  // Process source list
  newSourceList = sourceList
    .delete(droppableSource.index)
    .withMutations(list => {
      list.map((item, idx) => item.set("order", idx));
    });

  // Process destination list
  removedElement = removedElement.set("process", destProcess);
  newDestinationList = destinationList
    .splice(droppableDestination.index, 0, removedElement)
    .filter(item => !!item)
    .withMutations(list => {
      list.map((item, idx) => item.set("order", idx));
    });

  return {
    sourceList: newSourceList,
    destinationList: newDestinationList
  };
}

/**
 * Compare current task list with previous one and get latest version of changed one
 * Generally, it will compare the order of the task list because the order change makes
 * multiple task changes
 *
 * @param currentTaskListGroup
 * @param prevTaskListGroup
 */
export function getChangedTaskList(
  currentTaskListGroup: ITaskListGroupRecord,
  prevTaskListGroup: ITaskListGroupRecord
) {
  const changedTaskList = (Object.keys(
    currentTaskListGroup.toJS()
  ) as ProcessTypes[]).reduce((acc, key) => {
    const newTaskList = currentTaskListGroup[key];
    const previousTaskList = prevTaskListGroup[key];

    // Reorder case
    let currentChangedTaskList: List<ITaskRecord> = acc;
    if (newTaskList.size === previousTaskList.size) {
      currentChangedTaskList = acc.concat(
        newTaskList.filter((task, idx) => task !== previousTaskList.get(idx))
      );
    } else if (newTaskList.size > previousTaskList.size) {
      // Move to this list
      const previousTaskIdList = previousTaskList.map(item => item._id);
      currentChangedTaskList = acc.concat(
        newTaskList.filter(task => !previousTaskIdList.includes(task._id))
      );
    }
    return currentChangedTaskList;
  }, List([]) as List<ITaskRecord>);

  return changedTaskList;
}

/**
 * Decorate the style of task in list while drag and drop operation
 *
 * @export
 * @param {boolean} isDragging
 * @param {(DraggingStyle | NotDraggingStyle | undefined)} draggableStyle
 * @returns
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

/**
 * Decorate the style of task list while drag and drop operation
 *
 * @export
 * @param {boolean} _isDraggingOver
 * @returns
 */
export function getListStyle(_isDraggingOver: boolean) {
  const style: React.CSSProperties = {
    paddingTop: 4
    // paddingBottom: 4
  };

  return style;
}
