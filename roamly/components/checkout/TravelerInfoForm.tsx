"use client";

interface TravelerInfoProps {
  tourTitle: string;
  adults: number;
  childrenCount: number;
  fullName: string;
  setFullName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
}

export default function TravelerInfoForm({
  tourTitle,
  adults,
  childrenCount,
  fullName,
  setFullName,
  email,
  setEmail,
}: TravelerInfoProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Traveler Info</h2>
      <p className="text-xs text-slate-400 italic mb-4">Please enter primary traveler contact details.</p>
      
      <p className="text-xs font-semibold text-slate-600 mb-4">
        Tour Package: <span className="text-blue-600 font-bold">{tourTitle}</span> ({adults} Adults, {childrenCount} Children)
      </p>

      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="First and last name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Mobile Phone *</label>
          <input
            type="tel"
            required
            placeholder="For excursion updates & emergency contact"
            className="w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email Address (For Invoice Delivery) *</label>
          <input
            type="email"
            required
            placeholder="Tour ticket and confirmation email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Special Requests / Pick-up Location</label>
          <textarea
            rows={3}
            placeholder="Enter hotel pick-up point, dietary restrictions..."
            className="w-full rounded-md border border-slate-300 p-2.5 outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  );
}