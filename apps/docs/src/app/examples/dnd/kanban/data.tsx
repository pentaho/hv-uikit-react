import type { Column, Task } from "./types";

export const defaultColumns: Column[] = [
  { id: "col1", title: "To Do", color: "info" },
  { id: "col2", title: "In Progress", color: "negativeStrong" },
  { id: "col3", title: "In Review", color: "warningStrong" },
  { id: "col4", title: "Reviewed", color: "positiveStrong" },
];

export const defaultTasks: Task[] = [
  {
    id: "task1",
    columnId: "col1",
    title: "Task 1",
    statusLevel: 1,
  },
  {
    id: "task2",
    columnId: "col1",
    title: "Task 2",
    statusLevel: 2,
  },
  {
    id: "task3",
    columnId: "col2",
    title: "Task 3",
    statusLevel: 3,
    users: [
      {
        name: "Ben",
        avatar: "https://i.imgur.com/56Eeg1g.png",
      },
      {
        name: "Beatrice",
        avatar: "https://i.imgur.com/bE7vg3N.png",
      },
      {
        name: "Wayne",
        avatar: "https://i.imgur.com/ea22egF.png",
      },
    ],
  },
  {
    id: "task4",
    columnId: "col2",
    title: "Task 4",
    statusLevel: 2,
  },
  {
    id: "task5",
    columnId: "col3",
    title: "Task 5",
    statusLevel: 4,
    users: [
      {
        name: "Beatrice",
        avatar: "https://i.imgur.com/bE7vg3N.png",
      },
      {
        name: "Wayne",
        avatar: "https://i.imgur.com/ea22egF.png",
      },
    ],
  },
  {
    id: "task6",
    columnId: "col3",
    title: "Task 6",
    statusLevel: 5,
    users: [
      {
        name: "Ben",
        avatar: "https://i.imgur.com/56Eeg1g.png",
      },
      {
        name: "Beatrice",
        avatar: "https://i.imgur.com/bE7vg3N.png",
      },
      {
        name: "Wayne",
        avatar: "https://i.imgur.com/ea22egF.png",
      },
      {
        name: "Clara Soul",
        avatar: "https://i.imgur.com/6sYhSb6.png",
      },
    ],
  },
  {
    id: "task7",
    columnId: "col3",
    title: "Task 7",
    statusLevel: 2,
    users: [
      {
        name: "Ben",
        avatar: "https://i.imgur.com/56Eeg1g.png",
      },
    ],
  },
  {
    id: "task8",
    columnId: "col4",
    title: "Task 8",
    statusLevel: 3,
  },
  {
    id: "task9",
    columnId: "col4",
    title: "Task 9",
    statusLevel: 3,
  },
  {
    id: "task10",
    columnId: "col4",
    title: "Task 9",
    statusLevel: 3,
  },
];
