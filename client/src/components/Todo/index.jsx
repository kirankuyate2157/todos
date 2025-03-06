import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import TaskCreationDialog from "./TaskCreationDialog";
import { useInView } from "react-intersection-observer";
import { fetchTodos } from "@/Store/todos/todosSlice";
import NoteModal from "./NoteModal ";
import NotesDrawer from "./NotesDrawer";
import { updateTodo } from "./apis/todoAPI";

const Todo = ({priories=[],isCompleted=null,}) => {
  const dispatch = useDispatch();
  const { todos, page, totalPages, status } = useSelector(
    (state) => state.todos
  );

  const { ref, inView } = useInView({ threshold: 0.5 });

  // Local State for Filters
  const [filters, setFilters] = useState({ search: "", order: "desc" });
  const [viewTask, setViewTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const params = {
    page,
    search: filters?.search ?? "",
    order: filters.order ?? "desc",
  };
  useEffect(() => {
    dispatch(fetchTodos(params));
  }, [dispatch, page, filters]);

  // Load More on Scroll
  useEffect(() => {
    if (inView && page < totalPages && status !== "loading") {
      dispatch(fetchTodos({ page: page + 1 }));
    }
  }, [inView, totalPages, status, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateStatus = async (todo) => {
    try {
      const updatedTodo = await updateTodo(todo._id, {
        isCompleted: !todo.isCompleted,
      });
      dispatch(fetchTodos(params));
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  return (
    <div className='max-w-5xl mx-auto p-4'>
      <div>
        <div className='flex flex-wrap gap-4 mb-4 items-center justify-between'>
          <Input
            placeholder='Search Todos...'
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className='w-full sm:w-[250px]'
          />
          <Select
            onValueChange={(value) => handleFilterChange("order", value)}
            value={filters.order}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Sort By' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='desc'>Newest</SelectItem>
                <SelectItem value='asc'>Oldest</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <TaskCreationDialog />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {todos.map((todo) => (
            <Card
              key={todo._id}
              className='p-4 shadow-lg flex flex-col justify-between'
            >
              <CardHeader
                className='font-semibold text-lg'
                onClick={() => setViewTask(todo)}
              >
                {todo.title}
              </CardHeader>
              <CardContent className='flex-grow'>
                <p className='text-gray-700' onClick={() => setViewTask(todo)}>
                  {todo.description}
                </p>
                <p className='text-sm text-gray-500 mt-2'>
                  Priority: {todo.priority}
                </p>
                <p className='text-sm text-gray-500'>
                  Created: {new Date(todo.createdAt).toLocaleDateString()}
                </p>

                {todo.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {todo.tags.map((tag) => (
                      <span
                        key={tag._id}
                        className='bg-blue-200 text-blue-700 text-xs px-2 py-1 rounded'
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex justify-between mt-2'>
                <Button
                  variant='outline'
                  onClick={() => handleUpdateStatus(todo)}
                >
                  {todo.isCompleted ? "Completed" : "Mark as Done"}
                </Button>
                <Button variant='ghost' onClick={() => setSelectedTask(todo)}>
                  Add Note
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {status === "loading" && (
          <Loader className='animate-spin mx-auto my-4' />
        )}
        <div ref={ref} />

        {selectedTask && (
          <NoteModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
      {viewTask && (
        <NotesDrawer task={viewTask} onClose={() => setViewTask(null)} />
      )}
    </div>
  );
};

export default Todo;
