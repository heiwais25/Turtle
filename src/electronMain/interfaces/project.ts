export type ProjectDBData = {
  _id: string;
  name: string;
  order: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectDBCreateQueryData = {
  name: ProjectDBData["name"];
  order: ProjectDBData["order"];
  isDeleted: ProjectDBData["isDeleted"];
};

export type ProjectDBUpdateQueryData = {
  _id: string;
  name?: ProjectDBData["name"];
  order?: ProjectDBData["order"];
};
