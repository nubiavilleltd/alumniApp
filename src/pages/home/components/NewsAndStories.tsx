import React from "react";
import News1 from "../../../../public/news-1.png"
import News2 from "../../../../public/news-2.png"
import News3 from "../../../../public/news-3.png"
import News4 from "../../../../public/news-4.png"
import News5 from "../../../../public/news-5.png"

interface NewsItem {
  id: number;
  title: string;
  date: string;
  image: string;
  tag?: string;
  excerpt?: string;
  featured?: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Association Awards ₦45M in Scholarships — Largest in Our History",
    date: "March 1, 2026",
    image: News1,
    tag: "SCHOLARSHIP",
    excerpt:
      "In an emotional prize-giving ceremony held at FGGC Abuja, the Alumnae Association announced its highest-ever scholarship disbursement — directly supporting 180 students across three arms of the school, with special focus on STEM and the Arts.",
    featured: true,
  },
  {
    id: 2,
    title: "Houston Chapter Officially Launched — Our 32nd Global Chapter",
    date: "March 1, 2026",
    image: News2,
  },
  {
    id: 3,
    title: "New Science Laboratory Wing Commissioned at FGGC Calabar",
    date: "March 1, 2026",
    image: News3,
  },
  {
    id: 4,
    title: "Alumna of the Year 2025 — Dr. Chiamaka Obi Honoured in Abuja",
    date: "March 1, 2026",
    image: News4,
  },
  {
    id: 5,
    title: "Digital Yearbook Archive Now Live — Access Your Set's Photos",
    date: "March 1, 2026",
    image: News5,
  },
];

export default function NewsAndStories() {
  const featured = newsItems.find((n) => n.featured);
  const sidebar = newsItems.filter((n) => !n.featured);

  return (
    // <section className="bg-white py-16 px-6 md:px-12 lg:px-20">
    <section className="section">
      {/* <div className="max-w-5xl mx-auto"> */}
      <div className="container-custom">
        {/* Header */}
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Latest
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          News &amp; <span className="text-primary-500">Stories</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured Article */}
          {featured && (
            <div className="lg:col-span-3 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="h-56 bg-gray-100 overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                {featured.tag && (
                  <span className="inline-block bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3 w-fit tracking-wider">
                    {featured.tag}
                  </span>
                )}
                <h3 className="text-gray-900 font-bold text-lg leading-snug mb-3">
                  {featured.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {featured.excerpt}
                </p>
                <p className="text-primary-500 text-xs font-semibold mt-4">
                  {featured.date}
                </p>
              </div>
            </div>
          )}

          {/* Sidebar Articles */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {sidebar.map((item) => (
              <a
                key={item.id}
                href="#"
                className="flex gap-3 items-center bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h4 className="text-gray-800 text-xs font-semibold leading-snug group-hover:text-primary-500 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-[11px] mt-1">{item.date}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}