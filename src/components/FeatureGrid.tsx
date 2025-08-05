import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Shield, Clock, Link, Eye, Lock, Zap } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Self-Destruct After Read",
        description:
            "Notes automatically disappear immediately after being accessed for the first time.",
    },
    {
        icon: Lock,
        title: "Password Protection",
        description:
            "Encrypt your notes with custom passwords for an extra layer of security.",
    },
    {
        icon: Link,
        title: "Secure Link Generation",
        description:
            "Get a unique, shareable URL for each note that's easy to distribute securely.",
    },
    {
        icon: Eye,
        title: "Zero-Knowledge Architecture",
        description:
            "All encryption happens in your browser. We never see your unencrypted content.",
    },
    {
        icon: Clock,
        title: "Time-Based Expiration",
        description:
            "Set custom expiration times to automatically destroy notes after a set duration.",
    },
    {
        icon: Shield,
        title: "Advanced Security Options",
        description: "Military-grade AES 256-bit encryption for unbreakable data protection.",
    },
];

const FeatureGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <Card
                        key={index}
                        className="bg-card border-border hover:border-primary/30 transition-all duration-300 group"
                    >
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-lg">
                                    {feature.title}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-muted-foreground">
                                {feature.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default FeatureGrid;
