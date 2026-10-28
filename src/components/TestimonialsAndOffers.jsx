import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  TESTIMONIALS,
  CHARTER_LEGS,
  POPULAR_DESTINATIONS,
} from '../data/siteData';
import { ASSETS } from '../data/assets';
import { formatCurrencyPrice } from '../services/flightApi';
import { COLORS, SHADOWS } from '../theme/theme';

export default function TestimonialsAndOffers({
  currency,
  exchangeInfo,
  onSelectRouteAndScroll,
}) {
  const [legStartIndex, setLegStartIndex] = useState(0);
  const [copiedPromo, setCopiedPromo] = useState(false);

  const visibleLegs = [
    CHARTER_LEGS[legStartIndex % CHARTER_LEGS.length],
    CHARTER_LEGS[(legStartIndex + 1) % CHARTER_LEGS.length],
  ];

  const handlePrevLegs = () => {
    setLegStartIndex(
      (prev) => (prev - 1 + CHARTER_LEGS.length) % CHARTER_LEGS.length
    );
  };

  const handleNextLegs = () => {
    setLegStartIndex((prev) => (prev + 1) % CHARTER_LEGS.length);
  };

  const handleCopyAndClaimPromo = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('JETLY20').catch(() => {});
      }
    } catch {
      // ignore
    }
    setCopiedPromo(true);
    setTimeout(() => setCopiedPromo(false), 3000);
  };

  return (
    <View style={styles.wrapper}>
      {/* 1. Customer Feedback Section */}
      <View style={styles.testimonialsSection}>
        <View style={styles.container}>
          <Text style={styles.kicker}>💬 CUSTOMER FEEDBACK</Text>
          <Text style={styles.titleDark}>
            What they're talking about our flight service
          </Text>

          <View style={styles.testimonialsGrid}>
            {TESTIMONIALS.map((item) => (
              <View key={item.id} style={styles.testimonialCard}>
                <View style={styles.routeTagPill}>
                  <Text style={styles.routeTagText}>✈️ {item.route}</Text>
                </View>

                <Text style={styles.quoteText}>"{item.quote}"</Text>

                <View style={styles.customerFooter}>
                  <Image
                    source={item.avatar}
                    style={styles.avatarImg}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.starsRow}>
                      {Array.from({ length: item.rating }).map((_, idx) => (
                        <Text key={idx} style={styles.starIcon}>
                          ⭐
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.customerName}>{item.name}</Text>
                    <Text style={styles.customerRole}>{item.role}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 2. Special Offer 20% Banner */}
      <View style={styles.specialOfferSection}>
        <View style={styles.container}>
          <View style={styles.offerBannerCard}>
            <View style={styles.offerTextCol}>
              <Text style={styles.offerBadgeKicker}>
                👑 SPECIAL OFFER • SAVE 20%
              </Text>
              <Text style={styles.offerHeadline}>
                The best service for business people who appreciate time
              </Text>
              <Text style={styles.offerSubtext}>
                Book any private charter or executive seat ticket today and use
                promo code <Text style={styles.promoHighlight}>JETLY20</Text> in
                our live API booking engine for an instant 20% executive
                discount.
              </Text>

              <View style={styles.offerButtonsRow}>
                <TouchableOpacity
                  style={styles.claimOfferBtn}
                  onPress={() =>
                    onSelectRouteAndScroll({
                      fromCode: 'DEL',
                      fromCity: 'New Delhi',
                      toCode: 'DXB',
                      toCity: 'Dubai',
                      promoCode: 'JETLY20',
                    })
                  }
                >
                  <Text style={styles.claimOfferBtnText}>
                    Claim 20% Offer & Book
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.copyPromoBtn}
                  onPress={handleCopyAndClaimPromo}
                >
                  <Text style={styles.copyPromoBtnText}>
                    🎟️ {copiedPromo ? 'Copied JETLY20!' : 'Copy Code: JETLY20'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.offerImgCol}>
              <Image
                source={ASSETS.specialOffer}
                style={styles.offerImg}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </View>

      {/* 3. Private Flights / Charter Legs Carousel Section */}
      <View style={styles.charterLegsSection}>
        <View style={styles.container}>
          <View style={styles.charterGrid}>
            <View style={styles.charterIntroCol}>
              <Text style={styles.kickerGold}>✈️ PRIVATE FLIGHTS</Text>
              <Text style={styles.titleLight}>Browse legs of our charters</Text>
              <Text style={styles.charterSubLight}>
                Take advantage of live empty-leg and scheduled private jet
                charters with instant live currency rates and immediate runway
                clearance.
              </Text>

              <View style={styles.navArrowsRow}>
                <TouchableOpacity
                  style={styles.navArrowBtn}
                  onPress={handlePrevLegs}
                >
                  <Text style={styles.navArrowText}>← Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navArrowBtn}
                  onPress={handleNextLegs}
                >
                  <Text style={styles.navArrowText}>Next →</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.legsCardsRow}>
              {visibleLegs.map((leg) => {
                const formattedRate = formatCurrencyPrice(
                  leg.priceUsd,
                  currency,
                  exchangeInfo.rates
                );
                return (
                  <View key={leg.id} style={styles.legCard}>
                    <View style={styles.legHeader}>
                      <View>
                        <Text style={styles.legEndpointSmall}>Departure</Text>
                        <Text style={styles.legEndpointBold}>
                          {leg.fromCity} ({leg.fromCode})
                        </Text>
                      </View>
                      <Text style={styles.legPlaneDivider}>✈️</Text>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.legEndpointSmall}>Arrival</Text>
                        <Text style={styles.legEndpointBold}>
                          {leg.toCity} ({leg.toCode})
                        </Text>
                      </View>
                    </View>

                    <View style={styles.legCardBody}>
                      <Image
                        source={ASSETS.plane}
                        style={styles.legPlaneImg}
                        resizeMode="contain"
                      />
                      <View style={styles.legAircraftBadge}>
                        <Text style={styles.legAircraftBadgeText}>
                          {leg.aircraft}
                        </Text>
                      </View>
                      <Text style={styles.legMetaText}>Date: {leg.date}</Text>
                      <Text style={styles.legMetaText}>
                        Dep: {leg.departure} • Arr: {leg.arrival}
                      </Text>
                      <Text style={styles.legPriceText}>
                        Starting From:{' '}
                        <Text style={styles.legPriceHighlight}>
                          {formattedRate}
                        </Text>
                      </Text>
                      <Text style={styles.legMetaText}>
                        Passengers: {leg.persons}
                      </Text>

                      <TouchableOpacity
                        style={styles.legBookNowBtn}
                        onPress={() =>
                          onSelectRouteAndScroll({
                            fromCode: leg.fromCode,
                            fromCity: leg.fromCity,
                            toCode: leg.toCode,
                            toCity: leg.toCity,
                          })
                        }
                      >
                        <Text style={styles.legBookNowBtnText}>
                          Book Now →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* 4. Popular Jet Charter Destinations Section */}
      <View style={styles.destinationsSection}>
        <View style={styles.container}>
          <Text style={styles.kicker}>🌎 WHAT WILL YOU GET</Text>
          <Text style={styles.titleDark}>
            Checkout the popular jet Charter Destinations
          </Text>

          <View style={styles.destGrid}>
            {POPULAR_DESTINATIONS.map((dest) => {
              const formattedDestPrice = formatCurrencyPrice(
                dest.priceUsd,
                currency,
                exchangeInfo.rates
              );
              return (
                <TouchableOpacity
                  key={dest.id}
                  activeOpacity={0.9}
                  style={styles.destCard}
                  onPress={() =>
                    onSelectRouteAndScroll({
                      fromCode: dest.fromCode,
                      fromCity: dest.fromCity,
                      toCode: dest.toCode,
                      toCity: dest.toCity,
                    })
                  }
                >
                  <View style={styles.destImgWrap}>
                    <Image
                      source={dest.img}
                      style={styles.destImg}
                      resizeMode="cover"
                    />
                    <View style={styles.destPriceBadge}>
                      <Text style={styles.destPriceBadgeText}>
                        From {formattedDestPrice}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.destCardContent}>
                    <View style={styles.destTagPill}>
                      <Text style={styles.destTagPillText}>{dest.tag}</Text>
                    </View>
                    <Text style={styles.destTitle}>{dest.title}</Text>
                    <Text style={styles.destSchedule}>
                      Departure: {dest.departure} • Arrival: {dest.arrival}
                    </Text>
                    <View style={styles.destBookLink}>
                      <Text style={styles.destBookLinkText}>
                        Select & Book Route 🛫
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.ivoryBg,
  },
  container: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
  },
  testimonialsSection: {
    paddingVertical: 28,
    paddingHorizontal: 14,
  },
  kicker: {
    color: COLORS.goldMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    textAlign: 'center',
    marginBottom: 6,
  },
  kickerGold: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  titleDark: {
    color: COLORS.primaryGreen,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
  },
  titleLight: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 10,
  },
  testimonialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  testimonialCard: {
    flexGrow: 1,
    flexBasis: 280,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    justifyContent: 'space-between',
    ...SHADOWS.soft,
  },
  routeTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(18, 56, 33, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  routeTagText: {
    color: COLORS.primaryGreen,
    fontSize: 11,
    fontWeight: '800',
  },
  quoteText: {
    color: COLORS.textMutedDark,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  customerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0efe9',
  },
  avatarImg: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 2,
  },
  starIcon: {
    fontSize: 11,
  },
  customerName: {
    color: COLORS.primaryGreen,
    fontSize: 14,
    fontWeight: '800',
  },
  customerRole: {
    color: COLORS.textMutedDark,
    fontSize: 11,
  },
  specialOfferSection: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  offerBannerCard: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gold,
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...SHADOWS.card,
  },
  offerTextCol: {
    flex: 1.2,
    minWidth: 270,
    padding: 22,
    justifyContent: 'center',
  },
  offerBadgeKicker: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  offerHeadline: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 31,
    marginBottom: 10,
  },
  offerSubtext: {
    color: COLORS.textMutedLight,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  promoHighlight: {
    color: COLORS.gold,
    fontWeight: '900',
  },
  offerButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  claimOfferBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  claimOfferBtnText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },
  copyPromoBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  copyPromoBtnText: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: '800',
  },
  offerImgCol: {
    flex: 1,
    minWidth: 250,
    minHeight: 220,
  },
  offerImg: {
    width: '100%',
    height: '100%',
    minHeight: 220,
  },
  charterLegsSection: {
    backgroundColor: COLORS.primaryBg,
    paddingVertical: 28,
    paddingHorizontal: 14,
    marginTop: 18,
  },
  charterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    alignItems: 'center',
  },
  charterIntroCol: {
    flex: 1,
    minWidth: 260,
  },
  charterSubLight: {
    color: COLORS.textMutedLight,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  navArrowsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  navArrowBtn: {
    backgroundColor: 'rgba(212, 184, 66, 0.16)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  navArrowText: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: '800',
  },
  legsCardsRow: {
    flex: 2,
    minWidth: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  legCard: {
    flex: 1,
    minWidth: 245,
    backgroundColor: COLORS.cardDark,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.3)',
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  legHeader: {
    backgroundColor: 'rgba(7, 23, 14, 0.9)',
    padding: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 184, 66, 0.2)',
  },
  legEndpointSmall: {
    color: COLORS.textMutedLight,
    fontSize: 10,
  },
  legEndpointBold: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  legPlaneDivider: {
    fontSize: 16,
  },
  legCardBody: {
    padding: 16,
    alignItems: 'center',
  },
  legPlaneImg: {
    width: 140,
    height: 45,
    marginBottom: 8,
  },
  legAircraftBadge: {
    backgroundColor: 'rgba(212, 184, 66, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  legAircraftBadgeText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
  },
  legMetaText: {
    color: COLORS.textMutedLight,
    fontSize: 12,
    marginBottom: 4,
  },
  legPriceText: {
    color: COLORS.white,
    fontSize: 13,
    marginVertical: 4,
  },
  legPriceHighlight: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '900',
  },
  legBookNowBtn: {
    marginTop: 10,
    backgroundColor: COLORS.gold,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  legBookNowBtnText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '900',
  },
  destinationsSection: {
    paddingVertical: 28,
    paddingHorizontal: 14,
  },
  destGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  destCard: {
    flexGrow: 1,
    flexBasis: 270,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  destImgWrap: {
    height: 185,
    position: 'relative',
  },
  destImg: {
    width: '100%',
    height: '100%',
  },
  destPriceBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.primaryGreen,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  destPriceBadgeText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '800',
  },
  destCardContent: {
    padding: 15,
  },
  destTagPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(167, 145, 50, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  destTagPillText: {
    color: COLORS.goldMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  destTitle: {
    color: COLORS.primaryGreen,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  destSchedule: {
    color: COLORS.textMutedDark,
    fontSize: 12,
    marginBottom: 10,
  },
  destBookLink: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0efe9',
  },
  destBookLinkText: {
    color: COLORS.primaryGreen,
    fontSize: 12,
    fontWeight: '800',
  },
});
