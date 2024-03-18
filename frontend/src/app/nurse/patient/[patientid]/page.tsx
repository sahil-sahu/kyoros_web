"use client";
import { useEffect, useRef } from 'react';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import PatientInfo from "@/components/custom/pateintInfo";
import { PatientFormData } from '@/types/pateintinfo';
import AutoBreadcrumb from '@/components/custom/breadCrumb';
import { useMutation } from '@tanstack/react-query';
import { addPeriodicData } from './mutation';
import { useRouter } from 'next/navigation';
import ICON from './wired-flat-245-edit-document.json';
import { usePatientQuery } from '@/lib/getpatients';
const PatientMonitoringForm = ({ params:{patientid} }: { params: { patientid: string } }) => {
  const router = useRouter();
  const { data:patientinfo, isLoading:p_isLoading, error:p_error } = usePatientQuery(patientid);
  const [formData, setFormData] = useState<PatientFormData>({
    bloodTests: '',
    abgAnalysis: '',
    imagingStudies: '',
    nutritionalAssessment: '',
    drugLevels: '',
    fluidBalance: '',
    woundAssessment: '',
    rehabilitationProgress: '',
    cultureAndInfectionMarkers: '',
    ecgMonitoring: '',
    mentalHealthAssessment: '',
  });
  
  const {mutate, error, data, isPending:isLoading} = useMutation({mutationFn:addPeriodicData});
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({patientId:patientid, patientlog:formData})
  };

  useEffect(()=>{
    if(data)
      router.back();
  }, [data,router]);
  return (
    <section className='container mx-auto max-w-3xl p-8'>
      <br />
      <br />
      <br />
        <AutoBreadcrumb></AutoBreadcrumb>
        {
          patientinfo && !isLoading?<PatientInfo patientid={patientid} />:<br />
        }
        <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="bloodTests">Blood Tests</Label>
          <Textarea id="bloodTests" name="bloodTests" value={formData.bloodTests} onChange={handleChange} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="abgAnalysis">Arterial Blood Gas (ABG) Analysis</Label>
          <Input id="abgAnalysis" name="abgAnalysis" value={formData.abgAnalysis} onChange={handleChange} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="imagingStudies">Imaging Studies</Label>
          <Input id="imagingStudies" name="imagingStudies" value={formData.imagingStudies} onChange={handleChange} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="nutritionalAssessment">Nutritional Assessment</Label>
          <Input id="nutritionalAssessment" name="nutritionalAssessment" value={formData.nutritionalAssessment} onChange={handleChange} className="mt-1" />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="drugLevels">Drug Levels</Label>
          <Input id="drugLevels" name="drugLevels" value={formData.drugLevels} onChange={handleChange} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="woundAssessment">Wound Assessment</Label>
          <Input id="woundAssessment" name="woundAssessment" value={formData.woundAssessment} onChange={handleChange} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="rehabilitationProgress">Rehabilitation Progress</Label>
          <Input id="rehabilitationProgress" name="rehabilitationProgress" value={formData.rehabilitationProgress} onChange={handleChange} className="mt-1" />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="cultureAndInfectionMarkers">Cultures and Infection Markers</Label>
          <Input id="cultureAndInfectionMarkers" name="cultureAndInfectionMarkers" value={formData.cultureAndInfectionMarkers} onChange={handleChange} className="mt-1" />
        </div>

        <div className="md:col-span-2 text-right">
          <Button type="submit" className="mt-4">Submit</Button>
          {isLoading && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
}
        </div>
    </form>
    </section>
  );
};

export default PatientMonitoringForm;