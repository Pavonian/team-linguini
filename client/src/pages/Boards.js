import React, { useState } from "react";
import initialData from "./InitialData";
import BoardBar from "./BoardBar";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  grid: {
    marginTop: "40px",
    marginLeft: "20px",
    display: "flex"
  },
  container: {
    width: "100%",
    maxWidth: "1370px",
    overflowX: "scroll",
    overflow: "hidden",
    margin: "0 auto",
    paddingBottom: "17px",
    "&::-webkit-scrollbar": {
      display: "none"
    }
  }
}));

const Boards = () => {
  const classes = useStyles();
  const [data, setData] = useState(initialData);

  const onDragEnd = result => {
      const { destination, source, draggableId } = result

      if(!destination){
          return
      }

      if(destination.droppableId === source.droppableId && destination.index === source.index){
          return
      }

      const start = data.columns[source.droppableId]
      const finish = data.columns[destination.droppableId]
      //Moving withing the same column
      if(start === finish){
          const newCardIds = Array.from(start.cardIds)
          newCardIds.splice(source.index, 1)
          newCardIds.splice(destination.index, 0, draggableId)
          const newColumn = {
              ...start,
              cardIds: newCardIds
          }
    
          setData({
              ...data,
              columns: {
                  ...data.columns,
                  [newColumn.id]: newColumn
              }
          })
          return
      }
      //Moving from one column to another
      const startCardIds = Array.from(start.cardIds)
      startCardIds.splice(source.index, 1)
      const newStart = {
          ...start,
          cardIds: startCardIds,
      }

      const finishCardIds = Array.from(finish.cardIds)
      finishCardIds.splice(destination.index, 0, draggableId)
      const newFinish = {
          ...finish,
          cardIds: finishCardIds,
      }

      setData({
          ...data,
          columns: {
              ...data.columns,
              [newStart.id]: newStart,
              [newFinish.id]: newFinish
          }
      })
  }

  return (
    <div>
      <BoardBar />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={classes.container}>
          <div className={classes.grid}>
            {data.columnOrder.map(columnId => {
              const column = data.columns[columnId];
              const cards = column.cardIds.map(cardId => data.cards[cardId]);

              return <Column key={column.id} column={column} cards={cards} />;
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Boards;
