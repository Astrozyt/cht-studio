import { BaseDirectory, remove } from "@tauri-apps/plugin-fs";
import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const deleteFnFactory = (path: string) => {
  return () => {
    remove(path, { baseDir: BaseDirectory.AppData, recursive: true }).then(() => {
      console.log("Deleted:", path);
      toast.success("Deletion successful!");
      // Refresh the project list after deletion
      // You may want to call the update function here if it's passed as an argument
    }).catch((error) => {
      console.error("Error deleting project:", error);
      toast.error("Error deleting project. Please try again.");
    });
  };
};
