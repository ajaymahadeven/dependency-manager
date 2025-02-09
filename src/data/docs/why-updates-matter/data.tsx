import { Building2, DollarSign, Shield, TrendingUp } from 'lucide-react';

export const businessImpacts = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Security & Compliance',
    description:
      'Outdated packages can lead to security vulnerabilities, potentially exposing sensitive data and compromising ISO 27001 compliance requirements.',
    details: [
      'Regular updates are crucial for maintaining ISO 27001 certification',
      'Security patches protect against known vulnerabilities',
      'Compliance with data protection regulations (GDPR, CCPA)',
      'Audit trail of security maintenance',
    ],
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Financial Impact',
    description:
      'The cost of a security breach far exceeds the investment in maintaining updated packages.',
    details: [
      'Average cost of a data breach: $4.35M (IBM Report, 2022)',
      'Potential loss of business and customer trust',
      'Insurance premium implications',
      'Recovery and remediation costs',
    ],
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Business Continuity',
    description:
      'Outdated dependencies can lead to system failures and business interruptions.',
    details: [
      'Minimize unexpected downtime',
      'Ensure consistent service delivery',
      'Maintain competitive advantage',
      'Reduce technical debt',
    ],
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: 'Corporate Reputation',
    description:
      'Security incidents due to outdated software can severely damage brand reputation and customer trust.',
    details: [
      'Maintain stakeholder confidence',
      'Demonstrate due diligence',
      'Industry leadership position',
      'Customer trust preservation',
    ],
  },
];

export const packageManagers = [
  {
    name: 'npm',
    ecosystem: 'JavaScript/Node.js',
    importance:
      'Powers 97% of web applications worldwide through JavaScript dependencies',
  },
  {
    name: 'PyPI',
    ecosystem: 'Python',
    importance: 'Critical for data science, AI/ML, and backend systems',
  },
  {
    name: 'Composer',
    ecosystem: 'PHP',
    importance:
      'Essential for content management systems and enterprise web applications',
  },
];
