import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  
  const Menu = ({ handleImageChange, handleVideoChange, handleAudioChange }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
            />
          </svg>
        </DropdownMenuTrigger>
  
        <DropdownMenuContent>
          <DropdownMenuItem>
            <label htmlFor="image" className="relative w-full">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => console.log(e.target.files[0])}
                className="absolute inset-0 cursor-pointer"
              />
              <span>Image</span>
            </label>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <label htmlFor="video" className="relative w-full">
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
              <span>Video</span>
            </label>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <label htmlFor="" className="relative w-full">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="opacity-0 absolute inset-0 cursor-pointer"
              />
              <span>Audio</span>
            </label>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
  
  export default Menu;