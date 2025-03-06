import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import TaskCreationDialog from "./TaskCreationDialog";
import { fetchTodos } from "@/Store/todos/todosSlice";

const Todo = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  console.log("redux todos: ", todos);

  useEffect(() => {
    console.log("fetching todos ....: ");
    dispatch(fetchTodos());
  }, []);

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <TaskCreationDialog />
    </div>
  );
};

export default Todo;
