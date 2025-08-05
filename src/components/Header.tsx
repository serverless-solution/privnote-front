import { Shield } from "lucide-react";

const Header = () => {
    return (
        <header className="border-b border-border bg-gradient-secure">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Shield className="h-8 w-8 text-primary animate-security-pulse" />
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Bitburner
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Send confidential messages that disappear without a
                            trace
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
