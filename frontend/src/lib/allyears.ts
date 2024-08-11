export default function allYears(){
    const curDate = new Date()
    const years = Array.from({length: curDate.getFullYear() - 1900 + 1}, (_, i) =>{
        const dt = new Date();
        dt.setFullYear(i+1900)
        return dt
    })
    return years;
}