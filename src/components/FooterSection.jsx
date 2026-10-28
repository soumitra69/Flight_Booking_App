import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { ASSETS } from '../data/assets';
import { COLORS, SHADOWS } from '../theme/theme';

export default function FooterSection({
  onReplayLanding,
  onNavigateSection,
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <View style={styles.footerWrapper}>
      {/* Runway Divider Strip */}
      <View style={styles.runwayDivider}>
        <View style={styles.runwayLine} />
        <View style={styles.movingJetBadge}>
          <Text style={styles.movingJetText}>✈️ VIP RUNWAY 09L</Text>
        </View>
        <View style={styles.runwayLine} />
      </View>

      <View style={styles.container}>
        {/* Top CTA Banner inside Footer */}
        <View style={styles.ctaBanner}>
          <View style={{ flex: 1, minWidth: 240 }}>
            <Text style={styles.ctaKicker}>
              READY FOR TAKEOFF & SMOOTH LANDING?
            </Text>
            <Text style={styles.ctaTitle}>
              Experience Private Luxury Aviation Today
            </Text>
          </View>

          <View style={styles.ctaButtonsRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => onNavigateSection('book')}
            >
              <Text style={styles.primaryBtnText}>
                🎟️ Book Flight Ticket Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={onReplayLanding}
            >
              <Text style={styles.secondaryBtnText}>🛬 Watch Sky Landing</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main 4-Column Footer Grid */}
        <View style={styles.footerGrid}>
          {/* Brand Column */}
          <View style={styles.footerCol}>
            <Image
              source={ASSETS.logo}
              style={styles.footerLogo}
              resizeMode="contain"
            />
            <Text style={styles.aboutText}>
              Jetly is your premier private jet & luxury flight booking
              platform. Enjoy 15-minute VIP terminal boarding, live API
              multi-currency ticket rates, and access to 5,000+ global runways.
            </Text>
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialChip}
                onPress={() =>
                  Linking.openURL(
                    'https://github.com/soumitra69/Flight_booking_Site'
                  )
                }
              >
                <Text style={styles.socialChipText}>GitHub Repo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialChip}
                onPress={() =>
                  Linking.openURL('https://github.com/soumitra69')
                }
              >
                <Text style={styles.socialChipText}>@soumitra69</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Links Column */}
          <View style={styles.footerColSmall}>
            <Text style={styles.colHeading}>Quick Links</Text>
            {[
              { label: 'Home & Sky Landing', tab: 'home' },
              { label: 'Live API Ticket Booking', tab: 'book' },
              { label: 'Empty Leg Charters', tab: 'charters' },
              { label: 'Our Charter Services', tab: 'services' },
              { label: 'My VIP Tickets Wallet', tab: 'tickets' },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.linkItem}
                onPress={() => onNavigateSection(item.tab)}
              >
                <Text style={styles.linkText}>› {item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Aviation Fleet Column */}
          <View style={styles.footerColSmall}>
            <Text style={styles.colHeading}>Aviation Fleet</Text>
            {[
              'Executive Seat Share',
              'Light Business Jets',
              'Super Midsize Charters',
              'Ultra-Long Range VIP',
              'Diplomatic & High Profile',
              'Air Ambulance & Cargo',
            ].map((fleet, i) => (
              <TouchableOpacity
                key={i}
                style={styles.linkItem}
                onPress={() => onNavigateSection('book')}
              >
                <Text style={styles.linkText}>› {fleet}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Newsletter & Contact Column */}
          <View style={styles.footerCol}>
            <Text style={styles.colHeading}>VIP Empty-Leg Alerts</Text>
            <Text style={styles.aboutText}>
              Subscribe to receive instant notifications on discounted private
              jet legs and live ticket rate drops.
            </Text>

            <View style={styles.newsletterRow}>
              <TextInput
                style={styles.newsletterInput}
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.textMutedLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.newsletterBtn}
                onPress={handleSubscribe}
              >
                <Text style={styles.newsletterBtnText}>Send ➤</Text>
              </TouchableOpacity>
            </View>
            {subscribed && (
              <Text style={styles.subscribedText}>
                ✅ Subscribed to VIP Flight Alerts!
              </Text>
            )}

            <View style={styles.contactList}>
              <TouchableOpacity
                onPress={() => Linking.openURL('tel:+919475750163')}
              >
                <Text style={styles.contactItem}>
                  📞 +91 (947575) - 0163
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL('mailto:concierge@jetly-flights.com')
                }
              >
                <Text style={styles.contactItem}>
                  ✉️ concierge@jetly-flights.com
                </Text>
              </TouchableOpacity>
              <Text style={styles.contactItem}>
                📍 VIP Terminal 3, New Delhi • Dubai • London
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Copyright & Back to Top */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} Jetly Private Aviation • Built with
            React Native & Live Free Aviation/Rate APIs.
          </Text>
          <TouchableOpacity
            style={styles.backToTopBtn}
            onPress={onReplayLanding}
          >
            <Text style={styles.backToTopText}>🛫 Fly to Top</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: '#05130b',
    paddingBottom: 24,
    paddingHorizontal: 14,
  },
  runwayDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  runwayLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: 'rgba(212, 184, 66, 0.35)',
  },
  movingJetBadge: {
    backgroundColor: 'rgba(212, 184, 66, 0.16)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  movingJetText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  container: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
  },
  ctaBanner: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
    ...SHADOWS.card,
  },
  ctaKicker: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  ctaTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '900',
  },
  ctaButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  primaryBtnText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  secondaryBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  footerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  footerCol: {
    flex: 1.3,
    minWidth: 240,
  },
  footerColSmall: {
    flex: 0.9,
    minWidth: 160,
  },
  footerLogo: {
    width: 120,
    height: 36,
    marginBottom: 10,
  },
  aboutText: {
    color: COLORS.textMutedLight,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialChip: {
    backgroundColor: 'rgba(212, 184, 66, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  socialChipText: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '700',
  },
  colHeading: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    color: COLORS.textMutedLight,
    fontSize: 12,
  },
  newsletterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.white,
    fontSize: 12,
  },
  newsletterBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsletterBtnText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '900',
  },
  subscribedText: {
    color: COLORS.emeraldLight,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  contactList: {
    gap: 5,
    marginTop: 6,
  },
  contactItem: {
    color: COLORS.textMutedLight,
    fontSize: 12,
  },
  bottomBar: {
    paddingTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  copyrightText: {
    color: COLORS.textMutedLight,
    fontSize: 11,
  },
  backToTopBtn: {
    backgroundColor: 'rgba(212, 184, 66, 0.16)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  backToTopText: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '800',
  },
});
