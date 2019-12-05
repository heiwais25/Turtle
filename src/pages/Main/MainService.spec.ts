import { TaskRecord, TaskListGroupRecord } from "records/task";
import { ITask } from "interfaces/task";
import { ISubTaskRecord } from "interfaces/task";
import { List } from "immutable";
import moment from "moment";
import { processToggle, processDragEnd } from "./MainService";
import { DraggableLocation } from "react-beautiful-dnd";
import { ProcessTypes } from "../../electronMain/interfaces/task";

describe("Main service unit tests", () => {
  describe("progressToggle", () => {
    test("Remove item from current list group and insert it to new group", () => {
      const updatedTask = new TaskRecord({
        _id: "123",
        process: "doing",
        createdAt: moment().toDate(),
        isDeleted: false,
        name: "test",
        order: 0,
        subTaskList: List<ISubTaskRecord>([]),
        updatedAt: moment().toDate()
      });

      const dummyTask = new TaskRecord({
        _id: "1234",
        process: "doing",
        createdAt: moment().toDate(),
        isDeleted: false,
        name: "test",
        order: 0,
        subTaskList: List<ISubTaskRecord>([]),
        updatedAt: moment().toDate()
      });

      const taskListGroup = new TaskListGroupRecord({
        toDo: List([updatedTask]),
        doing: List([dummyTask, dummyTask, dummyTask, dummyTask]),
        done: List([])
      });

      const newTaskListGroup = processToggle(updatedTask, taskListGroup);

      expect(newTaskListGroup.toDo.size).toBe(0);
      expect(newTaskListGroup.doing.size).toBe(5);
      expect(newTaskListGroup.done.size).toBe(0);
      expect(newTaskListGroup.doing.get(0)).toEqual(updatedTask);
    });

    test("Insert new item although it isn't included in the list group", async () => {
      const updatedTask = new TaskRecord({
        _id: "123",
        process: "doing",
        createdAt: moment().toDate(),
        isDeleted: false,
        name: "test",
        order: 0,
        subTaskList: List<ISubTaskRecord>([]),
        updatedAt: moment().toDate()
      });

      const dummyTask = new TaskRecord({
        _id: "1234",
        process: "doing",
        createdAt: moment().toDate(),
        isDeleted: false,
        name: "test",
        order: 0,
        subTaskList: List<ISubTaskRecord>([]),
        updatedAt: moment().toDate()
      });

      const taskListGroup = new TaskListGroupRecord({
        toDo: List([]),
        doing: List([dummyTask, dummyTask, dummyTask, dummyTask]),
        done: List([])
      });

      const newTaskListGroup = processToggle(updatedTask, taskListGroup);

      expect(newTaskListGroup.toDo.size).toBe(0);
      expect(newTaskListGroup.doing.size).toBe(5);
      expect(newTaskListGroup.done.size).toBe(0);
      expect(newTaskListGroup.doing.get(0)).toEqual(updatedTask);
    });
  });

  describe("processDragEnd", () => {
    test("reorder Items in the list from 0 to 3", () => {
      const dummyTask = new TaskRecord({
        _id: "1234",
        process: "doing",
        createdAt: moment().toDate(),
        isDeleted: false,
        name: "test",
        order: 0,
        subTaskList: List<ISubTaskRecord>([]),
        updatedAt: moment().toDate()
      });

      const taskListGroup = new TaskListGroupRecord({
        toDo: List([]),
        doing: List([
          dummyTask.set("order", 0),
          dummyTask.set("order", 1),
          dummyTask.set("order", 2),
          dummyTask.set("order", 3)
        ]),
        done: List([])
      });

      const source: DraggableLocation = {
        droppableId: "doing" as ProcessTypes,
        index: 0
      };

      const destination: DraggableLocation = {
        droppableId: "doing" as ProcessTypes,
        index: 3
      };

      const newTaskListGroup = processDragEnd(
        source,
        destination,
        taskListGroup
      );

      expect(newTaskListGroup.doing.size).toBe(4);
    });
  });
});
