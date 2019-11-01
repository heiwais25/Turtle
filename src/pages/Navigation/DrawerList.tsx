import React from "react";
import { Divider, List, ListItem, ListItemIcon, Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { ProjectListItemData } from "store/modules/project";
import DrawerListItem from "./DrawerListItem";
import { ProjectUpdateDialog } from "systems";
import { CautionDialog } from "components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggingStyle,
  NotDraggingStyle
} from "react-beautiful-dnd";

type Props = {
  classes: { [key: string]: string };
  projectList: ProjectListItemData[];
  handleProjectUpdate: (
    projectName: string,
    editingProject?: ProjectListItemData
  ) => void;
  handleProjectDelete: (project: ProjectListItemData) => void;
  handleCurrentProjectChange: (project: ProjectListItemData) => void;
  currentProject: ProjectListItemData;
  handleSetProjectList: (projectList: ProjectListItemData[]) => void;
};

const reorder = (
  list: ProjectListItemData[],
  startIndex: number,
  endIndex: number
) => {
  if (startIndex === 0 || endIndex === 0) {
    return list;
  }
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (
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
const getListStyle = (_isDraggingOver: boolean): React.CSSProperties => {
  const style: React.CSSProperties = {
    paddingTop: 4,
    paddingBottom: 4
  };

  return style;
};

const DrawerList: React.FC<Props> = ({
  classes,
  projectList,
  handleProjectUpdate,
  handleProjectDelete,
  handleCurrentProjectChange,
  currentProject,
  handleSetProjectList
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingProejct, setEditingProject] = React.useState<
    ProjectListItemData | undefined
  >(undefined);

  const handleDialogOpen = React.useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = React.useCallback(() => {
    setEditingProject(undefined);
    setDialogOpen(false);
  }, []);

  const handleEditingProjectChange = React.useCallback(
    (project: ProjectListItemData) => {
      setEditingProject(project);
      handleDialogOpen();
    },
    [handleDialogOpen]
  );

  const handleDeleteDialogOpen = React.useCallback(
    (project: ProjectListItemData) => {
      setEditingProject(project);
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleDeleteDialogClose = React.useCallback(() => {
    setEditingProject(undefined);
    setDeleteDialogOpen(false);
  }, []);

  const handleDeleteDialogAgree = React.useCallback(() => {
    if (editingProejct) {
      handleProjectDelete(editingProejct);
      handleDeleteDialogClose();
    }
  }, [editingProejct, handleProjectDelete, handleDeleteDialogClose]);

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list(리스트 밖으로 드랍한 경우)
    if (!result.destination) {
      return;
    }

    const items = reorder(
      projectList,
      result.source.index,
      result.destination.index
    );
    handleSetProjectList(items);
  };
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div className={classes.toolbar} />
      <Divider />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              disablePadding
              className={classes.drawerList}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {projectList.map((project, index) => {
                const selected = project.name === currentProject.name;
                return (
                  <Draggable
                    index={index}
                    key={project.name}
                    draggableId={project.name}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <DrawerListItem
                          key={project.name}
                          classes={classes}
                          project={project}
                          handleEditingProjectChange={
                            handleEditingProjectChange
                          }
                          handleDeleteDialogOpen={handleDeleteDialogOpen}
                          handleCurrentProjectChange={
                            handleCurrentProjectChange
                          }
                          selected={selected}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <ListItem button onClick={handleDialogOpen}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <Box fontSize="1rem">Add New Project</Box>
      </ListItem>
      <ProjectUpdateDialog
        open={dialogOpen}
        editingProejct={editingProejct}
        handleClose={handleDialogClose}
        handleProjectUpdate={handleProjectUpdate}
        projectList={projectList}
      />
      <CautionDialog
        open={deleteDialogOpen}
        handleAgree={handleDeleteDialogAgree}
        handleDisagree={handleDeleteDialogClose}
        title="Delete the category"
        contentText="Task belongs to this category will be permanantly deleted"
      />
    </div>
  );
};

export default DrawerList;
