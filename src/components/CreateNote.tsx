import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useCreateNote } from "@/hooks/useCreateNote";
import CryptoJS from "crypto-js"; // Import a cryptographic library
declare module 'crypto-js';

// Function to generate a strong password
const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    // Ensure the generated password meets the requirements
    let hasLower = false, hasUpper = false, hasNumber = false, hasSpecial = false;
    while (!(hasLower && hasUpper && hasNumber && hasSpecial && password.length >= 16)) {
        password = "";
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        hasLower = /[a-z]/.test(password);
        hasUpper = /[A-Z]/.test(password);
        hasNumber = /[0-9]/.test(password);
        hasSpecial = /[!@#$%^&*()_+]/.test(password);
    }
    return password;
};

// Function to validate password strength
const validatePassword = (password: string) => {
    if (password.length < 8) {
        return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+]/.test(password)) {
        return "Password must contain at least one special character (!@#$%^&*()_+)";
    }
    return null;
};

const CreateNote = () => {
    const createNoteHook = useCreateNote();
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usePassword, setUsePassword] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [noteUrl, setNoteUrl] = useState("");

    const createNote = async () => {
        if (!message.trim()) {
            toast("Error", {
                description: "Please enter a message",
            });
            return;
        }

        let finalPassword = password;
        let urlPassword = "";

        if (usePassword) {
            const validationError = validatePassword(password);
            if (validationError) {
                toast("Error", { description: validationError });
                return;
            }
            if (password !== confirmPassword) {
                toast("Error", { description: "Passwords do not match" });
                return;
            }
            // User provided a password, so don't include it in the URL
            urlPassword = "";
        } else {
            // Generate a strong password if 'use password' is off
            finalPassword = generatePassword();
            // Append the generated password to the URL with a hash sign
            urlPassword = `#${finalPassword}`;
        }

        setIsCreating(true);

        try {
            // Encrypt the message using AES and the finalPassword as the key
            const encryptedMessage = CryptoJS.AES.encrypt(message, finalPassword).toString();
            // The API should receive the encrypted message
            const createdNote = await createNoteHook.mutateAsync(encryptedMessage);

            const noteId = (createdNote.data as { noteLink: string }).noteLink.split("/");
            // Construct the final URL with or without the password hash
            const url = `${window.location.origin}/notes/${noteId[3]}${urlPassword}`;
            setNoteUrl(url);

            toast("Note created successfully", {
                description: "Your secure note is ready to share",
            });
        } catch {
            toast("Error", {
                description: "Failed to create note",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(noteUrl);
        toast("Copied to clipboard", {
            description: "Note URL has been copied",
        });
    };

    const reset = () => {
        setMessage("");
        setPassword("");
        setConfirmPassword("");
        setUsePassword(false);
        setNoteUrl("");
    };

    if (noteUrl) {
        return (
            <Card className="bg-gradient-secure border-primary/20 animate-fade-in">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Zap className="h-5 w-5" />
                        Note Created Successfully
                    </CardTitle>
                    <CardDescription>
                        Your secure note is ready to share. It will
                        self-destruct after being read.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Shareable URL</Label>
                        <div className="flex gap-2">
                            <Input
                                value={noteUrl}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                onClick={copyToClipboard}
                                variant="secondary"
                            >
                                Copy
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <ExternalLink className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive font-medium">
                            Warning: This note will be permanently destroyed
                            after the first read
                        </span>
                    </div>

                    <Button
                        onClick={reset}
                        variant="outline"
                        className="w-full hover:text-white"
                    >
                        Create Another Note
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Create Secure Note
                </CardTitle>
                <CardDescription>
                    Write your confidential message. It will self-destruct after
                    being read once.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                        id="message"
                        placeholder="Enter your confidential message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px] resize-none"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="use-password"
                            checked={usePassword}
                            onCheckedChange={setUsePassword}
                        />
                        <Label htmlFor="use-password">
                            Password protect this note
                        </Label>
                    </div>

                    {usePassword && (
                        <div className="space-y-4 animate-fade-in">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter a password for this note"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                The password must be at least 8 characters long and contain a mix of uppercase, lowercase, numbers, and special characters.
                            </p>
                        </div>
                    )}
                    {!usePassword && (
                         <p className="text-xs text-muted-foreground animate-fade-in">
                            A strong password will be automatically generated and embedded in the link for you.
                         </p>
                    )}
                </div>

                <Button
                    onClick={createNote}
                    disabled={isCreating || !message.trim()}
                    className="w-full"
                    size="lg"
                >
                    {isCreating ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                            Creating Secure Note...
                        </>
                    ) : (
                        <>
                            <Zap className="h-4 w-4 mr-2" />
                            Create Secure Note
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};

export default CreateNote;


// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Input } from "@/components/ui/input";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Lock, Zap, ExternalLink } from "lucide-react";
// import { toast } from "sonner";
// import { useCreateNote } from "@/hooks/useCreateNote";

// const CreateNote = () => {
//     const createNoteHook = useCreateNote();
//     const [message, setMessage] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [usePassword, setUsePassword] = useState(false);
//     const [skipConfirmation, setSkipConfirmation] = useState(false);
//     const [isCreating, setIsCreating] = useState(false);
//     const [noteUrl, setNoteUrl] = useState("");

//     const createNote = async () => {
//         if (!message.trim()) {
//             toast("Error", {
//                 description: "Please enter a message",
//             });
//             return;
//         }

//         if (usePassword) {
//             if (!password.trim()) {
//                 toast("Error", {
//                     description: "Please enter a message",
//                 });
//                 return;
//             }

//             if (password !== confirmPassword) {
//                 toast("Error", {
//                     description: "Passwords do not match",
//                 });
//                 return;
//             }

//             if (password.length < 4) {
//                 toast("Error", {
//                     description: "Password must be at least 4 characters long",
//                 });
//                 return;
//             }
//         }

//         setIsCreating(true);

//         try {
//             const createdNote = await createNoteHook.mutateAsync(btoa(message));
//             const noteId = (createdNote.data as { noteLink: string }).noteLink.split("/");
//             const url = `${window.location.origin}/notes/${noteId[3]}`;
//             setNoteUrl(url);

//             toast("Note created successfully", {
//                 description: "Your secure note is ready to share",
//             });
//         } catch {
//             toast("Error", {
//                 description: "Failed to create note",
//             });
//         } finally {
//             setIsCreating(false);
//         }
//     };

//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(noteUrl);
//         toast("Copied to clipboard", {
//             description: "Note URL has been copied",
//         });
//     };

//     const reset = () => {
//         setMessage("");
//         setPassword("");
//         setConfirmPassword("");
//         setUsePassword(false);
//         setSkipConfirmation(false);
//         setNoteUrl("");
//     };

//     if (noteUrl) {
//         return (
//             <Card className="bg-gradient-secure border-primary/20 animate-fade-in">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2 text-primary">
//                         <Zap className="h-5 w-5" />
//                         Note Created Successfully
//                     </CardTitle>
//                     <CardDescription>
//                         Your secure note is ready to share. It will
//                         self-destruct after being read.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                         <Label>Shareable URL</Label>
//                         <div className="flex gap-2">
//                             <Input
//                                 value={noteUrl}
//                                 readOnly
//                                 className="font-mono text-sm"
//                             />
//                             <Button
//                                 onClick={copyToClipboard}
//                                 variant="secondary"
//                             >
//                                 Copy
//                             </Button>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
//                         <ExternalLink className="h-4 w-4 text-destructive" />
//                         <span className="text-sm text-destructive font-medium">
//                             Warning: This note will be permanently destroyed
//                             after the first read
//                         </span>
//                     </div>

//                     <Button
//                         onClick={reset}
//                         variant="outline"
//                         className="w-full hover:text-white"
//                     >
//                         Create Another Note
//                     </Button>
//                 </CardContent>
//             </Card>
//         );
//     }

//     return (
//         <Card className="bg-card border-border">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Lock className="h-5 w-5 text-primary" />
//                     Create Secure Note
//                 </CardTitle>
//                 <CardDescription>
//                     Write your confidential message. It will self-destruct after
//                     being read once.
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                     <Label htmlFor="message">Your Message</Label>
//                     <Textarea
//                         id="message"
//                         placeholder="Enter your confidential message here..."
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         className="min-h-[120px] resize-none"
//                     />
//                 </div>

//                 <div className="space-y-4">
//                     <div className="flex items-center space-x-2">
//                         <Switch
//                             id="use-password"
//                             checked={usePassword}
//                             onCheckedChange={setUsePassword}
//                         />
//                         <Label htmlFor="use-password">
//                             Password protect this note
//                         </Label>
//                     </div>

//                     {usePassword && (
//                         <div className="space-y-4 animate-fade-in">
//                             <div className="space-y-2">
//                                 <Label htmlFor="password">Password</Label>
//                                 <Input
//                                     id="password"
//                                     type="password"
//                                     placeholder="Enter a password for this note"
//                                     value={password}
//                                     onChange={(e) =>
//                                         setPassword(e.target.value)
//                                     }
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="confirm-password">
//                                     Confirm Password
//                                 </Label>
//                                 <Input
//                                     id="confirm-password"
//                                     type="password"
//                                     placeholder="Confirm your password"
//                                     value={confirmPassword}
//                                     onChange={(e) =>
//                                         setConfirmPassword(e.target.value)
//                                     }
//                                 />
//                             </div>
//                             <p className="text-xs text-muted-foreground">
//                                 The password will be embedded in the link for
//                                 convenience
//                             </p>
//                         </div>
//                     )}

//                     <div className="flex items-center space-x-2">
//                         <Switch
//                             id="skip-confirmation"
//                             checked={skipConfirmation}
//                             onCheckedChange={setSkipConfirmation}
//                         />
//                         <Label htmlFor="skip-confirmation">
//                             Skip confirmation step for recipient
//                         </Label>
//                     </div>
//                 </div>

//                 <Button
//                     onClick={createNote}
//                     disabled={isCreating || !message.trim()}
//                     className="w-full"
//                     size="lg"
//                 >
//                     {isCreating ? (
//                         <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
//                             Creating Secure Note...
//                         </>
//                     ) : (
//                         <>
//                             <Zap className="h-4 w-4 mr-2" />
//                             Create Secure Note
//                         </>
//                     )}
//                 </Button>
//             </CardContent>
//         </Card>
//     );
// };

// export default CreateNote;
