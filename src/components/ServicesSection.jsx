import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SERVICES_LIST } from '../data/siteData';
import { formatCurrencyPrice } from '../services/flightApi';
import { COLORS, SHADOWS } from '../theme/theme';

export default function ServicesSection({
  currency,
  exchangeInfo,
  onBookServicePress,
}) {
  const [activeService, setActiveService] = useState(null);

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <Text style={styles.kicker}>✈️ WHAT WE'RE OFFERING</Text>
        <Text style={styles.title}>
          Select the service according to your work
        </Text>

        <View style={styles.servicesGrid}>
          {SERVICES_LIST.map((srv) => {
            const priceStr = formatCurrencyPrice(
              srv.startingUsd,
              currency,
              exchangeInfo.rates
            );
            const isSelected = activeService?.id === srv.id;

            return (
              <TouchableOpacity
                key={srv.id}
                activeOpacity={0.9}
                style={[
                  styles.serviceCard,
                  isSelected && styles.serviceCardSelected,
                ]}
                onPress={() => setActiveService(srv)}
              >
                <View style={styles.imgWrap}>
                  <Image
                    source={srv.img}
                    style={styles.serviceImg}
                    resizeMode="cover"
                  />
                  <View style={styles.speedPill}>
                    <Text style={styles.speedPillText}>{srv.speed}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.serviceTag}>{srv.tag}</Text>
                  <Text style={styles.serviceTitle}>{srv.title}</Text>
                  <Text style={styles.serviceDesc}>{srv.desc}</Text>

                  <View style={styles.metaRow}>
                    <View>
                      <Text style={styles.priceLabel}>
                        From <Text style={styles.priceBold}>{priceStr}</Text> / leg
                      </Text>
                      <Text style={styles.capacityText}>{srv.capacity}</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.arrowBtn}
                      onPress={() => onBookServicePress(srv)}
                    >
                      <Text style={styles.arrowBtnText}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Interactive Service Detail Sheet */}
        {activeService && (
          <View style={styles.detailBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailKicker}>
                {activeService.tag} • {activeService.speed}
              </Text>
              <Text style={styles.detailTitle}>
                {activeService.title} — {activeService.capacity}
              </Text>
              <Text style={styles.detailDesc}>{activeService.desc}</Text>
              <View style={styles.highlightsRow}>
                {activeService.highlights?.map((h, i) => (
                  <View key={i} style={styles.highlightChip}>
                    <Text style={styles.highlightChipText}>✓ {h}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.detailActions}>
              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={() => onBookServicePress(activeService)}
              >
                <Text style={styles.bookNowBtnText}>
                  Book {activeService.title} Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setActiveService(null)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Aviation Safety & Speed Strip */}
        <View style={styles.safetyStrip}>
          <View style={styles.safetyItem}>
            <Text style={styles.safetyIcon}>🛡️</Text>
            <Text style={styles.safetyText}>
              100% ARGUS Platinum Safety Rating
            </Text>
          </View>
          <View style={styles.safetyItem}>
            <Text style={styles.safetyIcon}>⚡</Text>
            <Text style={styles.safetyText}>
              15-Minute VIP Terminal Boarding
            </Text>
          </View>
          <View style={styles.safetyItem}>
            <Text style={styles.safetyIcon}>🌍</Text>
            <Text style={styles.safetyText}>
              Live Multi-Currency API Ticket Pricing
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: COLORS.ivoryBg,
    paddingVertical: 28,
    paddingHorizontal: 14,
  },
  container: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
  },
  kicker: {
    color: COLORS.goldMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginBottom: 6,
  },
  title: {
    color: COLORS.primaryGreen,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  serviceCard: {
    flexGrow: 1,
    flexBasis: 245,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  serviceCardSelected: {
    borderColor: COLORS.goldMuted,
  },
  imgWrap: {
    height: 150,
    position: 'relative',
    backgroundColor: COLORS.primaryGreen,
  },
  serviceImg: {
    width: '100%',
    height: '100%',
  },
  speedPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(10, 35, 20, 0.88)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
  },
  speedPillText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
  },
  cardBody: {
    padding: 15,
  },
  serviceTag: {
    color: COLORS.goldMuted,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  serviceTitle: {
    color: COLORS.primaryGreen,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
    marginBottom: 6,
  },
  serviceDesc: {
    color: COLORS.textMutedDark,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0efe9',
  },
  priceLabel: {
    color: COLORS.textMutedDark,
    fontSize: 11,
  },
  priceBold: {
    color: COLORS.primaryGreen,
    fontSize: 14,
    fontWeight: '900',
  },
  capacityText: {
    color: COLORS.goldMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '900',
  },
  detailBanner: {
    marginTop: 16,
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.gold,
    padding: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    ...SHADOWS.card,
  },
  detailKicker: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  detailTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 4,
  },
  detailDesc: {
    color: COLORS.textMutedLight,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  highlightsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightChip: {
    backgroundColor: 'rgba(212, 184, 66, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  highlightChipText: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '700',
  },
  detailActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bookNowBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  bookNowBtnText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '900',
  },
  closeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  closeBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  safetyStrip: {
    marginTop: 20,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  safetyIcon: {
    fontSize: 15,
  },
  safetyText: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: '700',
  },
});
