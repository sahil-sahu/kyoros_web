export interface notification {
    id?: number;
    title: string;
    description: string;
    timeStamp: Date;
    severity: "normal" | "critical";
    link: string;
}