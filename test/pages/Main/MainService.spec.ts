import {
  ITaskRecord,
  ITaskListGroupRecord
} from "../../../src/interfaces/task";
import { TaskRecord, TaskListGroupRecord } from "../../../src/records/task";
import { ITask } from "../../../src/interfaces/task";
import { List } from "immutable";

describe("Main service unit tests", () => {
  describe("progressToggle", () => {
    test("Remove item from current list group and insert it to new group", async () => {
      const newTask = new TaskRecord({ _id: "123" });

      const newTaskListGroup = new TaskListGroupRecord({
        toDo: List([]),
        doing: List([]),
        done: List([])
      });
    });
  });
});
