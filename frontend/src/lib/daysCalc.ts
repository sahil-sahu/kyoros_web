export function getDateDifferenceFromNow(isoDateString: string): number {
    // Parse ISO date string into Date object
    const date = new Date(isoDateString);
    
    // Get current date
    const currentDate = new Date();
    
    // Calculate difference in milliseconds
    const differenceMs = currentDate.getTime() - date.getTime();
    
    // Convert milliseconds to days
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    
    return differenceDays; // You can modify the output format as needed
}