'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  Lock,
  MapPin,
  ShieldAlert,
  Sparkles,
  User as UserIcon,
  Check,
} from 'lucide-react';

import type { UserRole } from '@/lib/types';
import { PolarLogo } from '@/components/ui/PolarLogo';
import { useAuthStore } from '@/store/useAuthStore';

interface RoleOption {
  id: UserRole;
  icon: typeof FlaskConical;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
  hasLock?: boolean;
  statusBadge: string;
  badgeType: 'instant' | 'pending';
}

const ROLES: RoleOption[] = [
  {
    id: 'researcher',
    icon: FlaskConical,
    iconColor: '#0B5C8E',
    bgColor: '#e0f2f7',
    title: 'Researcher',
    description: 'Full polar datasets, satellite metrics, raw observations, expedition logs & publications',
    hasLock: true,
    statusBadge: 'Admin Verification Required',
    badgeType: 'pending',
  },
  {
    id: 'educator',
    icon: GraduationCap,
    iconColor: '#22A8C9',
    bgColor: '#e0f2f7',
    title: 'Educator',
    description: 'Curated educational summaries, classroom slides, expedition media & lesson kits',
    statusBadge: 'Instant Access',
    badgeType: 'instant',
  },
  {
    id: 'public',
    icon: Globe,
    iconColor: '#2E9E8F',
    bgColor: '#e0f2f7',
    title: 'Public Explorer',
    description: 'Public outreach, live polar weather stations, 3D interactive maps & polar stories',
    statusBadge: 'Instant Access',
    badgeType: 'instant',
  },
];

// Degree Suggestions
const DEGREE_SUGGESTIONS = [
  'Ph.D. in Polar Oceanography & Marine Geosciences',
  'Ph.D. in Cryospheric Science & Glaciology',
  'Ph.D. in Polar Atmospheric Physics & Meteorology',
  'Ph.D. in Climate Dynamics & Paleoclimatology',
  'Ph.D. in Polar Remote Sensing, Geodesy & GIS',
  'Ph.D. in Marine Biology & Polar Ecosystems',
  'Ph.D. in Space & Planetary Sciences',
  'Postdoctoral Fellow in Polar Studies',
  'Doctor of Science (D.Sc.) in Earth Sciences',
  'M.Tech / M.Sc. in Oceanic & Atmospheric Sciences',
  'M.S. in Marine Geology & Cryosphere',
  'B.Tech / B.E. in Polar Instrumentation & Engineering',
];

