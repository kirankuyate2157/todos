import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fetchNotes } from "./apis/notesAPI";

const NoteDrawer = ({ task, onClose }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task?._id) {
      setLoading(true);
      fetchNotes({ todo: task._id })
        .then((data) => setNotes(data.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [task]);

  return (
    <Drawer
      open={Boolean(task)}
      onClose={onClose}
      shouldScaleBackground
      direction='right'
    >
      <DrawerContent className='fixed right-0 top-0 h-full w-full max-w-md p-4 bg-white shadow-lg border-l border-gray-300'>
        <DrawerHeader className='flex flex-row w-full justify-between items-center border-b pb-2 mb-4'>
          <DrawerTitle className='text-xl w-[90%] text-wrap font-semibold text-gray-950'>
            {task?.title}
          </DrawerTitle>
          <DrawerClose asChild className='w-[20%]'>
            <Button
              variant='ghost'
              onClick={onClose}
              className='text-gray-500 bg-neutral-300 hover:text-gray-700'
            >
              Close
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <p className='text-gray-700 mb-4 text-sm'>{task?.description}</p>

        
        {task?.tags?.length > 0 && (
          <div className='mb-4 flex flex-wrap gap-2'>
            {task.tags.map((tag) => (
              <Badge key={tag._id} variant='secondary'>
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <ScrollArea className='h-[93vh] space-y-3 overflow-y-auto'>
          {loading ? (
            <div className='flex justify-center items-center py-4'>
              <Loader className='animate-spin text-black' />
            </div>
          ) : error ? (
            <p className='text-red-500'>{error}</p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note._id}
                className='p-3 bg-gray-100 rounded-lg mb-2 shadow-sm border border-gray-200'
              >
                <p className='text-sm text-gray-900 font-medium'>
                  {note.content}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  By {note.createdBy?.fullName || "Unknown"}
                </p>
                {note.mentionedUsers?.length > 0 && (
                  <div className='mt-2 flex flex-wrap gap-1'>
                    {note.mentionedUsers.map((user) => (
                      <Badge
                        key={user._id}
                        variant='outline'
                        className='text-xs'
                      >
                        @{user.username}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className='text-gray-500 text-center'>
              No notes found for this task.
            </p>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default NoteDrawer;

// import React, { useEffect, useState } from "react";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerClose,
// } from "@/components/ui/drawer";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Loader } from "lucide-react";
// import { fetchNotes } from "./apis/notesAPI";

// const NoteDrawer = ({ task, onClose }) => {
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (task?._id) {
//       setLoading(true);
//       fetchNotes({ todo: task._id })
//         .then((data) => {
//           console.log(data);
//           setNotes(data.data);
//         })
//         .catch((err) => setError(err.message))
//         .finally(() => setLoading(false));
//     }
//   }, [task]);

//   return (
//     <Drawer
//       open={Boolean(task)}
//       onClose={onClose}
//       shouldScaleBackground={true}
//       direction='right'
//     >
//       <DrawerContent className='fixed right-0 top-0 h-full w-full max-w-sm p-4 bg-white shadow-lg border-l border-gray-300'>
//         <DrawerHeader className='flex justify-between items-center border-b pb-2 mb-4'>
//           <DrawerTitle className='text-xl font-semibold text-blue-600'>
//             {task?.title}
//           </DrawerTitle>
//           <DrawerClose asChild>
//             <Button
//               variant='ghost'
//               onClick={onClose}
//               className='text-gray-500 hover:text-gray-700'
//             >
//               Close
//             </Button>
//           </DrawerClose>
//         </DrawerHeader>
//         <p className='text-gray-700 mb-4 text-sm'>{task?.description}</p>
//         <ScrollArea className='h-60 space-y-3 overflow-y-auto'>
//           {loading ? (
//             <div className='flex justify-center items-center py-4'>
//               <Loader className='animate-spin text-blue-500' />
//             </div>
//           ) : error ? (
//             <p className='text-red-500'>{error}</p>
//           ) : notes.length > 0 ? (
//             notes.map((note) => (
//               <div
//                 key={note._id}
//                 className='p-3 bg-gray-100 rounded-lg shadow-sm'
//               >
//                 <p className='text-sm text-gray-900'>{note.content}</p>
//                 <p className='text-xs text-gray-500 mt-1'>By {note.author}</p>
//               </div>
//             ))
//           ) : (
//             <p className='text-gray-500 text-center'>
//               No notes found for this task.
//             </p>
//           )}
//         </ScrollArea>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default NoteDrawer;
