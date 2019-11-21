import { TaskDBData } from "interfaces/task";
import {
  DraggableLocation,
  DraggingStyle,
  NotDraggingStyle
} from "react-beautiful-dnd";
import { ProcessTypes } from "../../interfaces/task";
import { StoreState } from "../../store/modules/index";

export const processDragEnd = (
  source: DraggableLocation,
  destination: DraggableLocation,
  groupedTaskList: StoreState["task"]["groupedTaskList"]
) => {
  const newGroupedTaskList: StoreState["task"]["groupedTaskList"] = {
    ...groupedTaskList
  };

  const sourceType = source.droppableId as ProcessTypes;
  const destinationType = destination.droppableId as ProcessTypes;

  // Reorder in the list
  if (sourceType === destinationType) {
    const reorderedItems = reorder(
      groupedTaskList[sourceType],
      source.index,
      destination.index
    );
    newGroupedTaskList[sourceType] = reorderedItems;
  } else {
    // Move to other list
    const result = move(
      groupedTaskList[sourceType],
      groupedTaskList[destinationType],
      source,
      destination
    );
    newGroupedTaskList[sourceType] = result[sourceType];
    newGroupedTaskList[destinationType] = result[destinationType];
  }
  return newGroupedTaskList;
};

/**
 * Process reorder in single list and update order by it's idx
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const reorder = (
  list: TaskDBData[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  result.forEach((item, idx) => {
    item.order = idx;
  });

  return result;
};

/**
 * Process moving item between two lists and update the order by it's idx
 * @param list
 * @param startIndex
 * @param endIndex
 */
export const move = (
  source: TaskDBData[],
  destination: TaskDBData[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const sourceProcess = droppableSource.droppableId as ProcessTypes;
  const destProcess = droppableDestination.droppableId as ProcessTypes;
  const destClone = Array.from(destination);

  const result: { [key in ProcessTypes]: TaskDBData[] } = {
    toDo: [],
    doing: [],
    done: []
  };
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  removed.process = destProcess;
  destClone.splice(droppableDestination.index, 0, removed);

  result[sourceProcess] = sourceClone;
  result[destProcess] = destClone;

  Object.values(result).forEach(taskList => {
    taskList.forEach((item, idx) => {
      item.order = idx;
    });
  });
  return result;
};

/**
 * Compare current task list with previous one and get latest version of changed one
 * Generally, it will compare the order of the task list because the order change makes
 * multiple task changes
 * @param currentGroupedTaskList
 * @param previousGroupedTaskList
 */
export const getChangedTaskList = (
  currentGroupedTaskList: StoreState["task"]["groupedTaskList"],
  previousGroupedTaskList: StoreState["task"]["groupedTaskList"]
) => {
  const changedTaskList = Object.entries(currentGroupedTaskList).reduce(
    (acc, [key, taskList]) => {
      const previousTaskList = previousGroupedTaskList[key as ProcessTypes];
      let filteredTaskList: TaskDBData[] = [];

      // Reorder case
      if (taskList.length === previousTaskList.length) {
        // Reorder
        filteredTaskList = taskList.filter(
          (task, idx) => task.order !== previousTaskList[idx].order
        );
      } else if (taskList.length > previousTaskList.length) {
        // Move from this list
        const previousTaskIdList = previousTaskList.map(item => item._id);
        filteredTaskList = taskList.filter(
          task => !previousTaskIdList.includes(task._id)
        );
        // const previousTaskIdList = previousTaskList.map(item => item._id);
      }
      acc.push(...filteredTaskList);
      return acc;
    },
    [] as TaskDBData[]
  );

  return changedTaskList;
};

export const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
): React.CSSProperties => {
  const style: React.CSSProperties = {
    userSelect: "none",
    letterSpacing: 1,
    ...draggableStyle
  };
  if (isDragging) {
    style.background = "rgba(0, 0, 0, 0.08)";
  }
  return style;
};

export const getListStyle = (_isDraggingOver: boolean): React.CSSProperties => {
  const style: React.CSSProperties = {
    paddingTop: 4
    // paddingBottom: 4
  };

  return style;
};
