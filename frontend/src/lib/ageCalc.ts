export default function ageCalc(isoDate:string){
    const date = new Date(isoDate);
    const yearDiff = new Date().getFullYear() - date.getFullYear();
    return yearDiff;
}