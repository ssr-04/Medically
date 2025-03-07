
export const getNoOfDays = (height:number, width:number, CurrentCount:number, extra:number, prescriptionDuration: number) => {
    const totalCount = CurrentCount + (height*width)*extra;
    const days = totalCount / (24/prescriptionDuration);
    return Math.floor(days);
}