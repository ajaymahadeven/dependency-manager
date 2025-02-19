import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type React from 'react';
import type { PackageVersion as ComposerPackageVersion } from '@/types/interfaces/scan/composer/types';
import type { PackageVersion as NpmPackageVersion } from '@/types/interfaces/scan/npm/types';
import type { PackageVersion as PyPiPackageVersion } from '@/types/interfaces/scan/pypi/types';
import { statuses } from '@/data/docs/package-status/data';

Font.register({
  family: 'SF Pro Text',
  fonts: [
    { src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYREGULAR.woff' },
    {
      src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYMEDIUM.woff',
      fontWeight: 500,
    },
    {
      src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYBOLD.woff',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'SF Pro Text',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 12,
    color: '#1D1D1F',
    fontWeight: 700,
  },
  subheader: {
    fontSize: 18,
    marginBottom: 8,
    color: '#1D1D1F',
    fontWeight: 500,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
    color: '#1D1D1F',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
    minHeight: 24,
  },
  tableCol: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tableHeader: {
    backgroundColor: '#F5F5F7',
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 500,
    color: '#1D1D1F',
  },
  tableCell: {
    fontSize: 9,
    color: '#1D1D1F',
  },
  statusBadge: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    fontSize: 8,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: '#F5F5F7',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    color: '#1D1D1F',
  },
  summaryText: {
    fontSize: 10,
    color: '#1D1D1F',
    lineHeight: 1.3,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 9,
    color: '#1D1D1F',
    flex: 1,
  },

  statusDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusPill: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    flex: 1,
    fontSize: 11,
    color: '#1D1D1F',
  },
});

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'up-to-date':
      return { backgroundColor: '#34C759', color: '#FFFFFF' };
    case 'outdated':
      return { backgroundColor: '#FF9500', color: '#FFFFFF' };
    case 'major-update':
      return { backgroundColor: '#007AFF', color: '#FFFFFF' };
    case 'failed':
      return { backgroundColor: '#FF3B30', color: '#FFFFFF' };
    default:
      return { backgroundColor: '#8E8E93', color: '#FFFFFF' };
  }
};

interface PDFReportProps {
  fileName: string;
  scannedTime: string;
  packageData:
    | NpmPackageVersion[]
    | ComposerPackageVersion[]
    | PyPiPackageVersion[];
  packageStats: {
    total: number;
    upToDate: number;
    outdated: number;
    majorUpdate: number;
  };
}

const PDFReport: React.FC<PDFReportProps> = ({
  fileName,
  scannedTime,
  packageData,
  packageStats,
}) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedTime = new Date(scannedTime).toLocaleString('en-US', {
    timeZone,
    timeZoneName: 'short',
  });

  const getSummaryMessage = () => {
    if (packageStats.majorUpdate > packageStats.outdated) {
      return 'Critical: High number of major updates required. Prioritize these updates for improved features and security.';
    } else if (packageStats.outdated > packageStats.majorUpdate) {
      return 'Action needed: Several packages are outdated. Plan updates to maintain optimal performance and security.';
    } else {
      return 'Attention: Mixed update requirements. Address both major and minor updates in your maintenance plan.';
    }
  };

  const getUpToDateMessage = () => {
    const percentage = (packageStats.upToDate / packageStats.total) * 100;
    return `${percentage.toFixed(1)}% of packages are up-to-date. ${
      percentage > 50
        ? 'Keep up the good work!'
        : 'Consider increasing update frequency.'
    }`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Dependency Report</Text>
          <Text style={styles.text}>File: {fileName}</Text>
          <Text style={styles.text}>Scanned: {formattedTime}</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Quick Summary</Text>
          <Text style={styles.summaryText}>{getSummaryMessage()}</Text>
          <Text style={styles.summaryText}>{getUpToDateMessage()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Package Status Definitions</Text>
          {statuses.map((status) => (
            <View key={status.status} style={styles.statusDescription}>
              <View
                style={[styles.statusPill, getStatusStyle(status.status)]}
              />
              <View style={styles.statusText}>
                <Text style={{ fontWeight: 'bold' }}>{status.title}: </Text>
                <Text>
                  {status.description} {status.recommendation}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Package Status</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCol, { width: '33%' }]}>
                <Text style={styles.tableHeaderText}>Status</Text>
              </View>
              <View style={[styles.tableCol, { width: '33%' }]}>
                <Text style={styles.tableHeaderText}>Count</Text>
              </View>
              <View style={[styles.tableCol, { width: '34%' }]}>
                <Text style={styles.tableHeaderText}>Percentage</Text>
              </View>
            </View>
            {[
              { label: 'Major Updates', count: packageStats.majorUpdate },
              { label: 'Outdated', count: packageStats.outdated },
              { label: 'Up-to-date', count: packageStats.upToDate },
            ].map((item) => (
              <View key={item.label} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: '33%' }]}>
                  <Text style={styles.tableCell}>{item.label}</Text>
                </View>
                <View style={[styles.tableCol, { width: '33%' }]}>
                  <Text style={styles.tableCell}>{item.count}</Text>
                </View>
                <View style={[styles.tableCol, { width: '34%' }]}>
                  <Text style={styles.tableCell}>
                    {((item.count / packageStats.total) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Keeping packages updated is crucial for security, performance, and
            compatibility. Regular updates reduce vulnerabilities and ensure
            access to the latest features.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Package Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCol, { width: '25%' }]}>
                <Text style={styles.tableHeaderText}>Package</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableHeaderText}>Current</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableHeaderText}>Latest</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableHeaderText}>Recommended</Text>
              </View>
              <View style={[styles.tableCol, { width: '15%' }]}>
                <Text style={styles.tableHeaderText}>Status</Text>
              </View>
            </View>
            {packageData.map((pkg) => (
              <View style={styles.tableRow} key={pkg.name} wrap={false}>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text style={styles.tableCell}>{pkg.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{pkg.current}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{pkg.latest}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{pkg.recommended}</Text>
                </View>
                <View style={[styles.tableCol, { width: '15%' }]}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.statusBadge,
                      getStatusStyle(pkg.status),
                    ]}
                  >
                    {pkg.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFReport;
