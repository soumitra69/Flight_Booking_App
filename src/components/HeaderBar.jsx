import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import { ASSETS } from '../data/assets';
import { CURRENCY_META } from '../services/flightApi';
import { COLORS, SHADOWS } from '../theme/theme';

export default function HeaderBar({
  currency,
  setCurrency,
  exchangeInfo,
  bookingsCount,
  onOpenBookingsModal,
  onReplayLanding,
  onNavigateSection,
  isMobileFrame,
  setIsMobileFrame,
  isWideScreen,
}) {
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerInner}>
        {/* Brand Logo & Live Status */}
        <TouchableOpacity
          style={styles.brandRow}
          activeOpacity={0.85}
          onPress={() => onNavigateSection('home')}
        >
          <Image
            source={ASSETS.logo}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.vipPill}>
            <Text style={styles.vipPillText}>RN MOBILE</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions on Right */}
        <View style={styles.actionsRow}>
          {/* Device Viewport Switcher on Desktop/Wide Screens */}
          {isWideScreen && (
            <TouchableOpacity
              style={[
                styles.deviceFrameBtn,
                isMobileFrame && styles.deviceFrameBtnActive,
              ]}
              onPress={() => setIsMobileFrame(!isMobileFrame)}
              activeOpacity={0.8}
            >
              <Text style={styles.deviceFrameBtnText}>
                {isMobileFrame ? '📱 Phone View' : '🖥️ Full Width'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Replay Sky Landing Trigger */}
          <TouchableOpacity
            style={styles.landingChip}
            onPress={onReplayLanding}
            activeOpacity={0.8}
          >
            <Text style={styles.landingChipIcon}>🛬</Text>
            <Text style={styles.landingChipText}>Sky Land</Text>
          </TouchableOpacity>

          {/* Live Currency Selector Pill */}
          <TouchableOpacity
            style={styles.currencyBtn}
            onPress={() => setCurrencyModalOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.liveDot} />
            <Text style={styles.currencyBtnText}>
              {currency} ({CURRENCY_META[currency]?.symbol.trim()})
            </Text>
            <Text style={styles.chevron}>▾</Text>
          </TouchableOpacity>

          {/* My Tickets Wallet Button */}
          <TouchableOpacity
            style={styles.ticketsBtn}
            onPress={onOpenBookingsModal}
            activeOpacity={0.85}
          >
            <Text style={styles.ticketsIcon}>🎟️</Text>
            <Text style={styles.ticketsLabel}>Tickets</Text>
            {bookingsCount > 0 && (
              <View style={styles.ticketBadge}>
                <Text style={styles.ticketBadgeText}>{bookingsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Currency Switcher Modal */}
      <Modal
        visible={currencyModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCurrencyModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setCurrencyModalOpen(false)}
        >
          <View style={styles.currencyModalCard}>
            <View style={styles.currencyModalHeader}>
              <View>
                <Text style={styles.currencyModalTitle}>
                  Live API Currency Rates
                </Text>
                <Text style={styles.currencyModalSub}>
                  Provider: {exchangeInfo.provider} (
                  {exchangeInfo.isLive ? 'Live Sync' : 'Cached'})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setCurrencyModalOpen(false)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {Object.keys(CURRENCY_META).map((code) => {
              const meta = CURRENCY_META[code];
              const rate = exchangeInfo.rates[code] || 1;
              const isSelected = currency === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.currencyOptionRow,
                    isSelected && styles.currencyOptionSelected,
                  ]}
                  onPress={() => {
                    setCurrency(code);
                    setCurrencyModalOpen(false);
                  }}
                >
                  <View>
                    <Text
                      style={[
                        styles.currencyCodeText,
                        isSelected && styles.currencyCodeTextSelected,
                      ]}
                    >
                      {meta.label} — {meta.name}
                    </Text>
                    <Text style={styles.currencyRateSub}>
                      1 USD = {rate.toFixed(2)} {code}
                    </Text>
                  </View>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.conciergeCallStrip}
              onPress={() => Linking.openURL('tel:+919475750163')}
            >
              <Text style={styles.conciergeCallText}>
                📞 24/7 VIP Flight Desk: +91 (947575) - 0163
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(10, 35, 20, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 184, 66, 0.22)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    zIndex: 100,
  },
  headerInner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 108,
    height: 34,
  },
  vipPill: {
    backgroundColor: 'rgba(212, 184, 66, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vipPillText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  deviceFrameBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  deviceFrameBtnActive: {
    backgroundColor: 'rgba(212, 184, 66, 0.2)',
    borderColor: COLORS.gold,
  },
  deviceFrameBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  landingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.35)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },
  landingChipIcon: {
    fontSize: 12,
  },
  landingChipText: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '700',
  },
  currencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(18, 56, 33, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.emeraldLight,
  },
  currencyBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  chevron: {
    color: COLORS.gold,
    fontSize: 10,
  },
  ticketsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.goldMuted,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    ...SHADOWS.soft,
  },
  ticketsIcon: {
    fontSize: 12,
  },
  ticketsLabel: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  ticketBadge: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 14, 9, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  currencyModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    padding: 18,
    ...SHADOWS.card,
  },
  currencyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  currencyModalTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
  },
  currencyModalSub: {
    color: COLORS.emeraldLight,
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  currencyOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  currencyOptionSelected: {
    backgroundColor: 'rgba(212, 184, 66, 0.16)',
    borderColor: COLORS.gold,
  },
  currencyCodeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  currencyCodeTextSelected: {
    color: COLORS.goldLight,
  },
  currencyRateSub: {
    color: COLORS.textMutedLight,
    fontSize: 11,
    marginTop: 2,
  },
  checkMark: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: '900',
  },
  conciergeCallStrip: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
  },
  conciergeCallText: {
    color: COLORS.emeraldLight,
    fontSize: 12,
    fontWeight: '700',
  },
});
