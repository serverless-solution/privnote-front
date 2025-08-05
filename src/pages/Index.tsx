import Header from "@/components/Header";
import CreateNote from "@/components/CreateNote";
import FeatureGrid from "@/components/FeatureGrid";

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-12 space-y-16">
                {/* Hero Section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Send Messages That Disappear Without a Trace
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Bitburner provides ultimate control over your
                        confidential communications with advanced encryption and
                        self-destructing messages.
                    </p>
                </div>

                {/* Create Note Section */}
                <div className="max-w-2xl mx-auto">
                    <CreateNote />
                </div>

                {/* Features Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-4">
                            Security Features
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Built with privacy and security at its core,
                            Bitburner offers advanced features to protect your
                            most sensitive communications.
                        </p>
                    </div>
                    <FeatureGrid />
                </div>

                {/* Security Note */}
                <div className="bg-gradient-secure border border-primary/20 rounded-lg p-6 text-center max-w-2xl mx-auto">
                    <h4 className="text-xl font-semibold text-primary mb-2">
                        Zero-Knowledge Architecture
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        All encryption and decryption happens in your browser.
                        We never see your unencrypted content, ensuring complete
                        privacy and security for your confidential messages.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Index;
