export default function OurStory() {
  return (
    <section
      className="px-[var(--app-page-inline-padding)] py-12 md:py-[50px]"
      aria-labelledby="home-about-title"
    >
      <div className="mx-auto flex max-w-[82rem] flex-col items-center text-center">
        <p className="mb-2 text-base font-semibold leading-normal tracking-[0.03em] text-[#0077cc]">
          Who we are
        </p>

        <h2
          id="home-about-title"
          className="m-0 text-[clamp(1.75rem,2.25vw,2rem)] font-semibold leading-normal tracking-[0.03em] text-[#000e17]"
        >
          About Us
        </h2>

        <div className="mt-2 max-w-[82rem] text-base font-normal leading-normal tracking-[0.03em] text-[#000e17] md:text-[20px]">
          <p className="m-0">
            The FGGC Owerri Old Girls Association - Lagos Chapter is a growing multi-ethnic
            community of alumnae resident in Lagos State, united by our shared Federal Government
            Girls’ College, Owerri experience and a commitment to continue to evolve as women of
            excellence, impacting positively the communities around us and our alma mater.
          </p>

          <p className="m-0 mt-8">
            As proud members of USOSA, we reflect the diversity and national character of the
            Federal Unity Colleges, bringing together women from different backgrounds,
            professions and generations, while building on the values and connections that unite
            us.
          </p>

          <p className="m-0 mt-8">
            One of the largest chapters for the OGA, we are proud to be known as The Chapter of
            Chapters and the Chapter of Excellence. More than simply an alumni, we are a vibrant
            sisterhood with a shared history and an engaged and active presence in Lagos. We are
            committed to strengthening and passing on our legacy.
          </p>
        </div>
      </div>
    </section>
  );
}