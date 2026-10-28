import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Share,
  StyleSheet,
} from 'react-native';
import { COLORS, SHADOWS } from '../theme/theme';

export function MyTicketsContent({
  bookings,
  onClose,
  onBookFirstFlight,
  isEmbedded = false,
}) {
  const handleShareTicket = async (t) => {
    const msg = `✈️ JETLY VIP E-TICKET (${t.pnr})\nPassenger: ${t.passengerName}\nRoute: ${t.origin.city} (${t.origin.code}) → ${t.destination.city} (${t.destination.code})\nDate: ${t.date} at ${t.departureTime}\nAircraft: ${t.aircraft} (${t.tierName})\nGate: ${t.gate} • Seat: ${t.seat}\nRate: ${t.priceFormatted}`;
    try {
      await Share.share({
        title: `Jetly Ticket ${t.pnr}`,
        message: msg,
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={[styles.card, isEmbedded && styles.cardEmbedded]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          🎟️ My Booked Flight Tickets ({bookings.length})
        </Text>
        {!isEmbedded && onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛫</Text>
          <Text style={styles.emptyTitle}>
            You haven't booked any flight tickets yet.
          </Text>
          <Text style={styles.emptySub}>
            Reserve a private charter or VIP seat in the Live API Booking Engine
            and your boarding passes will appear here automatically.
          </Text>
          <TouchableOpacity
            style={styles.bookFirstBtn}
            onPress={onBookFirstFlight}
          >
            <Text style={styles.bookFirstBtnText}>
              Book Your First Flight Now
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.listScroll}
          showsVerticalScrollIndicator={false}
        >
          {bookings.map((t, index) => (
            <View key={`${t.pnr}-${index}`} style={styles.ticketItem}>
              <View style={styles.ticketTopRow}>
                <View style={styles.pnrBadge}>
                  <Text style={styles.pnrBadgeText}>{t.pnr}</Text>
                </View>
                <Text style={styles.tierNameText} numberOfLines={1}>
                  {t.tierName}
                </Text>
                <Text style={styles.priceText}>{t.priceFormatted}</Text>
              </View>

              <View style={styles.routeRow}>
                <Text style={styles.cityText}>
                  {t.origin.city} ({t.origin.code})
                </Text>
                <Text style={styles.durationArrow}>
                  ✈️ {t.durationText}
                </Text>
                <Text style={styles.cityText}>
                  {t.destination.city} ({t.destination.code})
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaItem}>👤 {t.passengerName}</Text>
                <Text style={styles.metaItem}>
                  📅 {t.date} at {t.departureTime}
                </Text>
                <Text style={styles.metaItem}>
                  🚪 {t.gate} • 💺 {t.seat}
                </Text>
              </View>

              <View style={styles.ticketActionsRow}>
                <Text style={styles.aircraftSubText}>
                  🛩️ {t.aircraft} • {t.distanceKm} km
                </Text>
                <TouchableOpacity
                  style={styles.shareChip}
                  onPress={() => handleShareTicket(t)}
                >
                  <Text style={styles.shareChipText}>📤 Share Pass</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default function MyTicketsModal({
  visible,
  bookings,
  onClose,
  onBookFirstFlight,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalWrap}
          onPress={(e) => e.stopPropagation()}
        >
          <MyTicketsContent
            bookings={bookings}
            onClose={onClose}
            onBookFirstFlight={onBookFirstFlight}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 15, 9, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalWrap: {
    width: '100%',
    maxWidth: 560,
  },
  card: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    padding: 18,
    maxHeight: 560,
    ...SHADOWS.card,
  },
  cardEmbedded: {
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 20,
    maxHeight: 9999,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 14,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySub: {
    color: COLORS.textMutedLight,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 400,
    marginBottom: 16,
  },
  bookFirstBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 22,
  },
  bookFirstBtnText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },
  listScroll: {
    maxHeight: 440,
  },
  ticketItem: {
    backgroundColor: 'rgba(7, 23, 14, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.3)',
    padding: 14,
    marginBottom: 10,
  },
  ticketTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  pnrBadge: {
    backgroundColor: 'rgba(212, 184, 66, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pnrBadgeText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
  },
  tierNameText: {
    flex: 1,
    color: COLORS.textMutedLight,
    fontSize: 11,
    fontWeight: '600',
  },
  priceText: {
    color: COLORS.emeraldLight,
    fontSize: 15,
    fontWeight: '900',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  cityText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  durationArrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  metaItem: {
    color: COLORS.textMutedLight,
    fontSize: 11,
  },
  ticketActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  aircraftSubText: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '600',
  },
  shareChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  shareChipText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
