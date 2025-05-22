"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/clients";
import { User } from "@supabase/supabase-js";

// Define a type for user metadata to improve type safety
interface UserMetadata {
  display_name?: string;
  avatar_url?: string;
  role?: string;
}

// Form schema for validation
const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Form setup with react-hook-form and zod
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      avatarUrl: "",
    },
  });

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        toast({
          title: "Error",
          description: "Failed to load user data. Please log in.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setUser(user);
      form.reset({
        displayName: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
        avatarUrl: user.user_metadata?.avatar_url || "",
      });
      setIsLoading(false);
    }
    fetchUser();
  }, [form, toast]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      form.setValue("avatarUrl", URL.createObjectURL(file)); // Preview locally
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      let avatarUrl = data.avatarUrl;

      // Upload new avatar to Supabase Storage if a file is selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) {
          throw new Error(`Failed to upload avatar: ${uploadError.message}`);
        }

        // Get public URL for the uploaded avatar
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
        avatarUrl = publicUrlData.publicUrl;
      }

      // Update user metadata in Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: data.displayName,
          avatar_url: avatarUrl,
        },
      });

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      // Update local state with typed User
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user_metadata: {
            ...prev.user_metadata,
            display_name: data.displayName,
            avatar_url: avatarUrl,
          } as UserMetadata,
        };
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unauthenticated state
  if (!user && !isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please log in to view your profile.
            </p>
            <Button asChild className="mt-4">
              <Link href="/login">Log in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <p className="text-muted-foreground">
            Update your profile information below.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={form.watch("avatarUrl") || "https://github.com/shadcn.png"}
                      alt={form.watch("displayName")}
                    />
                    <AvatarFallback>
                      {form.watch("displayName")?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Label htmlFor="avatar-upload">
                      <Button variant="outline" asChild>
                        <span className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload New Avatar
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>

                {/* Display Name */}
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email (Read-Only) */}
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ""} disabled />
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact support to change your email.
                  </p>
                </div>

                {/* Role (Read-Only, Optional) */}
                {user?.user_metadata?.role && (
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={user.user_metadata.role}
                      disabled
                      className="capitalize"
                    />
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-between">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}




// "use client";

// import { useState, useEffect } from "react";
// // import { createClient } from "@/utils/supabase/client"; // Client-side Supabase client
// import { useToast } from "@/hooks/use-toast";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Loader2, Upload } from "lucide-react"; // Icons for loading and upload
// import Link from "next/link";
// import { supabase } from "@/utils/supabase/clients";
// import { User } from "@supabase/supabase-js";

// // Form schema for validation
// const profileSchema = z.object({
//   displayName: z
//     .string()
//     .min(2, "Name must be at least 2 characters")
//     .max(50, "Name cannot exceed 50 characters"),
//   avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
// });

// type ProfileFormValues = z.infer<typeof profileSchema>;

// export default function ProfilePage() {
//   const { toast } = useToast();
// //   const supabase = createClient();
//   const [user, setUser] = useState<User | null>(null); // Store user data
//   const [isLoading, setIsLoading] = useState(true);
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);

//   // Form setup with react-hook-form and zod
//   const form = useForm<ProfileFormValues>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       displayName: "",
//       avatarUrl: "",
//     },
//   });

//   // Fetch user data on mount
//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error || !user) {
//         toast({
//           title: "Error",
//           description: "Failed to load user data. Please log in.",
//           variant: "destructive",
//         });
//         setIsLoading(false);
//         return;
//       }

//       setUser(user);
//       form.reset({
//         displayName: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
//         avatarUrl: user.user_metadata?.avatar_url || "",
//       });
//       setIsLoading(false);
//     }
//     fetchUser();
//   }, [form, toast]);

//   // Handle avatar file selection
//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatarFile(file);
//       form.setValue("avatarUrl", URL.createObjectURL(file)); // Preview locally
//     }
//   };

//   // Handle form submission
//   const onSubmit = async (data: ProfileFormValues) => {
//     setIsLoading(true);
//     try {
//       let avatarUrl = data.avatarUrl;

//       // Upload new avatar to Supabase Storage if a file is selected
//       if (avatarFile) {
//         const fileExt = avatarFile.name.split(".").pop();
//         const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from("avatars") // Assumes a bucket named "avatars"
//           .upload(fileName, avatarFile);

//         // if (uploadError || !uploadData) {
//         if (uploadError) {
//           throw new Error(`Failed to upload avatar: ${uploadError.message}`);
//         }

//         // Get public URL for the uploaded avatar
//         const { data: publicUrlData } = supabase.storage
//           .from("avatars")
//           .getPublicUrl(fileName);
//         avatarUrl = publicUrlData.publicUrl;
//       }

//       // Update user metadata in Supabase
//       const { error: updateError } = await supabase.auth.updateUser({
//         data: {
//           display_name: data.displayName,
//           avatar_url: avatarUrl,
//         },
//       });

//       if (updateError) {
//         throw new Error(`Failed to update profile: ${updateError.message}`);
//       }

//       // Update local state
//       setUser((prev: any) => ({
//         ...prev,
//         user_metadata: {
//           ...prev.user_metadata,
//           display_name: data.displayName,
//           avatar_url: avatarUrl,
//         },
//       }));

//       toast({
//         title: "Profile Updated",
//         description: "Your profile has been updated successfully.",
//         variant: "default",
//       });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update profile.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle unauthenticated state
//   if (!user && !isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Access Denied</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">
//               Please log in to view your profile.
//             </p>
//             <Button asChild className="mt-4">
//               <Link href="/login">Log in</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className=" min-h-screen flex items-center justify-center bg-background p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl">Profile Settings</CardTitle>
//           <p className="text-muted-foreground">
//             Update your profile information below.
//           </p>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="flex justify-center">
//               <Loader2 className="h-8 w-8 animate-spin" />
//             </div>
//           ) : (
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                 {/* Avatar Upload */}
//                 <div className="flex flex-col items-center gap-4">
//                   <Avatar className="h-24 w-24">
//                     <AvatarImage
//                       src={form.watch("avatarUrl") || "https://github.com/shadcn.png"}
//                       alt={form.watch("displayName")}
//                     />
//                     <AvatarFallback>
//                       {form.watch("displayName")?.slice(0, 2).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleAvatarChange}
//                       className="hidden"
//                       id="avatar-upload"
//                     />
//                     <Label htmlFor="avatar-upload">
//                       <Button variant="outline" asChild>
//                         <span className="flex items-center gap-2">
//                           <Upload className="h-4 w-4" />
//                           Upload New Avatar
//                         </span>
//                       </Button>
//                     </Label>
//                   </div>
//                 </div>

//                 {/* Display Name */}
//                 <FormField
//                   control={form.control}
//                   name="displayName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Display Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder="Enter your name" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Email (Read-Only) */}
//                 <div>
//                   <Label>Email</Label>
//                   <Input value={user?.email || ""} disabled />
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Contact support to change your email.
//                   </p>
//                 </div>

//                 {/* Role (Read-Only, Optional) */}
//                 {user?.user_metadata?.role && (
//                   <div>
//                     <Label>Role</Label>
//                     <Input
//                       value={user.user_metadata.role}
//                       disabled
//                       className="capitalize"
//                     />
//                   </div>
//                 )}

//                 {/* Form Actions */}
//                 <div className="flex justify-between">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     asChild
//                   >
//                     <Link href="/dashboard">Cancel</Link>
//                   </Button>
//                   <Button type="submit" disabled={isLoading}>
//                     {isLoading ? (
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     ) : (
//                       "Save Changes"
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }