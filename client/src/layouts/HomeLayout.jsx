import { Outlet } from "react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./../components/ui/resizable";
import MainNavBar from "./../components/MainNavBar";
import Sidebar from "@/components/Sidebar";

const HomeLayout = () => {
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
    </div>
  );
};

export default HomeLayout;
