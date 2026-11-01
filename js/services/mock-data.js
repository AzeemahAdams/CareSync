// js/services/mock-data.js
// Central synthetic data store used when USE_MOCK = true.
// Replace individual collections with API responses when backend is ready.

window.CareSync = window.CareSync || {};

CareSync.mockData = (() => {

  const FACILITIES = [
    { id:'f1', name:'Lagos University Teaching Hospital', type:'Teaching Hospital', address:'Idi-Araba, Surulere, Lagos', location:'Lagos, Surulere', lat:6.5000, lng:3.3500, phone:'+234 802 111 2222', email:'luth@example.com', services:['General consultation','Emergency care','Surgery','Paediatrics','Radiology','Laboratory'], accessibility:['Wheelchair ramp','Lifts','Accessible toilets'], hours:'24 hours', status:'Verified', updatedAt:'2026-10-10', distance:2.4, matchScore:91 },
    { id:'f2', name:'St. Nicholas Hospital',             type:'Private Hospital',   address:'57 Campbell St, Lagos Island', location:'Lagos, Lagos Island', lat:6.4500, lng:3.4000, phone:'+234 803 222 3333', email:'stnich@example.com', services:['General consultation','Maternity','Dental care','Eye care','Laboratory'], accessibility:['Wheelchair ramp','Accessible toilets'], hours:'Mon–Sat 7am–9pm', status:'Verified', updatedAt:'2026-09-28', distance:4.1, matchScore:78 },
    { id:'f3', name:'Primary Health Centre – Ikeja',     type:'Primary Health Centre', address:'Oba Akran Ave, Ikeja, Lagos', location:'Lagos, Ikeja', lat:6.6000, lng:3.3000, phone:'+234 804 333 4444', email:'phcikeja@example.com', services:['General consultation','Immunisation','Maternal health','Family planning'], accessibility:['Wheelchair ramp'], hours:'Mon–Fri 8am–5pm', status:'Pending', updatedAt:'2026-08-15', distance:5.8, matchScore:65 },
    { id:'f4', name:'Reddington Hospital',               type:'Private Hospital',   address:'12 Idowu Martins St, VI, Lagos', location:'Lagos, Victoria Island', lat:6.4281, lng:3.4219, phone:'+234 805 444 5555', email:'reddington@example.com', services:['General consultation','Cardiology','Oncology','Surgery','ICU','Laboratory'], accessibility:['Wheelchair ramp','Lifts','Accessible toilets','Tactile paving'], hours:'24 hours', status:'Verified', updatedAt:'2026-10-18', distance:6.2, matchScore:85 },
    { id:'f5', name:'Gbagada General Hospital',          type:'General Hospital',   address:'Hospital Rd, Gbagada, Lagos', location:'Lagos, Gbagada', lat:6.5507, lng:3.3820, phone:'+234 806 555 6666', email:'gbagada@example.com', services:['General consultation','Emergency care','Surgery','Paediatrics','Obstetrics'], accessibility:['Wheelchair ramp','Accessible toilets'], hours:'24 hours', status:'Verified', updatedAt:'2026-10-05', distance:7.1, matchScore:73 },
    { id:'f6', name:'Abeokuta Central Clinic',           type:'Clinic',            address:'Oke-Lantoro, Abeokuta, Ogun', location:'Abeokuta, Ogun', lat:7.1609, lng:3.3488, phone:'+234 807 666 7777', email:'abclinic@example.com', services:['General consultation','Pharmacy','Laboratory','Immunisation'], accessibility:[], hours:'Mon–Sat 8am–6pm', status:'Unverified', updatedAt:'2026-07-01', distance:9.5, matchScore:51 },
  ];

  const REFERRALS = [
    { id:'r1', refNumber:'REF-2026-1042', patientRef:'PAT-0081', from:'Lagos University Teaching Hospital', to:'St. Nicholas Hospital', fromId:'f1', toId:'f2', service:'Dental care', date:'2026-10-20', status:'Pending',     notes:'Referred for dental assessment following general check-up.' },
    { id:'r2', refNumber:'REF-2026-1039', patientRef:'PAT-0081', from:'Primary Health Centre – Ikeja', to:'Lagos University Teaching Hospital', fromId:'f3', toId:'f1', service:'Radiology', date:'2026-10-08', status:'Completed',   notes:'X-ray results returned. No further action required.' },
    { id:'r3', refNumber:'REF-2026-1035', patientRef:'PAT-0081', from:'Reddington Hospital', to:'Gbagada General Hospital', fromId:'f4', toId:'f5', service:'Paediatrics', date:'2026-09-30', status:'In progress', notes:'Follow-up paediatric consultation in progress.' },
    { id:'r4', refNumber:'REF-2026-1021', patientRef:'PAT-0081', from:'Gbagada General Hospital', to:'Reddington Hospital', fromId:'f5', toId:'f4', service:'Cardiology', date:'2026-09-12', status:'Declined',    notes:'Patient did not attend appointment. Referral expired.' },
    { id:'r5', refNumber:'REF-2026-0998', patientRef:'PAT-0081', from:'Lagos University Teaching Hospital', to:'Reddington Hospital', fromId:'f1', toId:'f4', service:'Oncology', date:'2026-08-25', status:'Accepted',    notes:'Appointment scheduled for next available slot.' },
  ];

  const USERS = [
    { id:'u1', name:'Amara Okafor',        email:'patient@CareSync.ng',  role:'patient',  status:'Active',   joined:'2026-09-01', phone:'+234 801 234 5678' },
    { id:'u2', name:'Lagos General',       email:'facility@CareSync.ng', role:'facility', status:'Active',   joined:'2026-08-15', phone:'+234 802 345 6789' },
    { id:'u3', name:'Admin User',          email:'admin@CareSync.ng',    role:'admin',    status:'Active',   joined:'2026-07-01', phone:'+234 803 456 7890' },
    { id:'u4', name:'Chidi Eze',           email:'c.eze@example.ng',      role:'patient',  status:'Active',   joined:'2026-09-22', phone:'+234 804 567 8901' },
    { id:'u5', name:'Ngozi Adeyemi',       email:'n.adeyemi@example.ng',  role:'patient',  status:'Inactive', joined:'2026-08-03', phone:'+234 805 678 9012' },
    { id:'u6', name:'Reddington Hospital', email:'info@reddington.ng',    role:'facility', status:'Pending',  joined:'2026-10-01', phone:'+234 805 444 5555' },
  ];

  const ADMIN_STATS = {
    totalUsers: 1284,
    totalFacilities: 247,
    verifiedFacilities: 189,
    pendingVerification: 23,
    totalReferrals: 3841,
    completedReferrals: 2974,
    activeReferrals: 312,
    recentActivity: [
      { type:'verification', text:'Reddington Hospital profile approved.',         time:'2 hours ago',   dot:'success' },
      { type:'referral',     text:'New referral REF-2026-1042 created.',           time:'4 hours ago',   dot:'' },
      { type:'user',         text:'New patient account: Chidi Eze.',               time:'Yesterday',     dot:'' },
      { type:'verification', text:'Abeokuta Central Clinic submitted for review.', time:'2 days ago',    dot:'warning' },
      { type:'referral',     text:'REF-2026-1039 marked completed.',               time:'3 days ago',    dot:'success' },
      { type:'user',         text:'Ngozi Adeyemi account deactivated.',            time:'4 days ago',    dot:'danger'  },
    ]
  };

  const FACILITY_PROFILE = {
    id: 'f2',
    name: 'St. Nicholas Hospital',
    type: 'Private Hospital',
    address: '57 Campbell St, Lagos Island',
    city: 'Lagos',
    state: 'Lagos',
    phone: '+234 803 222 3333',
    email: 'stnich@example.com',
    website: 'www.stnicholas.com',
    description: 'St. Nicholas Hospital is a leading private hospital on Lagos Island, providing comprehensive healthcare services to individuals and families.',
    hours: 'Mon–Sat 7am–9pm',
    emergencyHours: '24 hours for emergency',
    accessibility: ['Wheelchair ramp', 'Accessible toilets'],
    services: [
      { id:'s1', name:'General consultation', description:'Initial assessment and GP consultations', available: true },
      { id:'s2', name:'Maternity & obstetrics', description:'Antenatal, delivery, and postnatal care', available: true },
      { id:'s3', name:'Dental care', description:'Routine and restorative dental services', available: true },
      { id:'s4', name:'Eye care & ophthalmology', description:'Eye examinations and minor procedures', available: true },
      { id:'s5', name:'Diagnostic laboratory', description:'Blood tests, urinalysis, and other diagnostics', available: true },
      { id:'s6', name:'Pharmacy', description:'Dispensing of prescribed medications', available: true },
    ],
    status: 'Verified',
    completionPct: 82,
  };

  return { FACILITIES, REFERRALS, USERS, ADMIN_STATS, FACILITY_PROFILE };
})();
