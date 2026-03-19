import React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface ContactEmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  context: 'business' | 'technical';
}

const palette = {
  canvas: '#f5f7fb',
  shell: '#ffffff',
  border: '#4A5568',
  title: '#111922',
  text: '#374151',
  muted: '#5B7288',
  accent: '#0F7A85',
};

const ContactEmailTemplate: React.FC<ContactEmailTemplateProps> = ({
  name,
  email,
  subject,
  message,
  context,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New contact request: {subject}</Preview>
      <Body style={{ backgroundColor: palette.canvas, margin: 0, padding: '20px 0', fontFamily: 'Arial, sans-serif' }}>
        <Container
          style={{
            backgroundColor: palette.shell,
            border: `1px solid ${palette.border}`,
            borderRadius: '12px',
            margin: '0 auto',
            maxWidth: '620px',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Section style={{ backgroundColor: palette.accent, padding: '18px 22px' }}>
            <Text style={{ color: '#ECFEFF', fontSize: '18px', fontWeight: 700, margin: 0 }}>
              YU AI Platform
            </Text>
            <Text style={{ color: '#D1FAE5', fontSize: '12px', margin: '6px 0 0' }}>
              Unified contact intake
            </Text>
          </Section>

          <Section style={{ padding: '20px 22px 10px' }}>
            <Text style={{ color: palette.title, fontSize: '20px', fontWeight: 700, margin: 0 }}>
              {subject}
            </Text>
            <Text style={{ color: palette.muted, fontSize: '13px', margin: '8px 0 0' }}>
              Context: {context === 'technical' ? 'Technical Showcase' : 'Business SaaS'}
            </Text>
          </Section>

          <Section
            style={{
              margin: '0 22px',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              padding: '12px 14px',
              backgroundColor: '#F8FAFC',
            }}
          >
            <Text style={{ color: palette.text, margin: 0, fontSize: '14px', lineHeight: '22px' }}>
              <strong>From:</strong> {name} ({email})
            </Text>
          </Section>

          <Hr style={{ borderColor: '#D1D9E6', margin: '18px 22px' }} />

          <Section style={{ padding: '0 22px 22px' }}>
            <Text style={{ color: palette.title, fontSize: '14px', fontWeight: 700, margin: '0 0 8px' }}>
              Message
            </Text>
            <Text style={{ color: palette.text, margin: 0, fontSize: '14px', lineHeight: '24px', whiteSpace: 'pre-wrap' }}>
              {message}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactEmailTemplate;
