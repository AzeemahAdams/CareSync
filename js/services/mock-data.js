// js/services/mock-data.js
// Central synthetic data. Set CareSync.config.USE_MOCK = false for live backend.

window.CareSync = window.CareSync || {};

CareSync.mockData = (() => {

  const FACILITIES = [
    // Lagos
    { id:'f1',  name:'Lagos University Teaching Hospital', type:'Teaching Hospital',    address:'Idi-Araba, Surulere, Lagos',         location:'Lagos, Surulere',       lat:6.5000, lng:3.3500, phone:'+234 802 111 2222', email:'luth@example.com',       services:['General consultation','Emergency care','Surgery','Paediatrics','Radiology','Laboratory','ICU'],              accessibility:['Wheelchair ramp','Lifts','Accessible toilets'], hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-10', distance:2.4, matchScore:91 },
    { id:'f2',  name:'St. Nicholas Hospital',              type:'Private Hospital',      address:'57 Campbell St, Lagos Island',        location:'Lagos, Lagos Island',   lat:6.4538, lng:3.3909, phone:'+234 803 222 3333', email:'stnich@example.com',     services:['General consultation','Maternity','Dental care','Eye care','Laboratory'],                                       accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'Mon–Sat 7am–9pm',     status:'Verified',   updatedAt:'2026-09-28', distance:4.1, matchScore:78 },
    { id:'f3',  name:'Primary Health Centre – Ikeja',      type:'Primary Health Centre', address:'Oba Akran Ave, Ikeja, Lagos',         location:'Lagos, Ikeja',          lat:6.5958, lng:3.3371, phone:'+234 804 333 4444', email:'phcikeja@example.com',   services:['General consultation','Immunisation','Maternal health','Family planning'],                                   accessibility:['Wheelchair ramp'],                               hours:'Mon–Fri 8am–5pm',     status:'Pending',    updatedAt:'2026-08-15', distance:5.8, matchScore:65 },
    { id:'f4',  name:'Reddington Hospital',                type:'Private Hospital',      address:'12 Idowu Martins St, VI, Lagos',      location:'Lagos, Victoria Island',lat:6.4281, lng:3.4219, phone:'+234 805 444 5555', email:'reddington@example.com', services:['General consultation','Cardiology','Oncology','Surgery','ICU','Laboratory'],                               accessibility:['Wheelchair ramp','Lifts','Accessible toilets','Tactile paving'], hours:'24 hours', status:'Verified',   updatedAt:'2026-10-18', distance:6.2, matchScore:85 },
    { id:'f5',  name:'Gbagada General Hospital',           type:'General Hospital',      address:'Hospital Rd, Gbagada, Lagos',         location:'Lagos, Gbagada',        lat:6.5507, lng:3.3820, phone:'+234 806 555 6666', email:'gbagada@example.com',    services:['General consultation','Emergency care','Surgery','Paediatrics','Obstetrics'],                              accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-05', distance:7.1, matchScore:73 },
    { id:'f6',  name:'Island General Hospital',            type:'General Hospital',      address:'21 Marina Rd, Lagos Island',          location:'Lagos, Lagos Island',   lat:6.4530, lng:3.3960, phone:'+234 807 111 2222', email:'islandgen@example.com',  services:['General consultation','Emergency care','Pharmacy','Laboratory'],                                           accessibility:['Wheelchair ramp'],                               hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-12', distance:4.8, matchScore:70 },
    { id:'f7',  name:'Onikan Health Centre',               type:'Primary Health Centre', address:'Onikan, Lagos Island',                location:'Lagos, Onikan',         lat:6.4574, lng:3.3998, phone:'+234 808 222 3333', email:'onikan@example.com',     services:['General consultation','Immunisation','Family planning'],                                                   accessibility:[],                                                hours:'Mon–Fri 8am–4pm',     status:'Verified',   updatedAt:'2026-09-15', distance:5.0, matchScore:58 },
    { id:'f8',  name:'Lagos State University Teaching Hospital', type:'Teaching Hospital',address:'Ikeja GRA, Lagos',                  location:'Lagos, Ikeja',          lat:6.5960, lng:3.3494, phone:'+234 809 333 4444', email:'lasuth@example.com',    services:['General consultation','Emergency care','Surgery','Neurology','Oncology','ICU','Paediatrics'],              accessibility:['Wheelchair ramp','Lifts','Accessible toilets'],  hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-20', distance:6.0, matchScore:88 },
    { id:'f9',  name:'Marina Medical Centre',              type:'Clinic',                address:'42 Marina, Lagos Island',             location:'Lagos, Marina',         lat:6.4510, lng:3.3870, phone:'+234 810 444 5555', email:'marina@example.com',     services:['General consultation','Dental care','Eye care','Pharmacy'],                                                accessibility:[],                                                hours:'Mon–Sat 8am–8pm',     status:'Pending',    updatedAt:'2026-08-01', distance:5.5, matchScore:55 },
    { id:'f10', name:'Apapa General Hospital',             type:'General Hospital',      address:'Warehouse Rd, Apapa, Lagos',          location:'Lagos, Apapa',          lat:6.4470, lng:3.3590, phone:'+234 811 555 6666', email:'apapa@example.com',      services:['General consultation','Emergency care','Surgery','Pharmacy'],                                              accessibility:['Wheelchair ramp'],                               hours:'24 hours',            status:'Verified',   updatedAt:'2026-09-30', distance:7.8, matchScore:67 },
    // Abuja
    { id:'f11', name:'National Hospital Abuja',            type:'Teaching Hospital',    address:'Central Business District, Abuja',    location:'Abuja, CBD',            lat:9.0500, lng:7.5100, phone:'+234 812 666 7777', email:'nhab@example.com',       services:['General consultation','Emergency care','Surgery','Cardiology','Neurology','ICU','Laboratory'],             accessibility:['Wheelchair ramp','Lifts','Accessible toilets'],  hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-15', distance:3.1, matchScore:90 },
    { id:'f12', name:'Garki Hospital Abuja',               type:'General Hospital',      address:'Garki Area 1, Abuja',                 location:'Abuja, Garki',          lat:9.0400, lng:7.4900, phone:'+234 813 777 8888', email:'garki@example.com',      services:['General consultation','Maternity','Laboratory','Pharmacy'],                                                accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'Mon–Sat 7am–10pm',    status:'Verified',   updatedAt:'2026-10-02', distance:4.5, matchScore:72 },
    { id:'f13', name:'Asokoro District Hospital',          type:'General Hospital',      address:'Asokoro, Abuja',                      location:'Abuja, Asokoro',        lat:9.0580, lng:7.5350, phone:'+234 814 888 9999', email:'asokoro@example.com',    services:['General consultation','Emergency care','Paediatrics','Surgery'],                                           accessibility:['Wheelchair ramp'],                               hours:'24 hours',            status:'Verified',   updatedAt:'2026-09-20', distance:5.2, matchScore:69 },
    { id:'f14', name:'Maitama District Hospital',          type:'General Hospital',      address:'Maitama, Abuja',                      location:'Abuja, Maitama',        lat:9.0820, lng:7.4930, phone:'+234 815 999 0000', email:'maitama@example.com',    services:['General consultation','Dental care','Eye care','Pharmacy','Laboratory'],                                   accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'Mon–Fri 8am–6pm',     status:'Pending',    updatedAt:'2026-07-28', distance:6.8, matchScore:61 },
    // Abeokuta
    { id:'f15', name:'Abeokuta Central Clinic',            type:'Clinic',                address:'Oke-Lantoro, Abeokuta, Ogun',         location:'Abeokuta, Ogun',        lat:7.1609, lng:3.3488, phone:'+234 807 666 7777', email:'abclinic@example.com',   services:['General consultation','Pharmacy','Laboratory','Immunisation'],                                             accessibility:[],                                                hours:'Mon–Sat 8am–6pm',     status:'Unverified', updatedAt:'2026-07-01', distance:9.5, matchScore:51 },
    { id:'f16', name:'Federal Medical Centre Abeokuta',    type:'Teaching Hospital',    address:'Idi-Aba, Abeokuta, Ogun',             location:'Abeokuta, Ogun',        lat:7.1475, lng:3.3619, phone:'+234 816 000 1111', email:'fmcabeokuta@example.com', services:['General consultation','Surgery','Emergency care','Paediatrics','Obstetrics','Laboratory'],              accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-08', distance:3.2, matchScore:82 },
    // Ibadan
    { id:'f17', name:'University College Hospital Ibadan', type:'Teaching Hospital',    address:'Queen Elizabeth Rd, Ibadan, Oyo',     location:'Ibadan, Oyo',           lat:7.3943, lng:3.8985, phone:'+234 817 111 2222', email:'uch@example.com',        services:['General consultation','Emergency care','Surgery','Cardiology','Oncology','Radiology','ICU'],              accessibility:['Wheelchair ramp','Lifts','Accessible toilets'],  hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-17', distance:4.0, matchScore:93 },
    { id:'f18', name:'Adeoyo Maternity Hospital',          type:'General Hospital',      address:'Ring Rd, Ibadan, Oyo',                location:'Ibadan, Oyo',           lat:7.3789, lng:3.9095, phone:'+234 818 222 3333', email:'adeoyo@example.com',     services:['Maternal health','Family planning','Immunisation','Paediatrics'],                                          accessibility:['Wheelchair ramp'],                               hours:'Mon–Sat 7am–9pm',     status:'Verified',   updatedAt:'2026-09-25', distance:5.5, matchScore:74 },
    // Port Harcourt
    { id:'f19', name:'University of Port Harcourt Teaching Hospital', type:'Teaching Hospital', address:'East-West Rd, Port Harcourt, Rivers', location:'Port Harcourt, Rivers', lat:4.8242, lng:7.0500, phone:'+234 819 333 4444', email:'upth@example.com', services:['General consultation','Emergency care','Surgery','Neurology','Cardiology','ICU','Laboratory'],             accessibility:['Wheelchair ramp','Lifts','Accessible toilets'],  hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-14', distance:3.8, matchScore:89 },
    { id:'f20', name:'Braithwaite Memorial Specialist Hospital', type:'General Hospital', address:'Moscow Rd, Port Harcourt, Rivers',   location:'Port Harcourt, Rivers', lat:4.8156, lng:7.0498, phone:'+234 820 444 5555', email:'bmsh@example.com',       services:['General consultation','Emergency care','Surgery','Pharmacy'],                                              accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-01', distance:4.6, matchScore:76 },
    // Kano
    { id:'f21', name:'Aminu Kano Teaching Hospital',       type:'Teaching Hospital',    address:'Zaria Rd, Kano',                      location:'Kano, Kano',            lat:12.0022, lng:8.5920, phone:'+234 821 555 6666', email:'akth@example.com',       services:['General consultation','Emergency care','Surgery','Paediatrics','Obstetrics','ICU'],                       accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-09', distance:2.9, matchScore:87 },
    { id:'f22', name:'Murtala Muhammad Specialist Hospital', type:'General Hospital',   address:'Hospital Rd, Kano',                   location:'Kano, Kano',            lat:11.9850, lng:8.5254, phone:'+234 822 666 7777', email:'mmsh@example.com',       services:['General consultation','Emergency care','Surgery','Eye care'],                                              accessibility:['Wheelchair ramp'],                               hours:'24 hours',            status:'Verified',   updatedAt:'2026-09-18', distance:5.1, matchScore:71 },
    // Enugu
    { id:'f23', name:'University of Nigeria Teaching Hospital', type:'Teaching Hospital', address:'Enugu-Onitsha Expressway, Enugu',  location:'Enugu, Enugu',          lat:6.4405, lng:7.5244, phone:'+234 823 777 8888', email:'unth@example.com',        services:['General consultation','Emergency care','Surgery','Cardiology','Radiology','ICU'],                          accessibility:['Wheelchair ramp','Lifts','Accessible toilets'],  hours:'24 hours',            status:'Verified',   updatedAt:'2026-10-11', distance:3.3, matchScore:86 },
    { id:'f24', name:'Enugu State University Teaching Hospital', type:'Teaching Hospital', address:'GRA, Enugu',                      location:'Enugu, Enugu',          lat:6.4521, lng:7.5106, phone:'+234 824 888 9999', email:'esuth@example.com',       services:['General consultation','Emergency care','Maternity','Surgery','Paediatrics'],                               accessibility:['Wheelchair ramp','Accessible toilets'],          hours:'24 hours',            status:'Pending',    updatedAt:'2026-09-05', distance:4.7, matchScore:68 },
  ];

  const REFERRALS = [
    { id:'r1', refNumber:'REF-2026-1042', patientRef:'PAT-0081', from:'Lagos University Teaching Hospital', to:'St. Nicholas Hospital',     fromId:'f1', toId:'f2', service:'Dental care',  date:'2026-10-20', status:'Pending',     notes:'Referred for dental assessment following general check-up.' },
    { id:'r2', refNumber:'REF-2026-1039', patientRef:'PAT-0081', from:'Primary Health Centre – Ikeja',     to:'Lagos University Teaching Hospital', fromId:'f3', toId:'f1', service:'Radiology',  date:'2026-10-08', status:'Completed',   notes:'X-ray results returned. No further action required.' },
    { id:'r3', refNumber:'REF-2026-1035', patientRef:'PAT-0081', from:'Reddington Hospital',               to:'Gbagada General Hospital',   fromId:'f4', toId:'f5', service:'Paediatrics', date:'2026-09-30', status:'In progress', notes:'Follow-up paediatric consultation in progress.' },
    { id:'r4', refNumber:'REF-2026-1021', patientRef:'PAT-0081', from:'Gbagada General Hospital',          to:'Reddington Hospital',        fromId:'f5', toId:'f4', service:'Cardiology',  date:'2026-09-12', status:'Declined',    notes:'Patient did not attend appointment. Referral expired.' },
    { id:'r5', refNumber:'REF-2026-0998', patientRef:'PAT-0081', from:'Lagos University Teaching Hospital', to:'Reddington Hospital',      fromId:'f1', toId:'f4', service:'Oncology',    date:'2026-08-25', status:'Accepted',    notes:'Appointment scheduled for next available slot.' },
  ];

  const USERS = [
    { id:'u1', name:'Amara Okafor',        email:'patient@caresync.ng',  role:'patient',  status:'Active',   joined:'2026-09-01', phone:'+234 801 234 5678' },
    { id:'u2', name:'Lagos General',       email:'facility@caresync.ng', role:'facility', status:'Active',   joined:'2026-08-15', phone:'+234 802 345 6789' },
    { id:'u3', name:'Admin User',          email:'admin@caresync.ng',    role:'admin',    status:'Active',   joined:'2026-07-01', phone:'+234 803 456 7890' },
    { id:'u4', name:'Chidi Eze',           email:'c.eze@example.ng',     role:'patient',  status:'Active',   joined:'2026-09-22', phone:'+234 804 567 8901' },
    { id:'u5', name:'Ngozi Adeyemi',       email:'n.adeyemi@example.ng', role:'patient',  status:'Inactive', joined:'2026-08-03', phone:'+234 805 678 9012' },
    { id:'u6', name:'Reddington Hospital', email:'info@reddington.ng',   role:'facility', status:'Pending',  joined:'2026-10-01', phone:'+234 805 444 5555' },
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
      { type:'verification', text:'Reddington Hospital profile approved.',         time:'2 hours ago', dot:'success' },
      { type:'referral',     text:'New referral REF-2026-1042 created.',           time:'4 hours ago', dot:'' },
      { type:'user',         text:'New patient account: Chidi Eze.',               time:'Yesterday',   dot:'' },
      { type:'verification', text:'Abeokuta Central Clinic submitted for review.', time:'2 days ago',  dot:'warning' },
      { type:'referral',     text:'REF-2026-1039 marked completed.',               time:'3 days ago',  dot:'success' },
      { type:'user',         text:'Ngozi Adeyemi account deactivated.',            time:'4 days ago',  dot:'danger' },
    ]
  };

  const FACILITY_PROFILE = {
    id:'f2', name:'St. Nicholas Hospital', type:'Private Hospital',
    address:'57 Campbell St, Lagos Island', city:'Lagos', state:'Lagos',
    phone:'+234 803 222 3333', email:'stnich@example.com', website:'www.stnicholas.com',
    description:'St. Nicholas Hospital is a leading private hospital on Lagos Island, providing comprehensive healthcare services to individuals and families.',
    hours:'Mon–Sat 7am–9pm', emergencyHours:'24 hours for emergency',
    accessibility:['Wheelchair ramp','Accessible toilets'],
    services:[
      { id:'s1', name:'General consultation',  description:'Initial assessment and GP consultations',       available:true },
      { id:'s2', name:'Maternity & obstetrics', description:'Antenatal, delivery, and postnatal care',      available:true },
      { id:'s3', name:'Dental care',           description:'Routine and restorative dental services',       available:true },
      { id:'s4', name:'Eye care & ophthalmology', description:'Eye examinations and minor procedures',      available:true },
      { id:'s5', name:'Diagnostic laboratory', description:'Blood tests, urinalysis, and other diagnostics', available:true },
      { id:'s6', name:'Pharmacy',              description:'Dispensing of prescribed medications',          available:true },
    ],
    status:'Verified', completionPct:82,
  };

  return { FACILITIES, REFERRALS, USERS, ADMIN_STATS, FACILITY_PROFILE };
})();
