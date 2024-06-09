import Dexie from 'dexie';
import { notification } from '@/types/notification';

// Extend Dexie to include the notes table
class MyDatabase extends Dexie {
    notes: Dexie.Table<notification, number>;

    constructor() {
        super("pings");
        this.version(2).stores({
            notes: '++id, title, description, severity, timeStamp, link'
        });
        this.notes = this.table("notes");
    }
}

const db = new MyDatabase();

// Function to add a note
export function addNote(note: notification): void {
    db.notes.add(note).then(() => {
        console.log("Note has been added to your database.");
    }).catch((error) => {
        console.error("Unable to add data: " + error);
    });
}

export const deleteByid = async (id:number) =>{
    await db.notes.delete(id);
    console.log("Note has been deleted from your database.");
}
export const getAll= async (severity: "normal" | "critical") =>{
    const res = await db.notes.where("severity").equals(severity);
    return await res.toArray();
}
interface AlertsCount {moderate:number; critical:number;}
export const getCounts = async (): Promise<AlertsCount> => {
    const moderate = await db.notes.where("severity").equals("normal").count()
    const critical = await db.notes.where("severity").equals("critical").count()
    return {moderate, critical}
}

// // Example usage
// const newNote: notification = {
//     title: "Note 1",
//     description: "This is the first note",
//     timeStamp: new Date(),
//     severity: "normal"
// };

// addNote(newNote);
