// // "use client";

// import { useContext, useState } from "react";
// import { UserContext } from "@/context/context";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Slider } from "@/components/ui/slider";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import toast from "react-hot-toast";

// export default function WeightsButton() {
//   const { user, setUser } = useContext(UserContext);

//   // State for tracking if the popup is open
//   const [open, setOpen] = useState(false);

//   // State for the three slider values
//   const [sliderValues, setSliderValues] = useState({
//     environmentalWeight: user.environmentalWeight,
//     socialWeight: user.socialWeight,
//     governanceWeight: user.governanceWeight,
//   });

//   // Update slider value from slider component
//   const handleSliderChange = (name, value) => {
//     setSliderValues((prev) => ({
//       ...prev,
//       [name]: value[0],
//     }));
//   };

//   // Update slider value from input field
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Convert to number and clamp between 0-100
//     let numValue = Number.parseInt(value, 10);

//     // Handle empty input or NaN
//     if (value === "" || isNaN(numValue)) {
//       setSliderValues((prev) => ({
//         ...prev,
//         [name]: 0,
//       }));
//       return;
//     }

//     // Clamp value between 0 and 100
//     numValue = Math.max(0, Math.min(100, numValue));

//     setSliderValues((prev) => ({
//       ...prev,
//       [name]: numValue,
//     }));
//   };

//   // Save all slider values to user state
//   const saveSettings = () => {
//     const userSettings = {
//       name: user.name,
//       email: user.email,
//       password: user.password,
//       environmentalWeight: sliderValues.environmentalWeight,
//       socialWeight: sliderValues.socialWeight,
//       governanceWeight: sliderValues.governanceWeight,
//     };

//     // Update user settings in context
//     setUser(userSettings);
//     setOpen(false);
//     toast.success("Weights successfully saved!");
//   };

//   return (
//     <div>
//       <Button
//         className="
//         absolute top-4 right-[calc(6rem+8px)]
//         px-4 py-2
//         bg-blue-500 hover:bg-blue-600
//         text-white font-semibold
//         rounded-lg shadow-md
//         transition duration-300 ease-in-out
//         transform hover:scale-105
//         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
//         cursor-pointer
//         "
//         onClick={() => setOpen(true)}
//       >
//         Open Settings
//       </Button>

//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Adjust Settings</DialogTitle>
//           </DialogHeader>

//           <div className="grid gap-6 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="environmentalWeight">Environmental Weight</Label>
//               <div className="flex items-center gap-4">
//                 <div className="flex-1">
//                   <Slider
//                     id="environmentalWeight"
//                     min={0}
//                     max={100}
//                     step={1}
//                     value={[sliderValues.environmentalWeight]}
//                     onValueChange={(value) =>
//                       handleSliderChange("environmentalWeight", value)
//                     }
//                   />
//                 </div>
//                 <div className="w-16">
//                   <Input
//                     type="number"
//                     name="environmentalWeight"
//                     value={sliderValues.environmentalWeight}
//                     onChange={handleInputChange}
//                     min={0}
//                     max={100}
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="socialWeight">Social Weight</Label>
//               <div className="flex items-center gap-4">
//                 <div className="flex-1">
//                   <Slider
//                     id="socialWeight"
//                     min={0}
//                     max={100}
//                     step={1}
//                     value={[sliderValues.socialWeight]}
//                     onValueChange={(value) =>
//                       handleSliderChange("socialWeight", value)
//                     }
//                   />
//                 </div>
//                 <div className="w-16">
//                   <Input
//                     type="number"
//                     name="socialWeight"
//                     value={sliderValues.socialWeight}
//                     onChange={handleInputChange}
//                     min={0}
//                     max={100}
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="governanceWeight">Governance Weight</Label>
//               <div className="flex items-center gap-4">
//                 <div className="flex-1">
//                   <Slider
//                     id="governanceWeight"
//                     min={0}
//                     max={100}
//                     step={1}
//                     value={[sliderValues.governanceWeight]}
//                     onValueChange={(value) =>
//                       handleSliderChange("governanceWeight", value)
//                     }
//                   />
//                 </div>
//                 <div className="w-16">
//                   <Input
//                     type="number"
//                     name="governanceWeight"
//                     value={sliderValues.governanceWeight}
//                     onChange={handleInputChange}
//                     min={0}
//                     max={100}
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button onClick={saveSettings}>Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
