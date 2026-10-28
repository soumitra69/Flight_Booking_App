import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import HeaderBar from './src/components/HeaderBar';
import BottomTabBar from './src/components/BottomTabBar';
import HeroSkyLanding from './src/components/HeroSkyLanding';
import ScreenGallerySlider from './src/components/ScreenGallerySlider';
import AboutSection from './src/components/AboutSection';
import FlightBookingSection from './src/components/FlightBookingSection';
import ServicesSection from './src/components/ServicesSection';
import TestimonialsAndOffers from './src/components/TestimonialsAndOffers';
import FooterSection from './src/components/FooterSection';
import MyTicketsModal, { MyTicketsContent } from './src/components/MyTicketsModal';
import { fetchLiveExchangeRates, FALLBACK_RATES } from './src/services/flightApi';
import { loadBookedTickets, saveBookedTickets } from './src/services/storage';
import { COLORS } from './src/theme/theme';

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const isWideScreen = windowWidth >= 820;

  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [currency, setCurrency] = useState('USD');
  const [exchangeInfo, setExchangeInfo] = useState({
    rates: FALLBACK_RATES,
    isLive: false,
    provider: 'Syncing Live API...',
  });

  const [landingTriggerKey, setLandingTriggerKey] = useState(0);
  const [prefilledRoute, setPrefilledRoute] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  const scrollRef = useRef(null);
  const sectionOffsets = useRef({
    home: 0,
    about: 520,
    book: 1100,
    services: 2100,
    charters: 2800,
  });

  // Load persisted tickets & live currency rates on mount
  useEffect(() => {
    let mounted = true;
    loadBookedTickets().then((saved) => {
      if (mounted && Array.isArray(saved)) {
        setBookings(saved);
      }
    });

    fetchLiveExchangeRates().then((data) => {
      if (mounted && data) {
        setExchangeInfo(data);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleBookingConfirmed = (ticket) => {
    setBookings((prev) => {
      const updated = [ticket, ...prev];
      saveBookedTickets(updated);
      return updated;
    });
  };

  const scrollToSection = (sectionKey) => {
    if (sectionKey === 'tickets') {
      setActiveTab('tickets');
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setActiveTab(sectionKey);
    setTimeout(() => {
      const y = sectionOffsets.current[sectionKey] ?? 0;
      scrollRef.current?.scrollTo({ y, animated: true });
    }, 60);
  };

  const handleSelectRouteAndScroll = (routeObj) => {
    setPrefilledRoute({ ...routeObj, ts: Date.now() });
    scrollToSection('book');
  };

  const handleReplayLanding = () => {
    setActiveTab('home');
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setLandingTriggerKey((k) => k + 1);
  };

  const recordSectionOffset = (key) => (e) => {
    const y = e?.nativeEvent?.layout?.y;
    if (typeof y === 'number') {
      sectionOffsets.current[key] = y;
    }
  };

  return (
    <SafeAreaView style={styles.outerBackground}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <View
        style={[
          styles.appShell,
          isWideScreen && isMobileFrame && styles.mobileSimulatorShell,
        ]}
      >
        {/* Top Sticky Navigation & Live Currency Bar */}
        <HeaderBar
          currency={currency}
          setCurrency={setCurrency}
          exchangeInfo={exchangeInfo}
          bookingsCount={bookings.length}
          onOpenBookingsModal={() => setShowBookingsModal(true)}
          onReplayLanding={handleReplayLanding}
          onNavigateSection={scrollToSection}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          isWideScreen={isWideScreen}
        />

        {/* Main Scrollable Content Area */}
        <ScrollView
          ref={scrollRef}
          style={styles.mainScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'tickets' ? (
            <View style={styles.ticketsTabWrapper}>
              <MyTicketsContent
                bookings={bookings}
                isEmbedded
                onBookFirstFlight={() => scrollToSection('book')}
              />
              <FooterSection
                onReplayLanding={handleReplayLanding}
                onNavigateSection={scrollToSection}
              />
            </View>
          ) : (
            <>
              {/* 1. Sky-to-Runway Airplane Landing Hero */}
              <View onLayout={recordSectionOffset('home')}>
                <HeroSkyLanding
                  landingTriggerKey={landingTriggerKey}
                  onBookNowPress={() => scrollToSection('book')}
                />
              </View>

              {/* 1B. Interactive Sliding Screen Tour & Aviation Gallery */}
              <ScreenGallerySlider
                onBookNowPress={() => scrollToSection('book')}
              />

              {/* 2. About Jetly & Feature Gallery */}
              <View onLayout={recordSectionOffset('about')}>
                <AboutSection
                  onDiscoverBookPress={() => scrollToSection('book')}
                />
              </View>

              {/* 3. Live API Flight Ticket Booking & Rate Calculator */}
              <View onLayout={recordSectionOffset('book')}>
                <FlightBookingSection
                  currency={currency}
                  setCurrency={setCurrency}
                  exchangeInfo={exchangeInfo}
                  prefilledRoute={prefilledRoute}
                  onBookingConfirmed={handleBookingConfirmed}
                />
              </View>

              {/* 4. Executive Charter Services */}
              <View onLayout={recordSectionOffset('services')}>
                <ServicesSection
                  currency={currency}
                  exchangeInfo={exchangeInfo}
                  onBookServicePress={() => scrollToSection('book')}
                />
              </View>

              {/* 5. Testimonials, 20% Special Offer, Empty-Leg Charters & Destinations */}
              <View onLayout={recordSectionOffset('charters')}>
                <TestimonialsAndOffers
                  currency={currency}
                  exchangeInfo={exchangeInfo}
                  onSelectRouteAndScroll={handleSelectRouteAndScroll}
                />
              </View>

              {/* 6. Luxury Aviation Footer */}
              <FooterSection
                onReplayLanding={handleReplayLanding}
                onNavigateSection={scrollToSection}
              />
            </>
          )}
        </ScrollView>

        {/* Native Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onSelectTab={scrollToSection}
          bookingsCount={bookings.length}
        />

        {/* Saved Tickets / My Bookings Modal */}
        <MyTicketsModal
          visible={showBookingsModal}
          bookings={bookings}
          onClose={() => setShowBookingsModal(false)}
          onBookFirstFlight={() => {
            setShowBookingsModal(false);
            scrollToSection('book');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: '#040e08',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appShell: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.primaryDark,
    overflow: 'hidden',
  },
  mobileSimulatorShell: {
    maxWidth: 430,
    maxHeight: '95%',
    borderRadius: 34,
    borderWidth: 3,
    borderColor: COLORS.gold,
    marginVertical: 12,
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  ticketsTabWrapper: {
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: COLORS.primaryDark,
    flex: 1,
    justifyContent: 'space-between',
  },
});
