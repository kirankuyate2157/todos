import { Outlet, useLocation, useNavigation } from "react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./../components/ui/resizable";
import MainNavBar from "./../components/MainNavBar";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import TaskCreationDialog from "./../components/Todo/TaskCreationDialog";

const HomeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isCreateTaskOpen = searchParams.get("createTask") === "true";

  const handleCloseModal = () => {
    searchParams.delete("createTask"); // Remove the query param
    navigate({ search: searchParams.toString() }, { replace: true });
  };
  return (
    <div className='flex flex-col h-screen'>
      <MainNavBar />
      <ResizablePanelGroup direction='horizontal' className='flex-grow'>
        <ResizablePanel
          className='hidden lg:block'
          defaultSize={12}
          maxSize={12}
          minSize={12}
        >
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className='w-[90wv] h-[95vh] relative'>
            <div className='px-2 lg:px-10'>
              <Outlet />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <TaskCreationDialog
        refreshTasks={() => {}}
        initialOpen={isCreateTaskOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default HomeLayout;
