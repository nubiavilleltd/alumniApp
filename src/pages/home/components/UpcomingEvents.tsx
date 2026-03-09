import { AppLink } from "@/shared/components/ui/AppLink";
import Event1 from "../../../../public/event-1.png"
import Event2 from "../../../../public/event-2.png"
import React from "react";

interface Event {
  id: number;
  title: string;
  dateRange: string;
  location?: string;
  attire?: string;
  type: string;
  description: string;
  image: string;
  isVirtual?: boolean;
}

const events: Event[] = [
  {
    id: 1,
    title: "Annual Homecoming Weekend & Grand Gala",
    dateRange: "Oct 28 – 30, 2026",
    location: "Transcorp Hilton, Abuja",
    attire: "Formal Attire",
    type: "In-Person",
    description:
      "A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.",
    image: Event1,
  },
  {
    id: 2,
    title: "Diaspora Virtual Networking Night",
    dateRange: "Oct 18 – 20, 2026",
    location: "Zoom, Global",
    type: "Virtual",
    description:
      "A spectacular reunion bringing together alumnae from every set and every corner of the world. Awards ceremony, cultural night, and gala dinner.",
    image: Event2,
    isVirtual: true,
  },
];

function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-52 overflow-hidden bg-gray-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">
            {event.dateRange}
          </span>
        </div>
        <h3 className="text-primary-500 font-semibold text-sm mb-2">{event.title}</h3>
        <div className="flex items-center gap-3 text-gray-500 text-xs mb-2">
          {event.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location}
            </span>
          )}
          {event.attire && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {event.attire}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs mb-3">{event.description}</p>
        <a href="#" className="text-primary-500 text-xs font-semibold hover:underline flex items-center gap-1">
          Register <span>→</span>
        </a>
      </div>
    </div>
  );
}

export default function UpcomingEvents() {
  return (
    // <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
    <section className="section">
      {/* <div className="max-w-5xl mx-auto"> */}
      <div className="container-custom">
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Upcoming Events
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Through the generosity of our alumni, we continue to support and improve our beloved school
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="mt-6 text-right">
          {/* <a
            href="#"
            className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            See More <span>→</span>
          </a> */}

          <AppLink href="/events" className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1">See More</AppLink>
        </div>
      </div>
    </section>
  );
}