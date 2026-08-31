'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Edit3,
  ExternalLink,
  GraduationCap,
  Lock,
  LogOut,
  Mail,
  MapPin,
  RefreshCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  X,
} from 'lucide-react';

import { PolarLogo } from '@/components/ui/PolarLogo';
import { useAuthStore } from '@/store/useAuthStore';

// Degree suggestions for edit mode
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

export function PendingApprovalScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const theme = useAuthStore((state) => state.theme);
  const checkApprovalStatus = useAuthStore((state) => state.checkApprovalStatus);
  const addPendingResearcher = useAuthStore((state) => state.addPendingResearcher);
  const pendingResearchers = useAuthStore((state) => state.pendingResearchers);

  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState<string | null>(null);

  // Edit form inputs
  const [editFullName, setEditFullName] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editDoctorateDegree, setEditDoctorateDegree] = useState('');
  const [editWorkedIn, setEditWorkedIn] = useState('');
  const [editWorkedAs, setEditWorkedAs] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editFieldOfResearch, setEditFieldOfResearch] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isDark = theme !== 'light';

  // Ensure researcher request is registered in admin queue on mount if not already there
  React.useEffect(() => {
    if (user?.email && user?.role === 'researcher' && !user?.is_approved) {
      const exists = pendingResearchers.some(
        (r) => r.email.toLowerCase() === user.email.toLowerCase()
      );
      if (!exists) {
        addPendingResearcher({
          name: user.full_name || 'Researcher',
          email: user.email,
          age: user.age,
          doctorateDegree: user.doctorate_degree,
          workedIn: user.worked_in || user.organization || 'Polar Science Researcher',
          workedAs: user.worked_as || 'Researcher',
          location: user.location || user.country || 'India',
          fieldOfResearch: user.field_of_research,
          organization: user.organization || user.worked_in || 'Polar Science Researcher',
          role: user.worked_as || 'Researcher',
        });
      }
    }
  }, [user, pendingResearchers, addPendingResearcher]);

  const handleOpenEdit = () => {
    setEditFullName(user?.full_name || '');
    setEditAge(user?.age ? user.age.toString() : '');
    setEditBirthDate('');
    setEditDoctorateDegree(user?.doctorate_degree || '');
    setEditWorkedIn(user?.worked_in || user?.organization || '');
    setEditWorkedAs(user?.worked_as || '');
    setEditLocation(user?.location || user?.country || '');
    setEditFieldOfResearch(user?.field_of_research || '');
    setEditError(null);
    setEditSuccessMessage(null);
    setIsEditing(true);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    setEditBirthDate(dobValue);

    if (dobValue) {
      const birth = new Date(dobValue);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 10 && calculatedAge <= 110) {
        setEditAge(calculatedAge.toString());
      }
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFullName.trim()) {
      setEditError('Please enter your full name');
      return;
    }
    if (!editDoctorateDegree.trim()) {
      setEditError('Please enter your doctorate / academic degree');
      return;
    }
    if (!editWorkedIn.trim()) {
      setEditError('Please enter the organization / institute you worked in');
      return;
    }
    if (!editWorkedAs.trim()) {
      setEditError('Please enter your designation / role');
      return;
    }
    if (!editLocation.trim()) {
      setEditError('Please enter your living location');
      return;
    }

    setIsSaving(true);
    setEditError(null);

    setTimeout(() => {
      const updatedUser = {
        ...(user || {
          id: `usr-${Date.now()}`,
          email: 'researcher@ncpor.res.in',
          created_at: new Date().toISOString(),
        }),
        full_name: editFullName.trim(),
        role: 'researcher' as const,
        age: editAge ? editAge.trim() : (user?.age || '30'),
        doctorate_degree: editDoctorateDegree.trim(),
        worked_in: editWorkedIn.trim(),
        worked_as: editWorkedAs.trim(),
        location: editLocation.trim(),
        field_of_research: editFieldOfResearch.trim(),
        organization: editWorkedIn.trim(),
        country: editLocation.trim(),
        is_approved: false,
      };

      setUser(updatedUser);

      // Re-register in pending researchers queue
      addPendingResearcher({
        name: editFullName.trim(),
        email: user?.email || 'researcher@ncpor.res.in',
        age: editAge ? editAge.trim() : (user?.age || '30'),
        doctorateDegree: editDoctorateDegree.trim(),
        workedIn: editWorkedIn.trim(),
        workedAs: editWorkedAs.trim(),
        location: editLocation.trim(),
        fieldOfResearch: editFieldOfResearch.trim() || 'Polar Science & Climate Dynamics',
        organization: editWorkedIn.trim(),
        role: editWorkedAs.trim(),
      });

      setIsSaving(false);
      setIsEditing(false);
      setEditSuccessMessage('Your credentials have been updated and re-submitted to the administrator for verification.');
    }, 400);
  };

  const handleCheckStatus = () => {
    setChecking(true);
    setStatusMessage(null);

    setTimeout(() => {
      setChecking(false);
      const approved = checkApprovalStatus();
      if (approved) {
        setStatusMessage('Your application has been approved! Redirecting into dashboard...');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setStatusMessage('Your application is currently under review by the NCPOR Administrator.');
      }
    }, 600);
  };

  const handleSignOut = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.replace('/login');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`w-full max-w-3xl rounded-3xl p-7 md:p-9 shadow-2xl border ${
          isDark
            ? 'bg-[#0b1b2b] border-white/10 text-white'
            : 'bg-white border-[#e5e7eb] text-[#0b1721]'
        }`}
      >
        {/* Top Header & Emblem */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-transparent flex-shrink-0">
              <PolarLogo size={56} className="rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-[#008b8b]">
                  NCPOR Research Portal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Pending Verification
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-0.5">
                Researcher Access Request
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition self-start sm:self-auto cursor-pointer ${
              isDark
                ? 'border-white/10 hover:bg-white/5 text-gray-300'
                : 'border-gray-200 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Status Callout Banner */}
        <div className="mt-6 p-4.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3.5">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm space-y-1">
            <p className="font-bold text-amber-300">
              Application Under Review
            </p>
            <p className="text-amber-200/90 leading-relaxed text-xs">
              Your account has been registered with the <strong>Researcher</strong> role. In accordance with NCPOR polar data governance, all researcher accounts require manual administrator verification before gaining access to the dashboard.
            </p>
          </div>
        </div>

        {/* Edit Success Message */}
        {editSuccessMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{editSuccessMessage}</span>
          </div>
        )}

        {/* Applicant Details Card */}
        <div
          className={`mt-6 p-5 sm:p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#07131d] border-white/5' : 'bg-[#f8fafc] border-[#e5e7eb]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8aa0b3] uppercase tracking-wider">
                Applicant Submitted Information
              </span>
              <span className="text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Researcher Credentials
              </span>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                type="button"
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#008b8b]/15 hover:bg-[#008b8b]/30 text-[#008b8b] dark:text-teal-300 border border-[#008b8b]/30 text-xs font-bold transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              /* VIEW MODE */
              <motion.div
                key="view-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs md:text-sm"
              >
                <div>
                  <span className="text-[#8aa0b3] block text-[11px]">Full Name</span>
                  <span className="font-bold">{user?.full_name || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[#8aa0b3] block text-[11px]">Age</span>
                  <span className="font-bold">{user?.age ? `${user.age} yrs` : 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-[#8aa0b3] block text-[11px]">Doctorate / Degree</span>
                  <span className="font-bold text-[#008b8b] dark:text-teal-300">
                    {user?.doctorate_degree || 'Doctorate Degree'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8aa0b3] block text-[11px]">Worked In (Institute)</span>
                  <span className="font-bold">{user?.worked_in || user?.organization || 'Institute not specified'}</span>
                </div>
                <div>
                  <span className="text-[#8aa0b3] block text-[11px]">Worked As (Designation)</span>
                  <span className="font-bold">{user?.worked_as || 'Researcher'}</span>
                </div>
                <div>
                  <span className="text-[#8aa0b3] block text-[11px]">Living In (Location)</span>
                  <span className="font-bold">{user?.location || user?.country || 'India'}</span>
                </div>
                {user?.field_of_research && (
                  <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-white/5">
                    <span className="text-[#8aa0b3] block text-[11px]">Specialization</span>
                    <span className="font-medium text-teal-300">{user.field_of_research}</span>
                  </div>
                )}
              </motion.div>
            ) : (
              /* EDIT MODE */
              <motion.form
                key="edit-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSaveEdit}
                className="space-y-4 pt-2 border-t border-white/10 text-xs md:text-sm"
              >
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update your researcher credentials below:</span>
                </div>

                {editError && (
                  <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                {/* Datalists */}
                <datalist id="edit-degrees-list">
                  {DEGREE_SUGGESTIONS.map((deg, i) => (
                    <option key={i} value={deg} />
                  ))}
                </datalist>
                <datalist id="edit-locations-list">
                  {WORLDWIDE_LOCATIONS.map((loc, i) => (
                    <option key={i} value={loc} />
                  ))}
                </datalist>

                {/* Row 1: Full Name & DOB/Age */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-bold text-[#8aa0b3] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        placeholder="Dr. Jane Doe"
                        className={`w-full h-10.5 rounded-xl border pl-9 pr-3 text-xs md:text-sm outline-none transition focus:border-[#008b8b] ${
                          isDark
                            ? 'bg-[#0b1b2b] border-white/15 text-white'
                            : 'bg-white border-gray-300 text-[#0b1721]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#8aa0b3]">
                        Date of Birth / Age *
                      </label>
                      {editAge && (
                        <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">
                          {editAge} yrs
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        value={editBirthDate}
                        onChange={handleBirthDateChange}
                        className={`w-full h-10.5 rounded-xl border pl-9 pr-3 text-xs md:text-sm outline-none transition focus:border-[#008b8b] cursor-pointer ${
                          isDark
                            ? 'bg-[#0b1b2b] border-white/15 text-white'
                            : 'bg-white border-gray-300 text-[#0b1721]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Doctorate Degree */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8aa0b3] mb-1">
                    Doctorate / Academic Degree *
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      list="edit-degrees-list"
                      required
                      value={editDoctorateDegree}
                      onChange={(e) => setEditDoctorateDegree(e.target.value)}
                      placeholder="e.g. Ph.D. in Polar Oceanography"
                      className={`w-full h-10.5 rounded-xl border pl-9 pr-3 text-xs md:text-sm outline-none transition focus:border-[#008b8b] ${
                        isDark
                          ? 'bg-[#0b1b2b] border-white/15 text-white'
                          : 'bg-white border-gray-300 text-[#0b1721]'
                      }`}
                    />
                  </div>
                </div>

                {/* Row 3: Worked In & Worked As */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8aa0b3] mb-1">
                      Worked In (Institute / Organization) *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={editWorkedIn}
                        onChange={(e) => setEditWorkedIn(e.target.value)}
                        placeholder="NCPOR / IISc / NIO / University"
                        className={`w-full h-10.5 rounded-xl border pl-9 pr-3 text-xs md:text-sm outline-none transition focus:border-[#008b8b] ${
                          isDark
                            ? 'bg-[#0b1b2b] border-white/15 text-white'
                            : 'bg-white border-gray-300 text-[#0b1721]'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8aa0b3] mb-1">
                      Worked As (Designation / Position) *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={editWorkedAs}
                        onChange={(e) => setEditWorkedAs(e.target.value)}
                        placeholder="Senior Glaciologist / Scientist"
                        className={`w-full h-10.5 rounded-xl border pl-9 pr-3 text-xs md:text-sm outline-none transition focus:border-[#008b8b] ${
                          isDark
                            ? 'bg-[#0b1b2b] border-white/15 text-white'
                            : 'bg-white border-gray-300 text-[#0b1721]'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Location */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8aa0b3] mb-1">
                    Living Location (City, State / Country) *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      list="edit-locations-list"
                      required
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="Goa, India or Tromsø, Norway"
                      className={`w-full h-10.5 rounded-xl border pl-9 pr-3 text-xs md:text-sm outline-none transition focus:border-[#008b8b] ${
                        isDark
                          ? 'bg-[#0b1b2b] border-white/15 text-white'
                          : 'bg-white border-gray-300 text-[#0b1721]'
                      }`}
                    />
                  </div>
                </div>

                {/* Row 5: Specialization */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8aa0b3] mb-1">
                    Field of Specialization (Optional)
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={editFieldOfResearch}
                      onChange={(e) => setEditFieldOfResearch(e.target.value)}
                      placeholder="Cryosphere Remote Sensing, Sea Ice Modeling"
                      className={`w-full h-10.5 rounded-xl border pl-9 pr-3 text-xs md:text-sm outline-none transition focus:border-[#008b8b] ${
                        isDark
                          ? 'bg-[#0b1b2b] border-white/15 text-white'
                          : 'bg-white border-gray-300 text-[#0b1721]'
                      }`}
                    />
                  </div>
                </div>

                {/* Edit Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#008b8b] hover:bg-[#007373] text-white text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : 'Save & Update Details'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Admin Notification Status Notice */}
        <div
          className={`mt-4 p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            isDark ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className={isDark ? 'text-cyan-200' : 'text-cyan-900'}>
              Admin email notification dispatched to <strong className="underline">admin@ncpor.res.in</strong>
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
            NOTIFIED
          </span>
        </div>

        {/* Live status check message if triggered */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              statusMessage.includes('approved') || statusMessage.includes('granted')
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-7 flex items-center justify-center pt-5 border-t border-white/10">
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="flex items-center justify-center gap-2 h-13 px-8 rounded-2xl bg-[#008b8b] hover:bg-[#007373] text-white text-xs md:text-sm font-bold transition shadow-lg disabled:opacity-60 cursor-pointer min-w-[240px]"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking Status...' : 'Check Approval Status'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
