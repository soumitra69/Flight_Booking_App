import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../theme/theme';

const TABS = [
  { id: 'home', label: 'Sky Hub', icon: '✈️' },
  { id: 'book', label: 'Book Jet', icon: '🛫' },
  { id: 'charters', label: 'Charters', icon: '🧭' },
  { id: 'services', label: 'Services', icon: '👑' },
  { id: 'tickets', label: 'My Tickets', icon: '🎟️' },
];

export default function BottomTabBar({
  activeTab,
  onSelectTab,
  bookingsCount,
}) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarInner}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              activeOpacity={0.8}
              onPress={() => onSelectTab(tab.id)}
            >
              <View style={styles.iconWrap}>
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                  {tab.icon}
                </Text>
                {tab.id === 'tickets' && bookingsCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{bookingsCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: 'rgba(8, 26, 15, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 184, 66, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    ...SHADOWS.card,
  },
  tabBarInner: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 12,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: 'rgba(212, 184, 66, 0.13)',
  },
  iconWrap: {
    position: 'relative',
    marginBottom: 2,
  },
  tabIcon: {
    fontSize: 17,
    opacity: 0.72,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    color: COLORS.textMutedLight,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.gold,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.gold,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.primaryDark,
    fontSize: 9,
    fontWeight: '900',
  },
});
