import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Building2, Sparkles } from "lucide-react";
import React from "react";

interface Props {
  meta: { name: string };
  onMetaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWorkspaceCreate: (e: React.FormEvent) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateWorkspace({
  meta,
  onMetaChange,
  onWorkspaceCreate,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Create Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Create New Workspace
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Set up a collaborative space for your team
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <form onSubmit={onWorkspaceCreate} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="name" 
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                Workspace Name
              </Label>
              <Input
                id="name"
                name="name"
                value={meta.name}
                onChange={onMetaChange}
                placeholder="Enter workspace name..."
                className="w-full px-4 py-3 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              {/* <p className="text-xs text-gray-500">
                Choose a descriptive name that your team will recognize
              </p> */}
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {/* <Building2 className="w-4 h-4 mr-2" /> */}
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}