import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { ASSETS } from '../data/assets';
import { FEATURE_GALLERY } from '../data/siteData';
import { COLORS, SHADOWS } from '../theme/theme';

export default function AboutSection({ onDiscoverBookPress }) {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Main About Content & Image Grid */}
        <View style={styles.aboutGrid}>
          <View style={styles.textCol}>
            <Text style={styles.kicker}>🛫 GET TO KNOW US</Text>
            <Text style={styles.title}>
              Our Jetly saves your time and gives you comfort in flights
            </Text>
            <Text style={styles.description}>
              Experience seamless private aviation tailored around your
              schedule. Whether you are flying for high-stakes executive
              meetings or a private island retreat, Jetly connects you to over
              5,000 global airfields with zero commercial delays and live
              transparent ticket rates.
            </Text>

            <View style={styles.benefitsList}>
              <View style={styles.benefitRow}>
                <Text style={styles.checkIcon}>✔️</Text>
                <Text style={styles.benefitText}>
                  Depart within 15 minutes from private VIP lounges worldwide.
                </Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.checkIcon}>✔️</Text>
                <Text style={styles.benefitText}>
                  Real-time API flight rate calculation & instant e-ticket
                  confirmation.
                </Text>
              </View>
            </View>

            {/* Aviation Stats Strip */}
            <View style={styles.statsStrip}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>280+</Text>
                <Text style={styles.statLabel}>Luxury Aircraft</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>150+</Text>
                <Text style={styles.statLabel}>Countries Reached</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>99.9%</Text>
                <Text style={styles.statLabel}>On-Time Landings</Text>
              </View>
            </View>

            {/* CTA & Phone Row */}
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={styles.discoverBtn}
                activeOpacity={0.85}
                onPress={onDiscoverBookPress}
              >
                <Text style={styles.discoverBtnText}>DISCOVER & BOOK</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callBox}
                onPress={() => Linking.openURL('tel:+9288006780')}
              >
                <Text style={styles.callLabel}>📞 CALL ANYTIME</Text>
                <Text style={styles.callNumber}>+92 ( 8800 ) - 6780</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Luxury Cabin Photo & Floating Badge */}
          <View style={styles.imageCol}>
            <View style={styles.imageCard}>
              <Image
                source={ASSETS.aboutCabin}
                style={styles.aboutImg}
                resizeMode="cover"
              />
              <View style={styles.floatingBadge}>
                <Text style={styles.badgeEmoji}>🏆</Text>
                <View>
                  <Text style={styles.badgeYears}>18+ Years</Text>
                  <Text style={styles.badgeSub}>Aviation Excellence</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3 Feature Gallery Cards */}
        <View style={styles.galleryRow}>
          {FEATURE_GALLERY.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.galleryCard}
              onPress={onDiscoverBookPress}
            >
              <Image
                source={item.img}
                style={styles.galleryImg}
                resizeMode="cover"
              />
              <View style={styles.galleryOverlay}>
                <Text style={styles.galleryKicker}>{item.kicker}</Text>
                <Text style={styles.galleryTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  aboutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 22,
    alignItems: 'center',
    marginBottom: 24,
  },
  textCol: {
    flex: 1.2,
    minWidth: 280,
  },
  kicker: {
    color: COLORS.goldMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    color: COLORS.primaryGreen,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 35,
    marginBottom: 12,
  },
  description: {
    color: COLORS.textMutedDark,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
  benefitsList: {
    gap: 8,
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  checkIcon: {
    fontSize: 13,
  },
  benefitText: {
    flex: 1,
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  statsStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    minWidth: 90,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  statNumber: {
    color: COLORS.primaryGreen,
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.textMutedDark,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
  },
  discoverBtn: {
    backgroundColor: COLORS.primaryGreen,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 24,
    ...SHADOWS.soft,
  },
  discoverBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  callBox: {
    paddingVertical: 4,
  },
  callLabel: {
    color: COLORS.goldMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  callNumber: {
    color: COLORS.primaryGreen,
    fontSize: 15,
    fontWeight: '900',
  },
  imageCol: {
    flex: 1,
    minWidth: 270,
    alignItems: 'center',
  },
  imageCard: {
    width: '100%',
    height: 310,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  aboutImg: {
    width: '100%',
    height: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(10, 35, 20, 0.94)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeYears: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '900',
  },
  badgeSub: {
    color: COLORS.white,
    fontSize: 11,
  },
  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  galleryCard: {
    flex: 1,
    minWidth: 230,
    height: 175,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.primaryGreen,
    ...SHADOWS.soft,
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(10, 35, 20, 0.82)',
  },
  galleryKicker: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  galleryTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
});
