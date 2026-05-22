import { SEO } from '@/shared/common/SEO';

export function PrivacyPage() {
  return (
    <>
      <SEO title="Privacy Policy" />

      <section className="section">
        <div className="container-custom max-w-4xl">
          <h1 className="type-section-title mb-6">Privacy Policy</h1>

          <div className="space-y-8 text-gray-600 leading-7">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lorem nec nulla
                luctus dignissim. Integer faucibus tincidunt lacus, eget facilisis mauris hendrerit
                non. Vivamus sed tristique lorem. Donec tincidunt, erat sed consequat suscipit,
                purus odio tincidunt urna, non pretium sapien purus vitae turpis.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus turpis vel
                magna faucibus, a luctus purus facilisis. Aliquam erat volutpat. Nulla facilisi.
                Duis posuere felis at justo malesuada, sed cursus libero tincidunt.
              </p>

              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Lorem ipsum dolor sit amet consectetur adipiscing elit.</li>
                <li>Integer faucibus tincidunt lacus eget facilisis mauris.</li>
                <li>Vivamus sed tristique lorem donec tincidunt erat.</li>
                <li>Praesent consequat sem vel sapien fermentum.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                How We Use Your Information
              </h2>

              <p>
                Suspendisse potenti. Nulla facilisi. Pellentesque habitant morbi tristique senectus
                et netus et malesuada fames ac turpis egestas. Nam commodo, libero non pulvinar
                pretium, augue augue consequat lacus, vitae facilisis nisl mauris eget lorem.
              </p>

              <p className="mt-4">
                Curabitur in feugiat augue. Sed malesuada, metus non varius vulputate, urna nunc
                luctus massa, quis scelerisque purus lorem nec velit. Donec vel semper ligula.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Protection</h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tincidunt, lectus
                sed hendrerit pharetra, lacus mauris tempor nisi, vitae fermentum purus turpis vel
                nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
                cubilia curae.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>

              <p>
                Aenean ut magna sed turpis cursus pretium. Donec malesuada, neque vitae fermentum
                hendrerit, lorem leo efficitur nisl, sed pellentesque lorem libero id arcu. Etiam
                feugiat, lacus at viverra porta, erat odio facilisis velit, non cursus nibh lorem
                nec justo.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat tellus ac
                mauris pharetra, sed facilisis velit fermentum. Morbi luctus metus ut mauris
                faucibus, vel ultricies nisl volutpat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
