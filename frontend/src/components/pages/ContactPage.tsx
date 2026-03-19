import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const messageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  companyWebsite: z.string().optional(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

type ContactContext = 'business' | 'technical';

const getSubjectByContext = (context: ContactContext): string =>
  context === 'technical' ? 'Technical Opportunity' : 'Business Inquiry';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const context = searchParams.get('context') === 'technical' ? 'technical' : 'business';

  // Step 1 state
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [sessionId, setSessionId] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [sendingCode, setSendingCode] = React.useState(false);
  const [verifyingCode, setVerifyingCode] = React.useState(false);

  // Toast state
  const [statusMessage, setStatusMessage] = React.useState('');
  const [statusType, setStatusType] = React.useState<'success' | 'error' | ''>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      name: '',
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
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const handleSendCode = async () => {
    setEmailError('');
    if (!email.trim()) { setEmailError('Email is required'); return; }
    if (!EMAIL_RE.test(email.trim())) { setEmailError('Enter a valid email address'); return; }
    setSendingCode(true);
    try {
      const res = await fetch('/api/contact/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'email', destination: email.trim() }),
      });
      const data = await res.json() as { sessionId?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
      setSessionId(data.sessionId || '');
      setCodeSent(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setCodeError('');
    if (!code.trim()) { setCodeError('Enter the verification code'); return; }
    setVerifyingCode(true);
    try {
      const res = await fetch('/api/contact/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, code: code.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setVerified(true);
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleChangeEmail = () => {
    setEmail('');
    setCode('');
    setCodeSent(false);
    setSessionId('');
    setEmailError('');
    setCodeError('');
  };

  const onSubmit = async (values: MessageFormValues) => {
    setStatusMessage('');
    setStatusType('');
    if ((values.companyWebsite || '').trim().length > 0) {
      setStatusType('success');
      setStatusMessage('Message sent successfully.');
      return;
    }
    try {
      const res = await fetch('/api/contact/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, name: values.name, subject: values.subject, message: values.message }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Unable to send your message right now.');
      setStatusType('success');
      setStatusMessage(data.message || 'Message sent successfully.');
      reset();
      setVerified(false);
      setCodeSent(false);
      setEmail('');
      setCode('');
      setSessionId('');
    } catch (err) {
      setStatusType('error');
      setStatusMessage(err instanceof Error ? err.message : 'Unable to send your message right now.');
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-header-card">
        <div className="contact-header-title-row">
          <h1>Contact</h1>
          <div className="contact-social-icons">
            <a
              href="https://github.com/tbudhe"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
              className="contact-social-link"
            >
              <GitHubIcon fontSize="small" />
            </a>
            <a
              href="https://www.linkedin.com/in/tbudhe/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              title="LinkedIn"
              className="contact-social-link"
            >
              <LinkedInIcon fontSize="small" />
            </a>
          </div>
        </div>
        <p>
          Reach our team for sales, support, or collaboration. We typically respond within one business day.
        </p>
      </section>

      <section className="contact-form-card" aria-label="Contact form">
        {/* Step 1 — Email Verification */}
        {!verified && (
          <div className="contact-step">
            <p className="contact-step-label">Step 1 of 2 — Verify your email</p>

            <div className="contact-form-field">
              <label htmlFor="contact-email">Your email address</label>
              <div className="contact-inline-row">
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !codeSent) handleSendCode(); }}
                  placeholder="you@company.com"
                  disabled={codeSent}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'contact-email-error' : undefined}
                />
                {codeSent ? (
                  <button type="button" className="contact-text-btn" onClick={handleChangeEmail}>
                    Change
                  </button>
                ) : (
                  <button
                    type="button"
                    className="contact-submit-btn"
                    onClick={handleSendCode}
                    disabled={sendingCode}
                  >
                    {sendingCode ? 'Sending...' : 'Send Code'}
                  </button>
                )}
              </div>
              {emailError && (
                <p id="contact-email-error" className="contact-error-text" role="alert">{emailError}</p>
              )}
            </div>

            {codeSent && (
              <div className="contact-form-field">
                <label htmlFor="contact-code">Verification code</label>
                <p className="contact-step-hint">Check your inbox — a 6-digit code was sent to {email}</p>
                <div className="contact-inline-row">
                  <input
                    id="contact-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleVerifyCode(); }}
                    placeholder="6-digit code"
                    aria-invalid={Boolean(codeError)}
                    aria-describedby={codeError ? 'contact-code-error' : undefined}
                  />
                  <button
                    type="button"
                    className="contact-submit-btn"
                    onClick={handleVerifyCode}
                    disabled={verifyingCode || code.length < 6}
                  >
                    {verifyingCode ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {codeError && (
                  <p id="contact-code-error" className="contact-error-text" role="alert">{codeError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Message Form */}
        {verified && (
          <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <p className="contact-step-label">Step 2 of 2 — Send your message</p>
            <p className="contact-verified-badge">&#10003; Verified: {email}</p>

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
        )}
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
