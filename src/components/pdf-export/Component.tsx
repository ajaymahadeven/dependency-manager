import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type React from 'react';
import type { PackageVersion as ComposerPackageVersion } from '@/types/interfaces/scan/composer/types';
import type { PackageVersion } from '@/types/interfaces/scan/npm/types';
import { statuses } from '@/data/docs/package-status/data';

Font.register({
  family: 'SF Pro Text',
  src: 'https://fonts.cdnfonts.com/s/59278/SFPRODISPLAYREGULAR.woff',
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'SF Pro Text',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    marginBottom: 16,
    color: '#1D1D1F',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 20,
    marginBottom: 12,
    color: '#1D1D1F',
    fontWeight: 'medium',
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
    color: '#1D1D1F',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
    minHeight: 32,
  },
  tableCol: {
    width: '20%',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeader: {
    backgroundColor: '#F5F5F7',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'medium',
    color: '#1D1D1F',
  },
  tableCell: {
    fontSize: 11,
    color: '#1D1D1F',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 10,
    textAlign: 'center',
    alignSelf: 'flex-start',
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
    case 'Failed':
      return { backgroundColor: '#FF3B30', color: '#FFFFFF' };
    default:
      return { backgroundColor: '#8E8E93', color: '#FFFFFF' };
  }
};

interface PDFReportProps {
  fileName: string;
  scannedTime: string;
  packageData: PackageVersion[] | ComposerPackageVersion[];
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Dependency Manager Report</Text>
          <Text style={styles.text}>File Name: {fileName}</Text>
          <Text style={styles.text}>Scanned Time: {formattedTime}</Text>
          <Text style={styles.text}>Total Packages: {packageStats.total}</Text>
          <Text style={styles.text}>
            Up-to-date: {packageStats.upToDate} | Outdated:{' '}
            {packageStats.outdated} | Major Updates: {packageStats.majorUpdate}
          </Text>
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
          <Text style={styles.subheader}>Why Package Updates Matter</Text>
          <Text style={styles.text}>
            Maintaining updated software packages is crucial for business
            continuity, security compliance, and risk management. Organizations
            that neglect package updates face increased security risks,
            potential compliance violations, and higher operational costs.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheader}>Package Analysis Results</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderText}>Package</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderText}>Current</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderText}>Latest</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderText}>Recommended</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableHeaderText}>Status</Text>
              </View>
            </View>
            {packageData.map((pkg) => (
              <View style={styles.tableRow} key={pkg.name} wrap={false}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{pkg.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{pkg.current}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{pkg.latest}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{pkg.recommended}</Text>
                </View>
                <View style={styles.tableCol}>
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
