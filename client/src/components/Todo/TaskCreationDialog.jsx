import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import debounce from "lodash.debounce";
import { createTag, getAllTags } from "./apis/tagAPI";
import { createTodo, getTodoById } from "./apis/todoAPI";
import { fetchUsers } from "../Auth/utils/authApi";
import { fetchTodos } from "@/Store/todos/todosSlice";
import { useDispatch } from "react-redux";

const TaskCreationDialog = ({
  refreshTasks,
  initialOpen = false,
  onClose,
  task_id = null,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(initialOpen);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    notes: "",
    priority: "medium",
    mentionedUsers: [],
  });

  const [availableTags, setAvailableTags] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [tagQuery, setTagQuery] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  const [errors, setErrors] = useState({});

  const fetchTodoById = async () => {
    try {
      const res = await getTodoById(task_id);
      if (res) {
        setFormData(res?.data?.todo);
      }
    } catch (err) {
      toast.error(err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, usersRes] = await Promise.all([
          getAllTags(),
          fetchUsers(),
        ]);
        setAvailableTags(tagsRes?.data?.tags || []);
        setAvailableUsers(usersRes?.data?.users || []);
      } catch (error) {
        // toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    if (name === "title" && !value.trim()) {
      setErrors((prev) => ({ ...prev, title: "Title is required" }));
    } else if (name === "description" && value.trim().length < 10) {
      setErrors((prev) => ({
        ...prev,
        description: "At least 10 characters required",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const fetchTags = debounce(async (query) => {
    try {
      const res = await axios.get(`/tags/?search=${query}`);
      setAvailableTags(res?.data?.data.tags || []);
    } catch {
      toast.error("Failed to fetch tags");
    }
  }, 300);

  const fetchUsersSearch = debounce(async (query) => {
    try {
      const res = await axios.get(`/users/search?search=${query}`);
      setAvailableUsers(res?.data?.data?.users || []);
    } catch {
      toast.error("Failed to fetch users");
    }
  }, 300);

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTagQuery(value);
    if (value.length > 2) fetchTags(value);
  };

  const newTags = async () => {
    if (!tagQuery) return;
    try {
      const res = await createTag({ name: tagQuery });

      if (res) {
        console.log(res.data);

        if (res?.data) {
          addTag(res.data);
        }
      }
    } catch (e) {
      toast.error(e || e.message);
    }
  };

  const addTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagQuery("");
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleMentionChange = (e) => {
    const value = e.target.value;
    setMentionQuery(value);
    if (value.startsWith("@") && value.length > 2)
      fetchUsersSearch(value.slice(1));
  };

  const addMention = (user) => {
    if (!formData.mentionedUsers.some((u) => u._id === user._id)) {
      setFormData((prev) => ({
        ...prev,
        mentionedUsers: [...prev.mentionedUsers, user],
      }));
    }
    setMentionQuery("");
  };

  const removeMention = (id) => {
    setFormData((prev) => ({
      ...prev,
      mentionedUsers: prev.mentionedUsers.filter((u) => u._id !== _id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.description.trim().length < 10)
      return;

    try {
      const res = await createTodo({
        ...formData,
        mentionedUsers: formData.mentionedUsers.map((u) => u._id),
      });
      if (res) {
        toast.success("Task created successfully");
        setOpen(false);
        refreshTasks();
        setFormData({
          title: "",
          description: "",
          tags: [],
          notes: "",
          mentionedUsers: [],
        });
        dispatch(fetchTodos());
      }
    } catch (error) {
      toast.error(error || "Failed to create task ");
    }
  };
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    setOpen(initialOpen);
    if (task_id) {
      fetchTodoById();
    }
  }, [initialOpen]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      {/* <DialogTrigger asChild>
        <Button>{task_id ? "Edit" : "Create"} Task</Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task_id ? "Edit" : "Create a New"} Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Input
            name='title'
            placeholder='Task Title'
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && (
            <p className='text-red-500 text-sm'>
              {errors?.title || "something wrong"}
            </p>
          )}

          <Textarea
            name='description'
            placeholder='Task Description'
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className='text-red-500 text-sm'>
              {errors?.description || "something wrong"}
            </p>
          )}

          <Popover id='popover-tag'>
            <PopoverTrigger asChild>
              <div className='flex flex-wrap gap-2 border-dotted  p-1'>
                {formData?.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    onClick={() => removeTag(tag)}
                    className='cursor-pointer'
                  >
                    {tag?.name || "N/A"}
                  </Badge>
                ))}
                {/* <Button variant='outline' id='tag-add'>
                  +
                </Button> */}
                <span className='p-1 text-muted-foreground'> Tags..</span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <>
                <div className='flex gap-1'>
                  <Input
                    placeholder='Add Tags'
                    value={tagQuery}
                    onChange={handleTagChange}
                  />
                  <Button
                    variant='outline'
                    onClick={newTags}
                    disabled={availableTags?.length > 0}
                  >
                    Add
                  </Button>
                </div>
                <div className='max-h-[200px] overflow-auto'>
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => addTag(tag)}
                      className='cursor-pointer hover:bg-gray-100 p-2'
                    >
                      {tag?.name}
                    </div>
                  ))}
                </div>
              </>
            </PopoverContent>
          </Popover>
          <Popover id='popover-mention'>
            <PopoverTrigger asChild>
              <div className='flex flex-wrap gap-2 border-dotted p-1'>
                {formData?.mentionedUsers?.map((user) => (
                  <Badge
                    key={user?._id}
                    onClick={() => removeMention(user._id)}
                    className='cursor-pointer'
                  >
                    {`${user?.username || "unknown"} (${
                      user?.fullName || ""
                    })` || "NA"}
                  </Badge>
                ))}
                {/* <Button variant='outline' id='mention-add'>
                  +
                </Button> */}
                <span className='p-1 text-muted-foreground'> @Mention..</span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <>
                <div className='flex gap-1'>
                  <Input
                    placeholder='Mention Users (@username)'
                    value={mentionQuery}
                    onChange={handleMentionChange}
                  />
                </div>
                {mentionQuery.length > 3 && mentionQuery.startsWith("@") && (
                  <div className='max-h-[200px] overflow-auto'>
                    {availableUsers?.map((user) => (
                      <div
                        key={user?._id}
                        onClick={() => addMention(user)}
                        className='cursor-pointer hover:bg-gray-100 p-2'
                      >
                        {`${user?.username || "unknown"} (${
                          user?.fullName || ""
                        })` || "NA"}
                      </div>
                    ))}
                  </div>
                )}
              </>
            </PopoverContent>
          </Popover>

          <div className='flex gap-2'>
            {["high", "medium", "low"].map((priority) => (
              <Badge
                key={priority}
                onClick={() => setFormData((prev) => ({ ...prev, priority }))}
                className={`cursor-pointer ${
                  formData.priority === priority
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {priority}
              </Badge>
            ))}
          </div>
          <Button
            type='submit'
            disabled={
              !formData.title.trim() || formData.description.trim().length < 10
            }
          >
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationDialog;
