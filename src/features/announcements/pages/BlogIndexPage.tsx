// import { getAnnouncements, getBlogPosts } from '@/data/site-data';
// import { SEO } from '@/shared/common/SEO';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';

// export function BlogIndexPage() {
//   const posts = getAnnouncements().sort(
//     (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
//   );

//   const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Blog' }];

//   return (
//     <>
//       <SEO title="Blog" />
//       <Breadcrumbs items={breadcrumbItems} />
//       <section className="section">
//         <div className="container-custom">
//           <h1 className="text-3xl font-bold mb-6">Blog</h1>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {posts.map((post) => (
//               <AppLink
//                 href={`/blog/${post.slug}`}
//                 className="card card-hover block"
//                 key={post.slug}
//               >
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
//                   <p className="text-gray-600 mb-4">{post.description}</p>
//                   <p className="text-sm text-gray-500">
//                     {new Date(post.publishDate).toDateString()}
//                   </p>
//                 </div>
//               </AppLink>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import React from 'react'

export default function BlogIndexPage() {
  return (
    <div>
      This is the blog index page
    </div>
  )
}

