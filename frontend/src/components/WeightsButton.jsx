// "use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react"; // Import X icon
import toast from "react-hot-toast";
import axios from "axios";

export default function WeightsButton() {
  const { user, setUser } = useContext(UserContext);

  // State for tracking if the popup is open
  const [open, setOpen] = useState(false);

  // State for the three slider values
  const [sliderValues, setSliderValues] = useState({
    environmentalWeight: user.environmentalWeight,
    socialWeight: user.socialWeight,
    governanceWeight: user.governanceWeight,
  });

  // Update slider value from slider component
  const handleSliderChange = (name, value) => {
    setSliderValues((prev) => ({
      ...prev,
      [name]: value[0],
    }));
  };

  // Update slider value from input field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.min(100, Math.max(0, Number.parseInt(value) || 0));

    setSliderValues((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  // Save all slider values to user state
  const saveSettings = async () => {
    const userSettings = {
      ...user,
      environmentalWeight: sliderValues.environmentalWeight,
      socialWeight: sliderValues.socialWeight,
      governanceWeight: sliderValues.governanceWeight,
    };
    const response = await axios.put("/auth/updateProfile", userSettings);
    console.log(response);

    // Update user settings in context
    setUser(userSettings);
    setOpen(false);
    toast.success("Weights successfully saved!");
  };

  // Reset slider values when dialog is closed
  const handleDialogClose = (isOpen) => {
    if (!isOpen) {
      // Reset slider values to initial state from `user`
      setSliderValues({
        environmentalWeight: user.environmentalWeight,
        socialWeight: user.socialWeight,
        governanceWeight: user.governanceWeight,
      });
    }
    setOpen(isOpen);
  };

  return (
    <div>
      <Button
        className="
        absolute top-4 left-[calc(4rem+8px)]
        h-10
        px-4 py-2
        text-black font-semibold
        rounded-lg shadow-md
        transition duration-300 ease-in-out
        transform hover:scale-105
        focus:outline-none focus:ring-2
        focus:ring-opacity-50
        cursor-pointer
        "
        onClick={() => setOpen(true)}
        variant="outline"
      >
        Edit Weights
      </Button>

      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px] border-2 border-primary shadow-lg shadow-primary/20 animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle>Adjust ESG Weights</DialogTitle>
            <DialogDescription>Click Save when you are done!</DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Environment Weight */}
            <div className="space-y-2">
              <Label htmlFor="environmentalWeight">Environmental Weight</Label>

              <div className="flex items-center gap-4">
                {/* Slider */}
                <div className="flex-1">
                  <Slider
                    className="bg-black/25"
                    id="environmentalWeight"
                    min={0}
                    max={100}
                    step={1}
                    value={[sliderValues.environmentalWeight]}
                    onValueChange={(value) =>
                      handleSliderChange("environmentalWeight", value)
                    }
                  />
                </div>
                {/* Input */}
                <div className="w-16">
                  <Input
                    type="number"
                    name="environmentalWeight"
                    value={sliderValues.environmentalWeight}
                    onChange={handleInputChange}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Social Weight */}
            <div className="space-y-2">
              <Label htmlFor="socialWeight">Social Weight</Label>
              <div className="flex items-center gap-4">
                {/* Slider */}
                <div className="flex-1">
                  <Slider
                    className="bg-black/25"
                    id="socialWeight"
                    min={0}
                    max={100}
                    step={1}
                    value={[sliderValues.socialWeight]}
                    onValueChange={(value) =>
                      handleSliderChange("socialWeight", value)
                    }
                  />
                </div>
                {/* Input */}
                <div className="w-16">
                  <Input
                    type="number"
                    name="socialWeight"
                    value={sliderValues.socialWeight}
                    onChange={handleInputChange}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            {/* Governance Weight */}
            <div className="space-y-2">
              <Label htmlFor="governanceWeight">Governance Weight</Label>
              <div className="flex items-center gap-4">
                {/* Slider */}
                <div className="flex-1">
                  <Slider
                    className="bg-black/25"
                    id="governanceWeight"
                    min={0}
                    max={100}
                    step={1}
                    value={[sliderValues.governanceWeight]}
                    onValueChange={(value) =>
                      handleSliderChange("governanceWeight", value)
                    }
                  />
                </div>
                {/* Input */}
                <div className="w-16">
                  <Input
                    type="number"
                    name="governanceWeight"
                    value={sliderValues.governanceWeight}
                    onChange={handleInputChange}
                    min={0}
                    max={100}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={saveSettings}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
