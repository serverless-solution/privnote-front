import { useState, useEffect } from "react";
import { 
    useParams, 
    useNavigate 
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getNote } from "@/services/notesService";
import CryptoJS from "crypto-js";

const ReadNote = () => {
    const { noteId: urlNoteId } = useParams();
    const navigate = useNavigate();
    const [noteId, setNoteId] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [note, setNote] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isDestroyed, setIsDestroyed] = useState(false);
    const [isReadingAndDestroying, setIsReadingAndDestroying] = useState(false);

    // New state to remember if a password was in the URL initially
    const [isPasswordInUrl, setIsPasswordInUrl] = useState(false);

    useEffect(() => {
        if (urlNoteId && urlNoteId !== 'hidden' && !noteId) {
            const hash = window.location.hash.substring(1);
            
            setNoteId(urlNoteId);
            if (hash) {
                setPassword(hash);
                setIsPasswordInUrl(true); // Flag that password was present
            }

            navigate('/read/hidden', { replace: true });
        }
    }, [urlNoteId, noteId, navigate]);

    const handleReadAndDestroy = async () => {
        setIsReadingAndDestroying(true);

        try {
            // Check the new state flag instead of the password state
            if (isPasswordInUrl) {
                await decryptNote();
            } else {
                // Only show the form if the password wasn't in the URL
                setShowPasswordForm(true);
            }
        } finally {
            setIsReadingAndDestroying(false);
        }
    };

    const decryptNote = async () => {
        if (!noteId) {
            toast("Error", {
                description: "Note not found.",
            });
            return;
        }

        if (!password) {
            toast("Error", {
                description: "Password is required to decrypt this note.",
            });
            return;
        }
        
        setIsDecrypting(true);

        try {
            const encryptedNote = await getNote(noteId);
            
            const bytes = CryptoJS.AES.decrypt(encryptedNote.data, password);
            const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedMessage) {
                throw new Error("Invalid password or corrupted data.");
            }

            setNote(decryptedMessage);
            setIsDestroyed(false);
            toast("Note Unlocked", {
                description: "The note has been successfully decrypted.",
            });
        } catch (error) {
            console.error("Decryption failed:", error);
            toast("Error", {
                description: "Failed to decrypt note. The password may be incorrect or the note may have been destroyed.",
            });
            setPassword("");
            setNote(null);
        } finally {
            setIsDecrypting(false);
        }
    };

    const goHome = () => {
        navigate("/");
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(note ?? '');
        toast("Copied to clipboard", {
            description: "Note has been copied",
        });
    };

    // 1. If note is destroyed, show destroyed message
    if (isDestroyed) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-gradient-danger border-destructive/20">
                    <CardHeader className="text-center">
                        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <CardTitle className="text-destructive">
                            Note Destroyed
                        </CardTitle>
                        <CardDescription>
                            This note has been permanently destroyed and cannot
                            be recovered.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={goHome}
                            variant="outline"
                            className="w-full"
                        >
                            Create New Note
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2. If note is already decrypted, show the decrypted message
    if (note) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl bg-gradient-secure border-primary/20 animate-fade-in">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <CardTitle className="text-primary">
                                Secure Note
                            </CardTitle>
                        </div>
                        <CardDescription>
                            This note will be destroyed when you navigate away.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-background/10 rounded-lg border border-primary/20">
                            <p className="whitespace-pre-wrap text-foreground">
                                {note}
                            </p>
                        </div>
                        <Button
                            onClick={copyToClipboard}
                            variant="secondary"
                            className="w-full"
                        >
                            Copy
                        </Button>

                        <Alert className="border-destructive/20 bg-destructive/10">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <AlertDescription className="text-destructive">
                                Warning: This note is being destroyed in real-time. Do
                                not refresh or navigate away.
                            </AlertDescription>
                        </Alert>

                        <Button
                            onClick={goHome}
                            variant="outline"
                            className="w-full hover:text-white"
                        >
                            Return to Homepage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    // 3. If password form is needed
    if (showPasswordForm) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle>Password Required</CardTitle>
                        <CardDescription>
                            This note is password protected. Enter the password
                            to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter note password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    password &&
                                    decryptNote()
                                }
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={goHome}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={decryptNote}
                                disabled={!password || isDecrypting}
                                className="flex-1"
                            >
                                {isDecrypting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                                        Decrypting...
                                    </>
                                ) : (
                                    "Unlock Note"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 4. Initial state (confirmation screen)
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Read Secure Note</CardTitle>
                    <CardDescription>
                        This note will be permanently destroyed after
                        reading. Are you sure you want to continue?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert className="border-destructive/20 bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <AlertDescription className="text-destructive">
                            Warning: This action cannot be undone. The note
                            will be destroyed after reading.
                        </AlertDescription>
                    </Alert>
                    <div className="flex gap-2">
                        <Button
                            onClick={goHome}
                            variant="outline"
                            className="flex-1 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReadAndDestroy}
                            variant="destructive"
                            className="flex-1"
                            disabled={isReadingAndDestroying}
                        >
                            {isReadingAndDestroying ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                                    Reading...
                                </>
                            ) : (
                                "Read & Destroy"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReadNote;


// import { useState, useEffect } from "react";
// import { 
//     useParams, 
//     useNavigate 
// } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Eye, Lock, AlertTriangle, CheckCircle } from "lucide-react";
// import { toast } from "sonner";
// import { getNote } from "@/services/notesService";

// const ReadNote = () => {
//     const { noteId } = useParams();
//     const navigate = useNavigate();
//     const [password, setPassword] = useState("");
//     const [showPasswordForm, setShowPasswordForm] = useState(false);
//     const [note, setNote] = useState<string | null>(null);
//     const [isDecrypting, setIsDecrypting] = useState(false);
//     const [hasConfirmed, setHasConfirmed] = useState(false);
//     const [isDestroyed, setIsDestroyed] = useState(false);

//     useEffect(() => {
//         // Check for skip confirmation parameter
//         const urlParams = new URLSearchParams(window.location.search);
//         const shouldSkip = urlParams.get("skip") === "1";

//         if (shouldSkip) {
//             setHasConfirmed(true);
//         }

//         // Check for embedded password in URL hash
//         const hash = window.location.hash.substring(1);
//         if (hash) {
//             try {
//                 const decodedPassword = atob(hash);
//                 setPassword(decodedPassword);
//             } catch {
//                 console.error("Failed to decode password from URL");
//             }
//         }
//     }, []);

//     const showConfirmation = async () => {
//         console.log("showConfirmation")
//         if (!hasConfirmed) {
//             setHasConfirmed(true);
//             // return;
//         }

//         // If password exists (either from URL or user input), show password form
//         if (!password && !showPasswordForm) {
//             setShowPasswordForm(false);
//             // return;
//         }

//         await decryptNote();
//     };

//     const decryptNote = async () => {
//         setIsDecrypting(true);

//         // Simulate decryption process
//         try {
//             const note = await getNote(noteId ?? '');

//             setIsDestroyed(false);
//             setNote(atob(note.data));
//             toast("Note Destroyed", {
//                 description: "This note has been permanently destroyed",
//             });

//             // // Simulate note destruction after a delay
//             // setTimeout(() => {
//             //     setIsDestroyed(true);
//             //     setNote(null);
//             //     toast("Note Destroyed", {
//             //         description: "This note has been permanently destroyed",
//             //     });
//             // }, 10000); // 10 seconds to read
//         } catch {
//             toast("Error", {
//                 description: "Failed to decrypt note. It may have been destroyed or the password is incorrect.",
//             });
//         } finally {
//             setIsDecrypting(false);
//         }
//     };

//     const goHome = () => {
//         navigate("/");
//     };

//     const copyToClipboard = async () => {
//         await navigator.clipboard.writeText(note ?? '');
//         toast("Copied to clipboard", {
//             description: "Note has been copied",
//         });
//     };

//     if (isDestroyed) {
//         return (
//             <div className="min-h-screen bg-background flex items-center justify-center p-4">
//                 <Card className="w-full max-w-md bg-gradient-danger border-destructive/20">
//                     <CardHeader className="text-center">
//                         <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
//                         <CardTitle className="text-destructive">
//                             Note Destroyed
//                         </CardTitle>
//                         <CardDescription>
//                             This note has been permanently destroyed and cannot
//                             be recovered.
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                         <Button
//                             onClick={goHome}
//                             variant="outline"
//                             className="w-full"
//                         >
//                             Create New Note
//                         </Button>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }

//     if (note) {
//         return (
//             <div className="min-h-screen bg-background flex items-center justify-center p-4">
//                 <Card className="w-full max-w-2xl bg-gradient-secure border-primary/20 animate-fade-in">
//                     <CardHeader>
//                         <div className="flex items-center gap-2">
//                             <CheckCircle className="h-5 w-5 text-primary" />
//                             <CardTitle className="text-primary">
//                                 Secure Note
//                             </CardTitle>
//                         </div>
//                         <CardDescription>
//                             This note will be destroyed when you navigate away.
//                         </CardDescription>
//                         {/* <CardDescription>
//                             This note will be destroyed in 10 seconds or when
//                             you navigate away.
//                         </CardDescription> */}
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="p-4 bg-background/10 rounded-lg border border-primary/20">
//                             <p className="whitespace-pre-wrap text-foreground">
//                                 {note}
//                             </p>
//                         </div>
//                         <Button
//                             onClick={copyToClipboard}
//                             variant="secondary"
//                             className="w-full"
//                         >
//                             Copy
//                         </Button>

//                         <Alert className="border-destructive/20 bg-destructive/10">
//                             <AlertTriangle className="h-4 w-4 text-destructive" />
//                             <AlertDescription className="text-destructive">
//                                 This note is being destroyed in real-time. Do
//                                 not refresh or navigate away.
//                             </AlertDescription>
//                         </Alert>

//                         <Button
//                             onClick={goHome}
//                             variant="outline"
//                             className="w-full hover:text-white"
//                         >
//                             Return to Bitburner
//                         </Button>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }

//     if (!hasConfirmed) {
//         return (
//             <div className="min-h-screen bg-background flex items-center justify-center p-4">
//                 <Card className="w-full max-w-md">
//                     <CardHeader className="text-center">
//                         <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
//                         <CardTitle>Read Secure Note</CardTitle>
//                         <CardDescription>
//                             This note will be permanently destroyed after
//                             reading. Are you sure you want to continue?
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <Alert className="border-destructive/20 bg-destructive/10">
//                             <AlertTriangle className="h-4 w-4 text-destructive" />
//                             <AlertDescription className="text-destructive">
//                                 Warning: This action cannot be undone. The note
//                                 will be destroyed after reading.
//                             </AlertDescription>
//                         </Alert>

//                         <div className="flex gap-2">
//                             <Button
//                                 onClick={goHome}
//                                 variant="outline"
//                                 className="flex-1 hover:text-white"
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 onClick={showConfirmation}
//                                 variant="destructive"
//                                 className="flex-1"
//                             >
//                                 Read & Destroy
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }

//     if (showPasswordForm && !password) {
//         return (
//             <div className="min-h-screen bg-background flex items-center justify-center p-4">
//                 <Card className="w-full max-w-md">
//                     <CardHeader className="text-center">
//                         <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
//                         <CardTitle>Password Required</CardTitle>
//                         <CardDescription>
//                             This note is password protected. Enter the password
//                             to continue.
//                         </CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="password">Password</Label>
//                             <Input
//                                 id="password"
//                                 type="password"
//                                 placeholder="Enter note password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 onKeyDown={(e) =>
//                                     e.key === "Enter" &&
//                                     password &&
//                                     decryptNote()
//                                 }
//                             />
//                         </div>

//                         <div className="flex gap-2">
//                             <Button
//                                 onClick={goHome}
//                                 variant="outline"
//                                 className="flex-1"
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 onClick={decryptNote}
//                                 disabled={!password || isDecrypting}
//                                 className="flex-1"
//                             >
//                                 {isDecrypting ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
//                                         Decrypting...
//                                     </>
//                                 ) : (
//                                     "Unlock Note"
//                                 )}
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-background flex items-center justify-center p-4">
//             <Card className="w-full max-w-md">
//                 <CardHeader className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//                     <CardTitle>Decrypting Note</CardTitle>
//                     <CardDescription>
//                         Please wait while we securely decrypt your note...
//                     </CardDescription>
//                 </CardHeader>
//             </Card>
//         </div>
//     );
// };

// export default ReadNote;
