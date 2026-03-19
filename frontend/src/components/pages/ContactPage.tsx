import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  companyWebsite: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type ContactContext = 'business' | 'technical';

interface ContactApiResponse {
  message?: string;
  error?: string;
}

const getSubjectByContext = (context: ContactContext): string =>
  context === 'technical' ? 'Technical Opportunity' : 'Business Inquiry';

const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const context = searchParams.get('context') === 'technical' ? 'technical' : 'business';
  const [statusMessage, setStatusMessage] = React.useState('');
  const [statusType, setStatusType] = React.useState<'success' | 'error' | ''>('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: getSubjectByContext(context),
      message: '',
      companyWebsite: '',
    },
  });

  React.useEffect(() => {
    if (!statusMessage) return;

    const timer = window.setTimeout(() => {
      setStatusMessage('');
      setStatusType('');
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  React.useEffect(() => {
    if (!dirtyFields.subject) {
      setValue('subject', getSubjectByContext(context), { shouldDirty: false, shouldValidate: true });
    }
  }, [context, dirtyFields.subject, setValue]);

  const onSubmit = async (values: ContactFormValues) => {
    setStatusMessage('');
    setStatusType('');

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          context,
        }),
      });

      const payload: ContactApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to send your message right now.');
      }

      setStatusType('success');
      setStatusMessage(payload.message || 'Message sent successfully.');
      reset({
        name: '',
        email: '',
        subject: getSubjectByContext(context),
        message: '',
        companyWebsite: '',
      });
    } catch (error) {
      setStatusType('error');
      setStatusMessage(error instanceof Error ? error.message : 'Unable to send your message right now.');
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-header-card">
        <h1>Contact</h1>
        <p>
          Reach our team for sales, support, or collaboration. We typically respond within one business day.
        </p>
      </section>

      <section className="contact-form-card" aria-label="Contact form">
        <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="contact-form-grid">
            <div className="contact-form-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                placeholder="Your full name"
                {...register('name')}
              />
              {errors.name && (
                <p id="contact-name-error" className="contact-error-text" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="contact-form-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                placeholder="you@company.com"
                {...register('email')}
              />
              {errors.email && (
                <p id="contact-email-error" className="contact-error-text" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="contact-form-field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              placeholder="What is this about?"
              {...register('subject')}
            />
            {errors.subject && (
              <p id="contact-subject-error" className="contact-error-text" role="alert">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="contact-form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows={7}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              placeholder="Tell us what you need help with"
              {...register('message')}
            />
            {errors.message && (
              <p id="contact-message-error" className="contact-error-text" role="alert">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-company-website">Company website</label>
            <input
              id="contact-company-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register('companyWebsite')}
            />
          </div>

          <div className="contact-form-footer">
            <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>

        </form>
      </section>

      {statusMessage && (
        <aside className={`contact-toast ${statusType === 'error' ? 'error' : 'success'}`} role="status" aria-live="polite">
          {statusMessage}
        </aside>
      )}
    </div>
  );
};

export default ContactPage;
