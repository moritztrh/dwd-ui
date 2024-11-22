export function GetLocalToday() : Date {
    let now = new Date();    
    now.setHours(0,0,0,0);
    let offsetInMinutes = now.getTimezoneOffset();    
    return AddHours(now, offsetInMinutes/60)    
}

export function AddHours(date: Date, hours: number): Date {
    var result = new Date();
    result.setTime(date.getTime() + (hours*60*60*1000));
    return result;
}