import { SEO } from '@/shared/common/SEO';

const PRINCIPLES = [
  {
    label: 'A — DIGNITY:',
    text: 'No member shall demean, belittle, publicly humiliate, or speak disparagingly of another member in any forum — physical, digital, or otherwise — on any basis, including financial standing, employment status, age, marital status, region of origin, religious belief, or political affiliation.',
  },
  {
    label: 'B — FAIRNESS:',
    text: 'Every member shall be treated equitably under these Bye-Laws. No member shall receive preferential treatment on account of financial contributions, social connections, personal relationships with Officers, or any other factor unrelated to governance criteria.',
  },
  {
    label: 'C — TRUST:',
    text: 'Members entrusted with any responsibility — as officers, committee members, event coordinators, or volunteers — shall discharge that responsibility with integrity and accountability. Association resources, relationships, and information shall not be used for personal gain.',
  },
  {
    label: 'D — DECENCY:',
    text: 'Members shall communicate civilly, constructively, and professionally in all formats including in-person, WhatsApp, social media, and email. Inflammatory, offensive, threatening, defamatory, or discriminatory language directed at any member is expressly prohibited.',
  },
  {
    label: 'E — CARE:',
    text: "Members are encouraged to demonstrate genuine care and support for one another, particularly in times of illness, bereavement, hardship, or personal difficulty, consistent with the Chapter's 'Love & Care' ethos and the Welfare Policy.",
  },
  {
    label: 'F — MUTUAL RESPECT:',
    text: 'Differences of opinion, experience, background, and belief shall be regarded as assets. Members shall engage diverse perspectives constructively and shall not silence, suppress, or discredit the legitimate contributions of any other member.',
  },
  {
    label: 'G — DIGITAL CONDUCT:',
    text: 'On all Chapter digital platforms (WhatsApp groups, Instagram, Facebook, the Chapter website, and any other official channels), members shall maintain the same standards of decency and respect as at in-person meetings. Spreading misinformation, sharing unsanctioned recordings of chapter proceedings, or making posts that bring the chapter or any member into disrepute are grounds for disciplinary action.',
  },
] as const;

const LEGAL_BASIS = [
  'CAMA 2020, Section 839(3): Requires association constitutions to contain member governance and conduct provisions.',
  'Nigerian Code of Governance for Non-Profits 2023: Recommends formal codes of conduct for all governance levels.',
  'Nigeria Data Protection Act 2023: Digital communications must comply with personal data protection obligations.',
] as const;

export function CodeOfConductPage() {
  return (
    <>
      <SEO title="Code of Conduct" />

      <section className="section">
        <div className="container-custom max-w-6xl">
          <h1 className="type-section-title mb-6">Code of Conduct</h1>

          <div className="space-y-8 text-gray-600 leading-7">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Code of Conduct</h2>
              <p>
                Every member of the Lagos Chapter — including all Officers, Ex-Officio members,
                committee members, and ordinary members — shall at all times conduct themselves in
                accordance with the following Code of Conduct.
              </p>
            </div>

            <div className="space-y-6">
              {PRINCIPLES.map(({ label, text }) => (
                <p key={label}>
                  <strong className="font-semibold text-gray-900">{label}</strong> {text}
                </p>
              ))}
            </div>

            <p>
              This Code shall be shared with every new member upon registration, displayed on the
              Chapter's digital platforms, and reflected in summary at the opening of each meeting
              as part of the ground rules for engagement.
            </p>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Legal &amp; Regulatory Basis
              </h2>

              <ul className="list-disc pl-6 space-y-2">
                {LEGAL_BASIS.map((basis) => (
                  <li key={basis}>{basis}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
