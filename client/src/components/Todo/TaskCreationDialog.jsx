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

const TaskCreationDialog = ({ refreshTasks }) => {
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, usersRes] = await Promise.all([
          axios.get("/tags/"),
          axios.get("/users/search"),
        ]);
        setAvailableTags(tagsRes?.data?.data?.tags || []);
        setAvailableUsers(usersRes?.data?.data?.users || []);
      } catch (error) {
        toast.error("Failed to fetch data");
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

  const fetchUsers = debounce(async (query) => {
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
    if (value.startsWith("@") && value.length > 2) fetchUsers(value.slice(1));
  };

  const addMention = (user) => {
    if (!formData.mentionedUsers.some((u) => u.id === user.id)) {
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
      mentionedUsers: prev.mentionedUsers.filter((u) => u.id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.description.trim().length < 10)
      return;

    try {
      await axios.post("/todo", {
        ...formData,
        mentionedUsers: formData.mentionedUsers.map((u) => u.id),
      });
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
    } catch (error) {
      toast.error("Failed to create task ");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
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
              <span className='max-h-[150px] overflow-auto'>
                {availableTags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => addTag(tag)}
                    className='cursor-pointer hover:bg-gray-100 p-2'
                  >
                    {tag?.name}
                  </div>
                ))}
              </span>
            </PopoverContent>
          </Popover>
          <Popover id='popover-mention'>
            <PopoverTrigger asChild>
              <div className='flex flex-wrap gap-2 border-dotted p-1'>
                {formData?.mentionedUsers?.map((user) => (
                  <Badge
                    key={user?.id}
                    onClick={() => removeMention(user.id)}
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
              <div className='flex gap-1'>
                <Input
                  placeholder='Mention Users (@username)'
                  value={mentionQuery}
                  onChange={handleMentionChange}
                />
              </div>
              {mentionQuery.length > 3 && mentionQuery.startsWith("@") && (
                <span className='max-h-[150px] overflow-auto'>
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
                </span>
              )}
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
