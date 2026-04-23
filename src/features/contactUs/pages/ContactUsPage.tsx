import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Button } from '@/shared/components/ui/Button';
import { BaseInput } from '@/shared/components/ui/input/BaseInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

const contactMethods = [
  {
    label: 'Find us',
    value: '123 Alumni Avenue, Victoria Island Lagos, Nigeria',
    icon: 'mdi:map-marker-outline',
  },
  {
    label: 'Call us',
    value: '+234 800 000 0000',
    icon: 'mdi:phone-outline',
  },
  {
    label: 'Email us',
    value: 'alumni@fggcowerri.com',
    icon: 'mdi:email-outline',
  },
];

export function ContactUsPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the FGGC Owerri Alumnae Association for membership, events, and website support."
      />

      <main className="contact-page">
        <div className="contact-page__shell">
          <span className="contact-page__arrow" aria-hidden="true" />

          <section className="contact-intro" aria-labelledby="contact-title">
            <h1 id="contact-title" className="contact-intro__title">
              Get in touch with us
            </h1>
            <p className="contact-intro__copy">
              Have questions about membership, events, or the website? We're here to help.
            </p>

            <div className="contact-intro__details" aria-label="Contact details">
              {contactMethods.map((method) => (
                <article key={method.label} className="contact-detail">
                  <div className="contact-detail__header">
                    <span className="contact-detail__icon" aria-hidden="true">
                      <Icon icon={method.icon} />
                    </span>
                    <h2 className="contact-detail__label">{method.label}</h2>
                  </div>
                  <p className="contact-detail__value">{method.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="contact-form-card" aria-label="Send us a message">
            <form className="contact-form-card__form" onSubmit={handleSubmit}>
              <div className="contact-form-card__grid">
                <BaseInput
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                />
                <BaseInput
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                />
                <BaseInput
                  className="contact-form-card__field--full"
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
                <TextareaInput
                  className="contact-form-card__field--full"
                  label="How can we help you?"
                  name="message"
                  placeholder="Write your message here..."
                  rows={6}
                />
              </div>

              <Button type="button" size="lg" className="contact-form-card__button">
                Send message
              </Button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
