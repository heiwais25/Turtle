import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Box,
  ListItemText
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { CautionDialog } from "components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import { IProjectRecord, IProjectCreatePartialForm } from "interfaces/project";
import { List as ImmutableList } from "immutable";
import * as NavigationService from "./NavigationService";
import ProjectUpdateDialog, { IProjectFormProps } from "./ProjectUpdateDialog";
import DrawerListItem from "./DrawerListItem";

type Props = {
  classes: { [key: string]: string };
  projectList: ImmutableList<IProjectRecord>;
  handleProjectCreate: (
    formData: IProjectCreatePartialForm,
    cb?: Function
  ) => void;
  handleProjectUpdate: (newProject: IProjectRecord, cb?: Function) => void;
  handleProjectDelete: (project: IProjectRecord) => void;
  handleCurrentProjectChange: (project: IProjectRecord) => void;
  handleCurrentProjectClear: () => void;
  currentProject?: IProjectRecord;
  handleProjectDragEnd: (result: DropResult) => void;
};

const DrawerList: React.FC<Props> = ({
  classes,
  projectList,
  handleProjectCreate,
  handleProjectUpdate,
  handleProjectDelete,
  handleCurrentProjectClear,
  handleCurrentProjectChange,
  currentProject,
  handleProjectDragEnd
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingProejct, setEditingProject] = React.useState<
    IProjectRecord | undefined
  >(undefined);

  const handleDialogOpen = React.useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = React.useCallback(() => {
    setEditingProject(undefined);
    setDialogOpen(false);
  }, []);

  const handleEditingProjectChange = React.useCallback(
    (project: IProjectRecord) => {
      setEditingProject(project);
      handleDialogOpen();
    },
    [handleDialogOpen]
  );

  const handleDeleteDialogOpen = React.useCallback(
    (project: IProjectRecord) => {
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
    handleProjectDragEnd(result);
  };

  const handleSubmit = (data: unknown, createCallback?: Function) => {
    console.log(data);
    const formData: IProjectFormProps = data as IProjectFormProps;
    // Create
    if (!editingProejct) {
      handleProjectCreate(formData, createCallback);
    }
    // Update
    else {
      const newProject = editingProejct.set("name", formData.name);
      handleProjectUpdate(newProject, createCallback);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div className={classes.toolbar} />
      <Divider />
      <ListItem
        button
        onClick={handleCurrentProjectClear}
        selected={!currentProject}
      >
        <ListItemText>
          <Box fontSize="0.9rem">All Projects</Box>
        </ListItemText>
      </ListItem>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              disablePadding
              className={classes.drawerList}
              ref={provided.innerRef}
              style={NavigationService.getListStyle(snapshot.isDraggingOver)}
            >
              {projectList.map((project, index) => {
                let selected = false;
                if (currentProject) {
                  selected = project._id === currentProject._id;
                }
                // const selected = project.name === currentProject.name;
                return (
                  <Draggable
                    index={index}
                    key={project._id}
                    draggableId={project.name}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={NavigationService.getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <DrawerListItem
                          key={project._id}
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
        <ListItemText>
          <Box fontSize="0.9rem">Add New Project</Box>
        </ListItemText>
      </ListItem>
      <ProjectUpdateDialog
        open={dialogOpen}
        onSubmit={handleSubmit}
        editingProejct={editingProejct}
        handleClose={handleDialogClose}
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
