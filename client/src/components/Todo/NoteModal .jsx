import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import debounce from "lodash.debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { createNote } from "./apis/notesAPI";
import { getAllTags, createTag } from "./apis/tagAPI";
import { fetchUsers } from "../Auth/utils/authApi";

const NoteModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [tagQuery, setTagQuery] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available tags and users on mount
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

  // Debounced search for tags
  const fetchTags = debounce(async (query) => {
    if (!query) return;
    try {
      const res = await getAllTags(query);
      setAvailableTags(res?.data?.tags || []);
    } catch {
      toast.error("Failed to fetch tags");
    }
  }, 300);

  // Debounced search for users
  const fetchUsersSearch = debounce(async (query) => {
    if (!query.startsWith("@")) return;
    try {
      const res = await fetchUsers({ search: query.slice(1) });
      setAvailableUsers(res?.data?.users || []);
    } catch {
      toast.error("Failed to fetch users");
    }
  }, 300);

  // Handle tag selection
  const handleTagChange = (e) => {
    setTagQuery(e.target.value);
    if (e.target.value.length > 2) fetchTags(e.target.value);
  };

  //   const addTag = async () => {
  //     if (!tagQuery) return;
  //     try {
  //       const res = await createTag({ name: tagQuery });
  //       if (res?.data) {
  //         setTags((prev) => [...prev, res.data]);
  //         setTagQuery("");
  //       }
  //     } catch {
  //       toast.error("Error adding tag");
  //     }
  //   };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t?._id !== tag?._id));
  };

  // Handle mention selection
  const handleMentionChange = (e) => {
    const value = e.target.value;
    console.log("e : ", value);
    setMentionQuery(value);
    if (value.startsWith("@") && value.length > 2) fetchUsersSearch(value);
  };

  const addMention = (user) => {
    if (!mentionedUsers.some((u) => u._id === user._id)) {
      setMentionedUsers((prev) => [...prev, user]);
    }
    setMentionQuery("");
  };

  const removeMention = (id) => {
    setMentionedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  // Save note
  const handleSaveNote = async () => {
    setLoading(true);
    setError(null);

    try {
      const noteData = {
        todo: task._id,
        content: note,
        tags,
        mentionedUsers: mentionedUsers.map((u) => u._id),
      };

      await createNote(noteData);
      toast.success("Note added successfully ✅");
      onClose();
    } catch (err) {
      setError(err || "Error creating note");
      toast.error("Failed to add note ❌");
    } finally {
      setLoading(false);
    }
  };
  const addTag = (tag) => {
    console.log("tag in ad tag", tag, tags);
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagQuery("");
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

  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add Note to "{task?.title}"</DialogTitle>
          <DialogDescription>
            Write your note and tag users or topics.
          </DialogDescription>
        </DialogHeader>

        
        <Textarea
          placeholder='Write your note here...'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className='w-full'
        />

        <Popover id='popover-tag'>
          <PopoverTrigger asChild>
            <div className='flex flex-wrap gap-2 border-dotted  p-1'>
              {tags?.map((tag) => (
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
              {mentionedUsers?.map((user) => (
                <Badge
                  key={user?._id}
                  onClick={() => removeMention(user._id)}
                  className='cursor-pointer'
                >
                  {`${user?.username || "unknown"} (${user?.fullName || ""})` ||
                    "NA"}
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
        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSaveNote} disabled={!note.trim() || loading}>
            {loading ? "Saving..." : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
