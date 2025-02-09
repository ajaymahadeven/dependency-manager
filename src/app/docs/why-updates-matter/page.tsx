import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  FileCheck,
  Shield,
  TrendingUp,
} from 'lucide-react';
import Footer from '@/components/home/footer/Component';
import SiteNavbar from '@/components/navbar/Component';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  businessImpacts,
  packageManagers,
} from '@/data/docs/why-updates-matter/data';

export default function PackageStatusInfo() {
  return (
    <div className="bg-background min-h-screen">
      <SiteNavbar />
      <div className="flex min-h-full items-center justify-center">
        <div className="container mx-auto max-w-7xl p-6">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold">
              Why Package Updates Matter
            </h1>
            <p className="text-muted-foreground text-xl">
              A Business Leader&apos;s Guide to Software Package Management
            </p>
          </div>

          <Alert className="mb-8 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Executive Summary</AlertTitle>
            <AlertDescription>
              Maintaining updated software packages is crucial for business
              continuity, security compliance, and risk management.
              Organizations that neglect package updates face increased security
              risks, potential compliance violations, and higher operational
              costs.
            </AlertDescription>
          </Alert>

          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {businessImpacts.map((impact) => (
              <Card key={impact.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{impact.icon}</span>
                    <CardTitle>{impact.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {impact.description}
                  </p>
                  <ul className="space-y-2">
                    {impact.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <BadgeCheck className="text-primary mt-0.5 h-5 w-5" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">
              Package Ecosystems We Support
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {packageManagers.map((pm) => (
                <Card key={pm.name}>
                  <CardHeader>
                    <CardTitle>{pm.name}</CardTitle>
                    <CardDescription>{pm.ecosystem}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {pm.importance}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileCheck className="text-primary h-6 w-6" />
                <CardTitle>ISO 27001 Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                ISO 27001 requires organizations to maintain systematic
                approaches to managing sensitive company information. Regular
                package updates are a crucial component of:
              </p>
              <ul className="grid gap-4">
                <li className="flex items-start gap-2">
                  <Clock className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <strong className="block">
                      A.12.6.1 Management of Technical Vulnerabilities
                    </strong>
                    <span className="text-muted-foreground text-sm">
                      Requires timely identification and evaluation of technical
                      vulnerabilities and appropriate measures to address
                      associated risks.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <strong className="block">
                      A.14.2.2 System Change Control Procedures
                    </strong>
                    <span className="text-muted-foreground text-sm">
                      Mandates control and documentation of changes to the
                      organization&apos;s information processing facilities and
                      systems.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="text-primary mt-0.5 h-5 w-5" />
                  <div>
                    <strong className="block">
                      A.14.2.5 Secure System Engineering Principles
                    </strong>
                    <span className="text-muted-foreground text-sm">
                      Requires establishment, documentation, maintenance, and
                      application of secure system engineering principles.
                    </span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Return on Investment
            </AlertTitle>
            <AlertDescription>
              Investment in proper package management and updates typically
              costs less than 1% of what a major security breach might cost.
              Regular updates prevent costly emergency fixes, reduce downtime,
              and maintain operational efficiency.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Footer />
    </div>
  );
}
