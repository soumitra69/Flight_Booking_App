import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ASSETS } from '../data/assets';
import { COLORS, SHADOWS } from '../theme/theme';

const SHOWCASE_SLIDES = [
  {
    id: 'slide-1',
    badge: 'SCREEN 01 • SKY HUB',
    title: '60fps Sky-to-Runway Airplane Landing & Telemetry HUD',
    subtitle:
      'Flagship jet descends from 35,000 FT with wing contrails, approach lights, and tire-smoke touchdown puffs.',
    img: ASSETS.jetHero,
    accent: '#d4b842',
  },
  {
    id: 'slide-2',
    badge: 'SCREEN 02 • LIVE API BOOKING',
    title: 'Multi-Currency Flight Calculator & Live Weather Radar',
    subtitle:
      'Powered by Open Exchange Rates API, Open-Meteo Geocoding & Live Destination Aviation Weather API.',
    img: ASSETS.aboutCabin,
    accent: '#34d399',
  },
  {
    id: 'slide-3',
    badge: 'SCREEN 03 • VIP BOARDING PASS',
    title: 'Instant E-Ticket Generation & Native OS Sharing',
    subtitle:
      'Generates confirmed PNR, Gate, VIP Seat Suite, Barcode & persists tickets to AsyncStorage Wallet.',
    img: ASSETS.featureBoarding,
    accent: '#38bdf8',
  },
  {
    id: 'slide-4',
    badge: 'SCREEN 04 • EMPTY-LEG CHARTERS',
    title: 'Private Charter Legs & Executive Fleet Showcase',
    subtitle:
      'Browse discounted empty-leg flights across New Delhi, Dubai, Paris, Barcelona, London & Zurich.',
    img: ASSETS.specialOffer,
    accent: '#f59e0b',
  },
  {
    id: 'slide-5',
    badge: 'SCREEN 05 • GLOBAL DESTINATIONS',
    title: '5,000+ Private Airfields & 15-Minute VIP Boarding',
    subtitle:
      'Direct chauffeur-to-aircraft tarmac transfers with Starlink high-speed cabin connectivity.',
    img: ASSETS.destDubai,
    accent: '#a78bfa',
  },
];

export default function ScreenGallerySlider({ onBookNowPress }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const currentSlide = SHOWCASE_SLIDES[activeIndex];

  const handlePrev = () => {
    setIsAutoPlay(false);
    setActiveIndex(
      (prev) => (prev - 1 + SHOWCASE_SLIDES.length) % SHOWCASE_SLIDES.length
    );
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setActiveIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
  };

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>📸 INTERACTIVE APP SHOWCASE</Text>
            <Text style={styles.title}>
              Sliding Screen Tour & Aviation Gallery
            </Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.autoPlayBtn,
                isAutoPlay && styles.autoPlayBtnActive,
              ]}
              onPress={() => setIsAutoPlay(!isAutoPlay)}
            >
              <Text style={styles.autoPlayText}>
                {isAutoPlay ? '⏸ Auto-Sliding' : '▶ Auto-Slide'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowBtn} onPress={handlePrev}>
              <Text style={styles.arrowBtnText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowBtn} onPress={handleNext}>
              <Text style={styles.arrowBtnText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Active Slide Showcase Card */}
        <View style={styles.mainSlideCard}>
          <View style={styles.slideImageCol}>
            <Image
              source={currentSlide.img}
              style={styles.slideMainImg}
              resizeMode="cover"
            />
            <View style={styles.slideCounterPill}>
              <Text style={styles.slideCounterText}>
                {activeIndex + 1} / {SHOWCASE_SLIDES.length}
              </Text>
            </View>
          </View>

          <View style={styles.slideContentCol}>
            <View
              style={[
                styles.slideBadgePill,
                { borderColor: currentSlide.accent },
              ]}
            >
              <Text
                style={[styles.slideBadgeText, { color: currentSlide.accent }]}
              >
                {currentSlide.badge}
              </Text>
            </View>

            <Text style={styles.slideTitle}>{currentSlide.title}</Text>
            <Text style={styles.slideSubtitle}>{currentSlide.subtitle}</Text>

            {/* Pagination Dots */}
            <View style={styles.dotsRow}>
              {SHOWCASE_SLIDES.map((s, idx) => {
                const active = idx === activeIndex;
                return (
                  <TouchableOpacity
                    key={s.id}
                    onPress={() => {
                      setIsAutoPlay(false);
                      setActiveIndex(idx);
                    }}
                    style={[styles.dot, active && styles.dotActive]}
                  />
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.exploreSlideBtn}
              onPress={onBookNowPress}
            >
              <Text style={styles.exploreSlideBtnText}>
                ✈️ Try Live Booking Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal Thumbnail Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbStrip}
        >
          {SHOWCASE_SLIDES.map((slide, idx) => {
            const active = idx === activeIndex;
            return (
              <TouchableOpacity
                key={slide.id}
                style={[styles.thumbCard, active && styles.thumbCardActive]}
                onPress={() => {
                  setIsAutoPlay(false);
                  setActiveIndex(idx);
                }}
              >
                <Image
                  source={slide.img}
                  style={styles.thumbImg}
                  resizeMode="cover"
                />
                <View style={styles.thumbOverlay}>
                  <Text style={styles.thumbLabel} numberOfLines={1}>
                    0{idx + 1}. {slide.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: COLORS.primaryBg,
    paddingVertical: 26,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.2)',
  },
  container: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  kicker: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 4,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autoPlayBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  autoPlayBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: COLORS.emeraldLight,
  },
  autoPlayText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnText: {
    color: COLORS.primaryDark,
    fontSize: 16,
    fontWeight: '900',
  },
  mainSlideCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 184, 66, 0.35)',
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
    ...SHADOWS.card,
  },
  slideImageCol: {
    flex: 1.2,
    minWidth: 270,
    height: 250,
    backgroundColor: '#07170e',
    position: 'relative',
  },
  slideMainImg: {
    width: '100%',
    height: '100%',
  },
  slideCounterPill: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(7, 23, 14, 0.88)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slideCounterText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
  },
  slideContentCol: {
    flex: 1,
    minWidth: 260,
    padding: 20,
    justifyContent: 'center',
  },
  slideBadgePill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  slideBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  slideTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginBottom: 8,
  },
  slideSubtitle: {
    color: COLORS.textMutedLight,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 16,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  dotActive: {
    width: 26,
    backgroundColor: COLORS.gold,
  },
  exploreSlideBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.gold,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  exploreSlideBtnText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '900',
  },
  thumbStrip: {
    gap: 10,
    paddingVertical: 4,
  },
  thumbCard: {
    width: 195,
    height: 92,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.14)',
    position: 'relative',
  },
  thumbCardActive: {
    borderColor: COLORS.gold,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(7, 23, 14, 0.86)',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  thumbLabel: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