// Worldwide Living Locations
const WORLDWIDE_LOCATIONS = [
  'Goa, India (NCPOR)',
  'New Delhi, India',
  'Bangalore, Karnataka, India (IISc)',
  'Mumbai, Maharashtra, India',
  'Pune, Maharashtra, India (IITM)',
  'Dehradun, Uttarakhand, India (WII/IIRS)',
  'Kolkata, West Bengal, India',
  'Chennai, Tamil Nadu, India (NIOT)',
  'Hyderabad, Telangana, India (INCOIS)',
  'Tromsø, Norway (Norwegian Polar Institute)',
  'Longyearbyen, Svalbard, Norway',
  'Oslo, Norway',
  'Bergen, Norway (Bjerknes Centre)',
  'Boulder, Colorado, USA (NSIDC/NCAR)',
  'Fairbanks, Alaska, USA (UAF)',
  'Washington, D.C., USA (NASA/NOAA)',
  'San Diego, California, USA (Scripps)',
  'Woods Hole, Massachusetts, USA (WHOI)',
  'Cambridge, United Kingdom (British Antarctic Survey)',
  'Southampton, United Kingdom (NOCS)',
  'Edinburgh, Scotland, UK',
  'Bremerhaven, Germany (Alfred Wegener Institute - AWI)',
  'Potsdam, Germany (GFZ/PIK)',
  'Kiel, Germany (GEOMAR)',
  'Hamburg, Germany',
  'Hobart, Tasmania, Australia (Australian Antarctic Division)',
  'Melbourne, Victoria, Australia',
  'Sydney, NSW, Australia',
  'Canberra, ACT, Australia',
  'Christchurch, New Zealand (Antarctica New Zealand)',
  'Wellington, New Zealand',
  'Punta Arenas, Chile (INACH)',
  'Santiago, Chile',
  'Ushuaia, Tierra del Fuego, Argentina (CADIC)',
  'Buenos Aires, Argentina (Instituto Antártico Argentino)',
  'Cape Town, South Africa (SANAP)',
  'Pretoria, South Africa',
  'Tokyo, Japan (National Institute of Polar Research - NIPR)',
  'Sapporo, Hokkaido, Japan (ILTS)',
  'Paris, France (IPEV/CNRS)',
  'Grenoble, France (IGE)',
  'Brest, France (Ifremer)',
  'St. Petersburg, Russia (AARI)',
  'Moscow, Russia',
  'Shanghai, China (Polar Research Institute of China - PRIC)',
  'Beijing, China',
  'Stockholm, Sweden (Swedish Polar Research Secretariat)',
  'Gothenburg, Sweden',
  'Copenhagen, Denmark (GEUS)',
  'Nuuk, Greenland',
  'Trieste, Italy (OGS)',
  'Rome, Italy (CNR)',
  'Zurich, Switzerland (ETH/WSL)',
  'Helsinki, Finland (FMI)',
  'Reykjavik, Iceland',
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const addPendingResearcher = useAuthStore((state) => state.addPendingResearcher);
  const pendingResearchers = useAuthStore((state) => state.pendingResearchers);

  // Step state: 'choose-role' or 'researcher-form'
  const [step, setStep] = useState<'choose-role' | 'researcher-form'>('choose-role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('researcher');

  // Researcher verification fields - NO PRETYPED/AUTOFILL VALUES
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<string>('');
  const [doctorateDegree, setDoctorateDegree] = useState('');
  const [workedIn, setWorkedIn] = useState('');
  const [workedAs, setWorkedAs] = useState('');
  const [location, setLocation] = useState('');
  const [fieldOfResearch, setFieldOfResearch] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Birth Date selection & automatic age calculation
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    setBirthDate(dobValue);

    if (dobValue) {
      const birth = new Date(dobValue);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }

      if (calculatedAge >= 10 && calculatedAge <= 110) {
        setAge(calculatedAge.toString());
      } else {
        setAge('');
      }
    } else {
      setAge('');
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);

    // If educator or public, grant instant access without extra form
    if (role !== 'researcher') {
      const activeUser = user || {
        id: `usr-${Date.now()}`,
        email: '',
        full_name: role === 'educator' ? 'Educator' : 'Explorer',
        created_at: new Date().toISOString(),
      };

      setUser({
        ...activeUser,
        role: role,
        is_approved: true,
      });

      router.push('/dashboard');
      return;
    }

    // If researcher, proceed to the General Info verification form
    setStep('researcher-form');
  };

  const handleResearcherFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('Please type your full name');
      return;
    }
    if (!birthDate && !age) {
      setFormError('Please select your Date of Birth or specify your age');
      return;
    }
    if (!doctorateDegree.trim()) {
      setFormError('Please select or type your Doctorate / Academic Degree');
      return;
    }
    if (!workedIn.trim()) {
      setFormError('Please type the institute / organization you worked in');
      return;
    }
    if (!workedAs.trim()) {
      setFormError('Please type your designation or role (worked as)');
      return;
    }
    if (!location.trim()) {
      setFormError('Please select or type where you are living (city & country)');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const userEmail = user?.email || `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@institute.edu`;
    const isAlreadyApproved = pendingResearchers.some(
      (r) => r.email.toLowerCase() === userEmail.toLowerCase() && r.status === 'approved'
    );

    setTimeout(() => {
      const updatedUser = {
        ...(user || {
          id: `usr-${Date.now()}`,
          email: userEmail,
          created_at: new Date().toISOString(),
        }),
        full_name: fullName.trim(),
        role: 'researcher' as const,
        age: age ? Number(age) : 30,
        doctorate_degree: doctorateDegree.trim(),
        worked_in: workedIn.trim(),
        worked_as: workedAs.trim(),
        location: location.trim(),
        field_of_research: fieldOfResearch.trim() || 'Polar Science & Climatology',
        organization: workedIn.trim(),
        country: location.trim(),
        is_approved: isAlreadyApproved,
      };

      setUser(updatedUser);

      addPendingResearcher({
        name: fullName.trim(),
        email: userEmail,
        age: age || '30',
        doctorateDegree: doctorateDegree.trim(),
        workedIn: workedIn.trim(),
        workedAs: workedAs.trim(),
        location: location.trim(),
        fieldOfResearch: fieldOfResearch.trim() || 'Polar Science & Cryosphere Dynamics',
        organization: workedIn.trim(),
        role: workedAs.trim(),
      });

      setIsSubmitting(false);
      router.push('/dashboard');
    }, 450);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      <AnimatePresence mode="wait">
        {step === 'choose-role' ? (
          /* ================= STEP 1: ROLE SELECTION ================= */
          <motion.div
            key="choose-role"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-[620px] rounded-[28px] bg-white p-8 md:p-10 shadow-2xl border border-gray-200/90 relative overflow-hidden"
          >
            {/* Backdrop Watermark inside card */}
            <div className="absolute right-0 bottom-0 w-80 h-80 opacity-[0.04] pointer-events-none select-none">
              <img src="/logo.png" alt="" className="w-full h-full object-contain" />
            </div>

            {/* Top Emblem */}
            <div className="mb-5 flex justify-center">
              <div className="w-18 h-18 rounded-2xl border border-gray-200 bg-white p-1.5 flex items-center justify-center shadow-md">
                <PolarLogo size={62} />
              </div>
            </div>

            <div className="mb-7 text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0b1721]">
                Select Your Access Role
              </h1>
              <p className="mt-1.5 text-sm text-[#5a6f82]">
                Choose how you will explore and collaborate in the Polar Science Portal
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              {ROLES.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectRole(item.id)}
                    className={`w-full flex items-center justify-between p-4.5 md:p-5 rounded-2xl border transition-all text-left group ${
                      isSelected
                        ? 'border-[#008b8b] bg-[#f2fafb] shadow-md ring-2 ring-[#008b8b]/20'
                        : 'border-[#e2e8f0] bg-white hover:border-[#008b8b]/60 hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-13 h-13 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <Icon className="w-6 h-6" style={{ color: item.iconColor }} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-bold text-base text-[#0b1721]">
                          <span>{item.title}</span>
                          {item.hasLock && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                              <Lock className="w-3 h-3 text-amber-700" />
                              Verification Required
                            </span>
                          )}
                        </div>
                        <div className="text-xs md:text-sm text-[#5a6f82] truncate mt-1">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    <div className="ml-3 flex-shrink-0 flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          item.badgeType === 'pending'
                            ? 'bg-amber-500/15 text-amber-800 border-amber-300'
                            : 'bg-emerald-500/15 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {item.statusBadge}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#008b8b] transition-transform group-hover:translate-x-1 hidden sm:block" />
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-7 text-center text-xs text-[#8aa0b3] relative z-10">
              * Researchers will provide general verification info submitted directly to the NCPOR Administrator.
            </p>
          </motion.div>
        ) : (
          /* ================= STEP 2: RESEARCHER GENERAL INFO & VERIFICATION FORM ================= */
          <motion.div
            key="researcher-form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28 }}
            className="w-full max-w-[760px] rounded-[30px] bg-white p-7 sm:p-9 md:p-10 shadow-2xl border border-gray-200 relative overflow-hidden text-[#0b1721]"
          >
            {/* Watermark Illustration Behind Form Card */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] select-none overflow-hidden">
              <img
                src="/logo.png"
                alt="Polar Portal Logo Backdrop"
                className="w-[750px] h-[750px] object-contain scale-110"
              />
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep('choose-role')}
              className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#5a6f82] hover:text-[#0b1721] transition-colors mb-5 cursor-pointer relative z-20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to role selection</span>
            </button>

            {/* Form Header */}
            <div className="flex items-start gap-4 pb-5 border-b border-gray-200 relative z-10">
              <div className="w-15 h-15 rounded-2xl border border-teal-200 bg-teal-50/80 p-1 flex items-center justify-center shadow-sm flex-shrink-0">
                <PolarLogo size={52} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#008b8b]">
                    Researcher Registration
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Step 2 of 2
                  </span>
                </div>
                <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight text-[#0b1721] mt-1">
                  General Info & Academic Credentials
                </h2>
                <p className="text-xs md:text-sm text-[#5a6f82] mt-0.5">
                  Please type your academic qualifications and institute details for administrator review.
                </p>
              </div>
            </div>

            {/* Form Error Notice */}
            {formError && (
              <div className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs md:text-sm font-semibold text-red-800 flex items-center gap-2.5 relative z-10">
                <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Datalists for Rich Dropdown & Autocomplete Suggestions */}
            <datalist id="degrees-list">
              {DEGREE_SUGGESTIONS.map((deg, i) => (
                <option key={i} value={deg} />
              ))}
            </datalist>

            <datalist id="locations-list">
              {WORLDWIDE_LOCATIONS.map((loc, i) => (
                <option key={i} value={loc} />
              ))}
            </datalist>

            {/* Detailed Form */}
            <form onSubmit={handleResearcherFormSubmit} className="mt-6 space-y-5 relative z-10">
              {/* Row 1: Full Name & Date of Birth / Age */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Full Name */}
                <div className="md:col-span-7">
                  <label
                    htmlFor="res-name"
                    className="mb-1.5 block text-xs md:text-sm font-bold text-[#0b1721]"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
                    <input
                      id="res-name"
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="Type your full name (e.g. Dr. Jane Doe)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-11 pr-4 text-sm md:text-base font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
                    />
                  </div>
                </div>

                {/* Birth Date with Calendar Symbol & Auto-Calculated Age */}
                <div className="md:col-span-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="res-dob"
                      className="block text-xs md:text-sm font-bold text-[#0b1721]"
                    >
                      Date of Birth <span className="text-rose-500">*</span>
                    </label>
                    {age && (
                      <span className="text-xs font-extrabold text-[#008b8b] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Age: {age} yrs
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3] pointer-events-none" />
                    <input
                      id="res-dob"
                      type="date"
                      required
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-11 pr-4 text-sm md:text-base font-medium text-[#0b1721] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Doctorate / Academic Degree with Dropdown Suggestions & Custom Typing */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="res-degree"
                    className="block text-xs md:text-sm font-bold text-[#0b1721]"
                  >
                    Doctorate / Academic Degree <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
                    Choose from list or type custom degree
                  </span>
                </div>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
                  <input
                    id="res-degree"
                    type="text"
                    list="degrees-list"
                    required
                    autoComplete="off"
                    placeholder="Choose or type your degree (e.g. Ph.D. in Polar Oceanography)"
                    value={doctorateDegree}
                    onChange={(e) => setDoctorateDegree(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-11 pr-4 text-sm md:text-base font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
                  />
                </div>

                {/* Degree Quick Tags */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {['Ph.D. in Glaciology', 'Ph.D. in Oceanography', 'Ph.D. in Atmospheric Physics', 'Postdoc Fellow'].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setDoctorateDegree(deg)}
                      className="text-[11px] font-semibold bg-gray-100 hover:bg-teal-50 hover:text-[#008b8b] hover:border-teal-200 text-[#475569] px-2.5 py-1 rounded-lg border border-gray-200 transition"
                    >
                      + {deg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Worked In & Worked As */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="res-worked-in"
                    className="mb-1.5 block text-xs md:text-sm font-bold text-[#0b1721]"
                  >
                    Worked In (Institute / Organization) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
                    <input
                      id="res-worked-in"
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="Type institute (e.g. NCPOR / IISc / NIO / University)"
                      value={workedIn}
                      onChange={(e) => setWorkedIn(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-11 pr-4 text-sm md:text-base font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="res-worked-as"
                    className="mb-1.5 block text-xs md:text-sm font-bold text-[#0b1721]"
                  >
                    Worked As (Designation / Position) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
                    <input
                      id="res-worked-as"
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="Type designation (e.g. Senior Glaciologist / Scientist)"
                      value={workedAs}
                      onChange={(e) => setWorkedAs(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-11 pr-4 text-sm md:text-base font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Where he is living (City, State / Country) with Worldwide Suggestions & Free Typing */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="res-location"
                    className="block text-xs md:text-sm font-bold text-[#0b1721]"
                  >
                    Living Location (City, State / Country) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium hidden sm:inline">
                    Select from worldwide hubs or type freely
                  </span>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
                  <input
                    id="res-location"
                    type="text"
                    list="locations-list"
                    required
                    autoComplete="off"
                    placeholder="Choose or type your location (e.g. Goa, India or Tromsø, Norway or Boulder CO, USA)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-11 pr-4 text-sm md:text-base font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
                  />
                </div>
              </div>

              {/* Row 5: Field of Specialization */}
              <div>
                <label
                  htmlFor="res-field"
                  className="mb-1.5 block text-xs md:text-sm font-bold text-[#0b1721]"
                >
                  Field of Specialization / Research Focus{' '}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Compass className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa0b3]" />
                  <input
                    id="res-field"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Cryosphere Remote Sensing, Antarctic Sea Ice Modeling, Paleoclimate"
                    value={fieldOfResearch}
                    onChange={(e) => setFieldOfResearch(e.target.value)}
                    className="w-full h-12 rounded-xl border border-gray-300 bg-[#f8fafc] pl-11 pr-4 text-sm md:text-base font-medium text-[#0b1721] placeholder-[#9aa5b1] outline-none transition focus:border-[#008b8b] focus:bg-white focus:ring-2 focus:ring-[#008b8b]/20"
                  />
                </div>
              </div>

              {/* Info Note Banner */}
              <div className="p-4 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe] text-xs md:text-sm text-[#1e40af] flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#2563eb] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Upon submission, your application and credentials will be sent to the administrator. You will be able to track your verification status in real time.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-15 px-12 min-w-[300px] sm:min-w-[340px] rounded-2xl bg-[#0b1721] hover:bg-[#162a3c] text-white text-sm md:text-base font-bold flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Application to Admin...</span>
                  ) : (
                    <>
                      <span>Submit Application to Admin</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
