'use client'

export const pintheGlance = (patientid:string) =>{
    const store = localStorage.getItem('glance');
    if(!store){
        localStorage.setItem('glance', JSON.stringify([patientid]));
        return;
    }
    const glance = JSON.parse(store);
    if(!glance.includes(patientid)){
        glance.push(patientid);
        localStorage.setItem('glance', JSON.stringify(glance));
    }
}

export const unpinGlance = (patientid:string) =>{
    const store = localStorage.getItem('glance');
    if(!store){
        return;
    }
    const glance = JSON.parse(store);
    if(glance.includes(patientid)){
        glance.splice(glance.indexOf(patientid), 1);
        localStorage.setItem('glance', JSON.stringify(glance));
    }
}