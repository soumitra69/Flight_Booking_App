import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Easing,
  Share,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  POPULAR_AIRPORTS,
  CURRENCY_META,
  searchLocationsApi,
  fetchDestinationWeather,
  generateFlightOffers,
  formatCurrencyPrice,
} from '../services/flightApi';
import { ASSETS } from '../data/assets';
import { COLORS, SHADOWS } from '../theme/theme';

const BAGGAGE_OPTIONS = [
  { id: 'light', label: 'Light (15kg)', sub: 'Cabin Only' },
  { id: 'medium', label: 'Medium (30kg)', sub: 'Standard +7%' },
  { id: 'heavy', label: 'Heavy VIP (60kg)', sub: 'Trunk/Golf +15%' },
];

const PASSENGER_COUNTS = [1, 2, 3, 4, 6, 8, 12];

export default function FlightBookingSection({
  currency,
  setCurrency,
  exchangeInfo,
  prefilledRoute,
  onBookingConfirmed,
}) {
  const getFutureDateStr = (daysAhead) =>
    new Date(Date.now() + 86400000 * daysAhead).toISOString().split('T')[0];

  const [origin, setOrigin] = useState(POPULAR_AIRPORTS[0]); // New Delhi (DEL)
  const [destination, setDestination] = useState(POPULAR_AIRPORTS[4]); // Dubai (DXB)
  const [originQuery, setOriginQuery] = useState('New Delhi (DEL)');
  const [destQuery, setDestQuery] = useState('Dubai (DXB)');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showOriginDrop, setShowOriginDrop] = useState(false);
  const [showDestDrop, setShowDestDrop] = useState(false);

  const [departureDate, setDepartureDate] = useState(getFutureDateStr(2));
  const [returnDate, setReturnDate] = useState('');
  const [baggage, setBaggage] = useState('medium');
  const [passengers, setPassengers] = useState(2);
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const [destWeather, setDestWeather] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [offers, setOffers] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('jet-seat-share');

  const [isLandingAnim, setIsLandingAnim] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  // Animated Radar Plane & Booking Modal Jet
  const radarPlaneAnim = useRef(new Animated.Value(0)).current;
  const bookingFlightAnim = useRef(new Animated.Value(0)).current;

  // Continuous radar plane loop
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(radarPlaneAnim, {
          toValue: 1,
          duration: 3800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(radarPlaneAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [radarPlaneAnim]);

  // Sync prefilled route when user taps "Book Now" on a Charter Leg or Popular Destination
  useEffect(() => {
    if (prefilledRoute) {
      const foundOrigin =
        POPULAR_AIRPORTS.find(
          (a) =>
            a.city.toLowerCase() === prefilledRoute.fromCity?.toLowerCase() ||
            a.code === prefilledRoute.fromCode
        ) || POPULAR_AIRPORTS[0];

      const foundDest =
        POPULAR_AIRPORTS.find(
          (a) =>
            a.city.toLowerCase() === prefilledRoute.toCity?.toLowerCase() ||
            a.code === prefilledRoute.toCode
        ) || POPULAR_AIRPORTS[4];

      setOrigin(foundOrigin);
      setDestination(foundDest);
      setOriginQuery(`${foundOrigin.city} (${foundOrigin.code})`);
      setDestQuery(`${foundDest.city} (${foundDest.code})`);
      if (prefilledRoute.promoCode) {
        setPromoCode(prefilledRoute.promoCode);
      }
      setConfirmedTicket(null);
    }
  }, [prefilledRoute]);

  // Fetch live destination weather and calculate live offers whenever route/pax/baggage changes
  useEffect(() => {
    let active = true;
    async function loadLiveFlightData() {
      setLoadingApi(true);
      const calculatedOffers = generateFlightOffers({
        origin,
        destination,
        passengers,
        baggage,
        date: departureDate,
      });
      if (active) {
        setOffers(calculatedOffers);
      }

      const weather = await fetchDestinationWeather(
        destination.lat,
        destination.lon
      );
      if (active) {
        setDestWeather(weather);
        setLoadingApi(false);
      }
    }
    loadLiveFlightData();
    return () => {
      active = false;
    };
  }, [origin, destination, passengers, baggage, departureDate]);

  const handleOriginInput = async (val) => {
    setOriginQuery(val);
    setShowOriginDrop(true);
    setShowDestDrop(false);
    const results = await searchLocationsApi(val);
    setOriginSuggestions(results);
  };

  const handleDestInput = async (val) => {
    setDestQuery(val);
    setShowDestDrop(true);
    setShowOriginDrop(false);
    const results = await searchLocationsApi(val);
    setDestSuggestions(results);
  };

  const selectOriginAirport = (loc) => {
    setOrigin(loc);
    setOriginQuery(`${loc.city} (${loc.code})`);
    setShowOriginDrop(false);
  };

  const selectDestAirport = (loc) => {
    setDestination(loc);
    setDestQuery(`${loc.city} (${loc.code})`);
    setShowDestDrop(false);
  };

  const swapRoute = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
    setOriginQuery(`${destination.city} (${destination.code})`);
    setDestQuery(`${tempOrigin.city} (${tempOrigin.code})`);
  };

  const selectedOffer =
    offers.find((o) => o.id === selectedOfferId) || offers[0];

  const isPromoValid = promoCode.trim().toUpperCase() === 'JETLY20';
  const discountMultiplier = isPromoValid ? 0.8 : 1;

  const handleBookTicket = (offerToBook = selectedOffer) => {
    if (!offerToBook) return;

    setIsLandingAnim(true);
    setConfirmedTicket(null);
    bookingFlightAnim.setValue(0);

    Animated.timing(bookingFlightAnim, {
      toValue: 1,
      duration: 1850,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const finalUsd = Math.round(offerToBook.baseUsd * discountMultiplier);
    const finalFormattedPrice = formatCurrencyPrice(
      finalUsd,
      currency,
      exchangeInfo.rates
    );

    const newTicket = {
      pnr: 'JTL-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      passengerName: passengerName.trim() || 'VIP Charter Guest',
      passengerEmail: passengerEmail.trim() || 'vip@jetly-aviation.com',
      origin: offerToBook.origin,
      destination: offerToBook.destination,
      date: departureDate || getFutureDateStr(2),
      returnDate: returnDate || 'One-Way Charter',
      departureTime: offerToBook.departureTime,
      durationText: offerToBook.durationText,
      distanceKm: offerToBook.distanceKm,
      aircraft: offerToBook.aircraft,
      tierName: offerToBook.tierName,
      passengers,
      baggage: baggage.toUpperCase(),
      gate: 'VIP-0' + (Math.floor(Math.random() * 4) + 1),
      seat:
        passengers > 1
          ? `1A - ${passengers}A (VIP Suite)`
          : '1A (Window Suite)',
      priceFormatted: finalFormattedPrice,
      currency,
      weather: destWeather,
      bookedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setTimeout(() => {
      setIsLandingAnim(false);
      setConfirmedTicket(newTicket);
      if (onBookingConfirmed) {
        onBookingConfirmed(newTicket);
      }
    }, 1900);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__jetlyBookDemo = () => {
        const offerToBook = offers[0];
        if (!offerToBook) return;
        const demoTicket = {
          pnr: 'JTL-98K4V',
          passengerName: 'Soumitra Samanta',
          passengerEmail: 'soumitra@jetly-aviation.com',
          origin: offerToBook.origin,
          destination: offerToBook.destination,
          date: departureDate,
          returnDate: 'One-Way Charter',
          departureTime: offerToBook.departureTime,
          durationText: offerToBook.durationText,
          distanceKm: offerToBook.distanceKm,
          aircraft: offerToBook.aircraft,
          tierName: offerToBook.tierName,
          passengers: 2,
          baggage: 'MEDIUM',
          gate: 'VIP-02',
          seat: '1A - 2A (VIP Suite)',
          priceFormatted: '$1,308',
          currency: 'USD',
          weather: destWeather || { tempC: 28, windSpeedKmh: 12, condition: 'Clear Sky • CAVOK' },
          bookedAt: '09:41 AM',
        };
        setPromoCode('JETLY20');
        setPassengerName('Soumitra Samanta');
        setConfirmedTicket(demoTicket);
        if (onBookingConfirmed) onBookingConfirmed(demoTicket);
      };
    }
  }, [offers, destWeather, departureDate]);

  const handleShareBoardingPass = async (ticket) => {
    const shareMessage = `✈️ JETLY VIP BOARDING PASS (${ticket.pnr})\nPassenger: ${ticket.passengerName}\nRoute: ${ticket.origin.city} (${ticket.origin.code}) → ${ticket.destination.city} (${ticket.destination.code})\nAircraft: ${ticket.aircraft} (${ticket.tierName})\nDate: ${ticket.date} at ${ticket.departureTime}\nGate: ${ticket.gate} • Seat: ${ticket.seat}\nTotal Rate: ${ticket.priceFormatted}`;
    try {
      await Share.share({
        title: `Jetly Boarding Pass ${ticket.pnr}`,
        message: shareMessage,
      });
    } catch {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.print) {
        window.print();
      }
    }
  };

  const radarTranslateX = radarPlaneAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-65, 65],
  });

  const modalJetTranslateX = bookingFlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 90],
  });

  const modalJetTranslateY = bookingFlightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [10, -22, 6],
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.cardContainer}>
        {/* Top Header & Live Exchange Rate Strip */}
        <View style={styles.topBar}>
          <View style={styles.titleBlock}>
            <Text style={styles.kickerText}>
              📡 GET YOUR FLIGHT • LIVE API RATE ENGINE
            </Text>
            <Text style={styles.sectionTitle}>
              Book Flight Ticket & Private Charter
            </Text>
          </View>

          <View style={styles.apiStatusCard}>
            <View style={styles.apiPillRow}>
              <View style={styles.greenDot} />
              <Text style={styles.apiStatusText}>
                Live Rate:{' '}
                <Text style={styles.apiStatusBold}>
                  1 USD = {exchangeInfo.rates[currency]?.toFixed(2)} {currency}
                </Text>
              </Text>
            </View>
            <View style={styles.currencyPillsRow}>
              {Object.keys(CURRENCY_META).map((code) => {
                const active = currency === code;
                return (
                  <TouchableOpacity
                    key={code}
                    style={[
                      styles.currChip,
                      active && styles.currChipActive,
                    ]}
                    onPress={() => setCurrency(code)}
                  >
                    <Text
                      style={[
                        styles.currChipText,
                        active && styles.currChipTextActive,
                      ]}
                    >
                      {code}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Animated Live Flight Route Radar Banner */}
        <View style={styles.radarBanner}>
          <View style={styles.radarEndpoint}>
            <Text style={styles.endpointLabel}>DEPARTURE</Text>
            <Text style={styles.endpointCode}>{origin.code}</Text>
            <Text style={styles.endpointCity} numberOfLines={1}>
              {origin.city}, {origin.country}
            </Text>
          </View>

          <View style={styles.radarTrackCenter}>
            <View style={styles.trackMetricsRow}>
              <Text style={styles.trackMetricItem}>
                🧭 {selectedOffer?.distanceKm?.toLocaleString() || 2200} km
              </Text>
              <Text style={styles.trackMetricItem}>
                ⏱️ Est. {selectedOffer?.durationText || '2h 45m'}
              </Text>
            </View>

            <View style={styles.radarLineWrap}>
              <View style={styles.originDot} />
              <View style={styles.dashedTrackLine} />
              <Animated.View
                style={[
                  styles.flyingPlaneBadge,
                  { transform: [{ translateX: radarTranslateX }] },
                ]}
              >
                <Text style={styles.flyingPlaneEmoji}>✈️</Text>
              </Animated.View>
              <View style={styles.destDot} />
            </View>

            {destWeather && (
              <View style={styles.weatherChip}>
                <Text style={styles.weatherChipText}>
                  🌤️ {destination.city}: {destWeather.tempC}°C •{' '}
                  {destWeather.condition}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.radarEndpoint, styles.radarEndpointRight]}>
            <Text style={styles.endpointLabel}>ARRIVAL & LANDING</Text>
            <Text style={styles.endpointCode}>{destination.code}</Text>
            <Text style={styles.endpointCity} numberOfLines={1}>
              {destination.city}, {destination.country}
            </Text>
          </View>
        </View>

        {/* Quick Popular Instant Route Chips */}
        <View style={styles.quickRoutesRow}>
          <Text style={styles.quickRoutesLabel}>Instant Routes:</Text>
          {[
            { from: POPULAR_AIRPORTS[0], to: POPULAR_AIRPORTS[4], label: 'Delhi ✈ Dubai' },
            { from: POPULAR_AIRPORTS[0], to: POPULAR_AIRPORTS[1], label: 'Delhi ✈ Mumbai' },
            { from: POPULAR_AIRPORTS[6], to: POPULAR_AIRPORTS[7], label: 'Paris ✈ Barcelona' },
            { from: POPULAR_AIRPORTS[5], to: POPULAR_AIRPORTS[8], label: 'London ✈ New York' },
            { from: POPULAR_AIRPORTS[2], to: POPULAR_AIRPORTS[10], label: 'Kolkata ✈ Singapore' },
          ].map((r, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickRouteChip}
              onPress={() => {
                selectOriginAirport(r.from);
                selectDestAirport(r.to);
              }}
            >
              <Text style={styles.quickRouteChipText}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search & Passenger Interactive Form */}
        <View style={styles.formGrid}>
          {/* Origin & Swap & Destination Row */}
          <View style={styles.routeInputsRow}>
            {/* Fly From */}
            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>🛫 Fly From (City or Airport)</Text>
              <TextInput
                style={styles.textInput}
                value={originQuery}
                onChangeText={handleOriginInput}
                onFocus={() => {
                  setOriginSuggestions(POPULAR_AIRPORTS.slice(0, 6));
                  setShowOriginDrop(true);
                  setShowDestDrop(false);
                }}
                placeholder="Fly from (e.g. New Delhi, London)"
                placeholderTextColor={COLORS.textMutedLight}
              />
              {showOriginDrop && originSuggestions.length > 0 && (
                <View style={styles.dropdownBox}>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownHeaderTitle}>
                      Select Departure Airport
                    </Text>
                    <TouchableOpacity onPress={() => setShowOriginDrop(false)}>
                      <Text style={styles.dropdownClose}>Close ✕</Text>
                    </TouchableOpacity>
                  </View>
                  {originSuggestions.map((loc, idx) => (
                    <TouchableOpacity
                      key={`${loc.code}-${idx}`}
                      style={styles.dropdownItem}
                      onPress={() => selectOriginAirport(loc)}
                    >
                      <View>
                        <Text style={styles.dropdownCityText}>
                          {loc.city} ({loc.code})
                        </Text>
                        <Text style={styles.dropdownAirportSub}>{loc.name}</Text>
                      </View>
                      <Text style={styles.countryPill}>{loc.country}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Swap Route Button */}
            <TouchableOpacity
              style={styles.swapBtn}
              onPress={swapRoute}
              activeOpacity={0.8}
            >
              <Text style={styles.swapBtnIcon}>⇄</Text>
            </TouchableOpacity>

            {/* Fly To */}
            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>🛬 Fly To (City or Airport)</Text>
              <TextInput
                style={styles.textInput}
                value={destQuery}
                onChangeText={handleDestInput}
                onFocus={() => {
                  setDestSuggestions(POPULAR_AIRPORTS.slice(0, 6));
                  setShowDestDrop(true);
                  setShowOriginDrop(false);
                }}
                placeholder="Fly to (e.g. Dubai, Barcelona)"
                placeholderTextColor={COLORS.textMutedLight}
              />
              {showDestDrop && destSuggestions.length > 0 && (
                <View style={styles.dropdownBox}>
                  <View style={styles.dropdownHeader}>
                    <Text style={styles.dropdownHeaderTitle}>
                      Select Arrival Airport
                    </Text>
                    <TouchableOpacity onPress={() => setShowDestDrop(false)}>
                      <Text style={styles.dropdownClose}>Close ✕</Text>
                    </TouchableOpacity>
                  </View>
                  {destSuggestions.map((loc, idx) => (
                    <TouchableOpacity
                      key={`${loc.code}-${idx}`}
                      style={styles.dropdownItem}
                      onPress={() => selectDestAirport(loc)}
                    >
                      <View>
                        <Text style={styles.dropdownCityText}>
                          {loc.city} ({loc.code})
                        </Text>
                        <Text style={styles.dropdownAirportSub}>{loc.name}</Text>
                      </View>
                      <Text style={styles.countryPill}>{loc.country}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Departure Date & Quick Presets */}
          <View style={styles.twoColRow}>
            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>📅 Departure Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.textInput}
                value={departureDate}
                onChangeText={setDepartureDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.textMutedLight}
              />
              <View style={styles.presetChipsRow}>
                {[
                  { label: 'Tomorrow', days: 1 },
                  { label: '+2 Days', days: 2 },
                  { label: '+5 Days', days: 5 },
                  { label: 'Next Week', days: 7 },
                ].map((p) => {
                  const dStr = getFutureDateStr(p.days);
                  const active = departureDate === dStr;
                  return (
                    <TouchableOpacity
                      key={p.label}
                      style={[
                        styles.miniPresetChip,
                        active && styles.miniPresetChipActive,
                      ]}
                      onPress={() => setDepartureDate(dStr)}
                    >
                      <Text
                        style={[
                          styles.miniPresetText,
                          active && styles.miniPresetTextActive,
                        ]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>🔄 Return Date (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={returnDate}
                onChangeText={setReturnDate}
                placeholder="One-Way Charter (or YYYY-MM-DD)"
                placeholderTextColor={COLORS.textMutedLight}
              />
              <View style={styles.presetChipsRow}>
                <TouchableOpacity
                  style={[
                    styles.miniPresetChip,
                    !returnDate && styles.miniPresetChipActive,
                  ]}
                  onPress={() => setReturnDate('')}
                >
                  <Text
                    style={[
                      styles.miniPresetText,
                      !returnDate && styles.miniPresetTextActive,
                    ]}
                  >
                    One-Way
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.miniPresetChip,
                    returnDate === getFutureDateStr(4) &&
                      styles.miniPresetChipActive,
                  ]}
                  onPress={() => setReturnDate(getFutureDateStr(4))}
                >
                  <Text style={styles.miniPresetText}>Round-Trip (+4d)</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Passengers & Baggage Selector */}
          <View style={styles.twoColRow}>
            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>👥 Passengers ({passengers} Pax)</Text>
              <View style={styles.paxSelectorRow}>
                {PASSENGER_COUNTS.map((num) => {
                  const active = passengers === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[styles.paxChip, active && styles.paxChipActive]}
                      onPress={() => setPassengers(num)}
                    >
                      <Text
                        style={[
                          styles.paxChipText,
                          active && styles.paxChipTextActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>🧳 Baggage Allowance</Text>
              <View style={styles.baggageRow}>
                {BAGGAGE_OPTIONS.map((b) => {
                  const active = baggage === b.id;
                  return (
                    <TouchableOpacity
                      key={b.id}
                      style={[
                        styles.baggageChip,
                        active && styles.baggageChipActive,
                      ]}
                      onPress={() => setBaggage(b.id)}
                    >
                      <Text
                        style={[
                          styles.baggageTitle,
                          active && styles.baggageTitleActive,
                        ]}
                      >
                        {b.label}
                      </Text>
                      <Text style={styles.baggageSub}>{b.sub}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Lead Passenger Details & Promo Code */}
          <View style={styles.twoColRow}>
            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>👤 Lead Passenger Name</Text>
              <TextInput
                style={styles.textInput}
                value={passengerName}
                onChangeText={setPassengerName}
                placeholder="Enter full name for VIP Boarding Pass"
                placeholderTextColor={COLORS.textMutedLight}
              />
            </View>

            <View style={styles.inputCol}>
              <Text style={styles.fieldLabel}>✉️ Email for E-Ticket</Text>
              <TextInput
                style={styles.textInput}
                value={passengerEmail}
                onChangeText={setPassengerEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="vip@jetly-aviation.com"
                placeholderTextColor={COLORS.textMutedLight}
              />
            </View>
          </View>

          {/* Promo Code & Primary Submit CTA */}
          <View style={styles.twoColRow}>
            <View style={styles.inputCol}>
              <View style={styles.promoLabelRow}>
                <Text style={styles.fieldLabel}>🏷️ Promo Code (20% Off)</Text>
                <TouchableOpacity onPress={() => setPromoCode('JETLY20')}>
                  <Text style={styles.applyPromoLink}>
                    {isPromoValid ? '✓ JETLY20 Active!' : 'Tap to Apply JETLY20'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  isPromoValid && styles.promoInputValid,
                ]}
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
                placeholder="Enter JETLY20 for 20% discount"
                placeholderTextColor={COLORS.textMutedLight}
              />
            </View>

            <View style={[styles.inputCol, styles.submitBtnCol]}>
              <TouchableOpacity
                style={styles.mainBookSubmitBtn}
                activeOpacity={0.85}
                onPress={() => handleBookTicket(selectedOffer)}
              >
                <Text style={styles.mainBookSubmitText}>
                  ✈️ Book Selected Ticket (
                  {selectedOffer
                    ? formatCurrencyPrice(
                        Math.round(selectedOffer.baseUsd * discountMultiplier),
                        currency,
                        exchangeInfo.rates
                      )
                    : '...'}
                  )
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Live API Calculated Ticket Rate Cards */}
        <View style={styles.liveOffersHeader}>
          <Text style={styles.liveOffersTitle}>
            ⚡ Live Available Flights & Ticket Rates ({origin.city} →{' '}
            {destination.city})
          </Text>
          {loadingApi && (
            <Text style={styles.syncSpinnerText}>
              🔄 Syncing Live Aviation & Rate API...
            </Text>
          )}
        </View>

        <View style={styles.offersGrid}>
          {offers.map((offer) => {
            const isSelected = offer.id === selectedOfferId;
            const discountedUsd = Math.round(offer.baseUsd * discountMultiplier);
            const totalFormatted = formatCurrencyPrice(
              discountedUsd,
              currency,
              exchangeInfo.rates
            );
            const perPaxFormatted = formatCurrencyPrice(
              Math.round(offer.perPersonUsd * discountMultiplier),
              currency,
              exchangeInfo.rates
            );

            return (
              <TouchableOpacity
                key={offer.id}
                activeOpacity={0.9}
                style={[
                  styles.offerCard,
                  isSelected && styles.offerCardSelected,
                ]}
                onPress={() => setSelectedOfferId(offer.id)}
              >
                <View style={styles.offerCardTop}>
                  <View style={styles.offerBadgePill}>
                    <Text style={styles.offerBadgeText}>{offer.badge}</Text>
                  </View>
                  <Text style={styles.offerDepTime}>
                    🕒 Departs {offer.departureTime}
                  </Text>
                </View>

                <View style={styles.offerAircraftRow}>
                  <Image
                    source={offer.image}
                    style={styles.offerMiniPlane}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.offerTierName}>{offer.tierName}</Text>
                    <Text style={styles.offerAircraftModel}>
                      {offer.aircraft} • {offer.durationText}
                    </Text>
                  </View>
                </View>

                <View style={styles.offerFeaturesList}>
                  {offer.cabinFeatures.map((feat, idx) => (
                    <Text key={idx} style={styles.offerFeatureItem}>
                      ✓ {feat}
                    </Text>
                  ))}
                </View>

                <View style={styles.offerPriceFooter}>
                  <View>
                    <Text style={styles.pricingTypeLabel}>
                      {offer.pricingType}
                    </Text>
                    <Text style={styles.offerTotalPrice}>{totalFormatted}</Text>
                    <Text style={styles.perPersonSub}>
                      ~{perPaxFormatted} / pax
                      {isPromoValid ? ' (20% Promo Applied!)' : ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.bookTierBtn,
                      isSelected && styles.bookTierBtnSelected,
                    ]}
                    onPress={() => {
                      setSelectedOfferId(offer.id);
                      handleBookTicket(offer);
                    }}
                  >
                    <Text
                      style={[
                        styles.bookTierBtnText,
                        isSelected && styles.bookTierBtnTextSelected,
                      ]}
                    >
                      Book Ticket →
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Confirmed Interactive VIP Boarding Pass E-Ticket */}
        {confirmedTicket && (
          <View style={styles.boardingPassCard}>
            <View style={styles.bpHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bpVerifiedTag}>
                  ✅ CONFIRMED VIP E-TICKET • LANDING SLOT RESERVED
                </Text>
                <Text style={styles.bpHeaderTitle}>
                  Jetly Private Aviation Boarding Pass
                </Text>
              </View>
              <View style={styles.bpHeaderActions}>
                <TouchableOpacity
                  style={styles.bpShareBtn}
                  onPress={() => handleShareBoardingPass(confirmedTicket)}
                >
                  <Text style={styles.bpShareBtnText}>📤 Share / Print</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bpCloseBtn}
                  onPress={() => setConfirmedTicket(null)}
                >
                  <Text style={styles.bpCloseBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bpBody}>
              <View style={styles.bpRouteRow}>
                <View style={styles.bpCityCol}>
                  <Text style={styles.bpIataCode}>
                    {confirmedTicket.origin.code}
                  </Text>
                  <Text style={styles.bpCityName}>
                    {confirmedTicket.origin.city}
                  </Text>
                  <Text style={styles.bpAirportName}>
                    {confirmedTicket.origin.name}
                  </Text>
                </View>

                <View style={styles.bpFlightGraphic}>
                  <Text style={styles.bpDurationText}>
                    {confirmedTicket.durationText} • {confirmedTicket.distanceKm} km
                  </Text>
                  <View style={styles.bpPlaneLine}>
                    <Text style={styles.bpPlaneEmoji}>✈️</Text>
                  </View>
                  <View style={styles.bpAircraftPill}>
                    <Text style={styles.bpAircraftPillText}>
                      {confirmedTicket.aircraft}
                    </Text>
                  </View>
                </View>

                <View style={[styles.bpCityCol, styles.bpCityColRight]}>
                  <Text style={styles.bpIataCode}>
                    {confirmedTicket.destination.code}
                  </Text>
                  <Text style={styles.bpCityName}>
                    {confirmedTicket.destination.city}
                  </Text>
                  <Text style={styles.bpAirportName}>
                    {confirmedTicket.destination.name}
                  </Text>
                </View>
              </View>

              <View style={styles.bpDetailsGrid}>
                <View style={styles.bpDetailCell}>
                  <Text style={styles.bpDetailLabel}>PASSENGER</Text>
                  <Text style={styles.bpDetailValue}>
                    {confirmedTicket.passengerName}
                  </Text>
                </View>
                <View style={styles.bpDetailCell}>
                  <Text style={styles.bpDetailLabel}>DATE & TIME</Text>
                  <Text style={styles.bpDetailValue}>
                    {confirmedTicket.date} • {confirmedTicket.departureTime}
                  </Text>
                </View>
                <View style={styles.bpDetailCell}>
                  <Text style={styles.bpDetailLabel}>CLASS / TIER</Text>
                  <Text style={styles.bpDetailValue}>
                    {confirmedTicket.tierName}
                  </Text>
                </View>
                <View style={styles.bpDetailCell}>
                  <Text style={styles.bpDetailLabel}>GATE & SEAT</Text>
                  <Text style={styles.bpDetailValue}>
                    {confirmedTicket.gate} • {confirmedTicket.seat}
                  </Text>
                </View>
                <View style={styles.bpDetailCell}>
                  <Text style={styles.bpDetailLabel}>BAGGAGE & PAX</Text>
                  <Text style={styles.bpDetailValue}>
                    {confirmedTicket.passengers} Pax • {confirmedTicket.baggage}
                  </Text>
                </View>
                <View style={styles.bpDetailCell}>
                  <Text style={styles.bpDetailLabel}>DESTINATION WEATHER</Text>
                  <Text style={styles.bpDetailValue}>
                    {confirmedTicket.weather
                      ? `${confirmedTicket.weather.tempC}°C, Wind ${confirmedTicket.weather.windSpeedKmh} km/h`
                      : 'Clear Sky'}
                  </Text>
                </View>
              </View>

              <View style={styles.bpStubFooter}>
                <View>
                  <Text style={styles.bpPnrLabel}>BOOKING PNR</Text>
                  <Text style={styles.bpPnrValue}>{confirmedTicket.pnr}</Text>
                </View>
                <View>
                  <Text style={styles.bpPnrLabel}>TOTAL LIVE RATE</Text>
                  <Text style={styles.bpPriceValue}>
                    {confirmedTicket.priceFormatted}
                  </Text>
                </View>
                <View style={styles.barcodeRow}>
                  {[3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4].map((w, i) => (
                    <View
                      key={i}
                      style={[styles.barcodeBar, { width: w * 2.5 }]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        <Text style={styles.disclaimerText}>
          * Live flight rates fetched via Open Exchange Rate API & Open-Meteo
          Aviation Weather API. Instant VIP E-Ticket saved to My Tickets.
        </Text>
      </View>

      {/* Animated Sky Takeoff-to-Landing Modal when booking a ticket */}
      <Modal visible={isLandingAnim} transparent animationType="fade">
        <View style={styles.animModalBackdrop}>
          <View style={styles.animModalCard}>
            <View style={styles.animTrackRow}>
              <View style={styles.animEndpointBadge}>
                <Text style={styles.animEndpointText}>{origin.code}</Text>
              </View>

              <View style={styles.animSkyCorridor}>
                <Animated.View
                  style={{
                    transform: [
                      { translateX: modalJetTranslateX },
                      { translateY: modalJetTranslateY },
                    ],
                  }}
                >
                  <Image
                    source={ASSETS.jetHero}
                    style={styles.animModalJet}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>

              <View style={styles.animEndpointBadge}>
                <Text style={styles.animEndpointText}>
                  📍 {destination.code}
                </Text>
              </View>
            </View>

            <Text style={styles.animModalTitle}>
              ✈️ Flying from {origin.city} & Landing in {destination.city}...
            </Text>
            <Text style={styles.animModalSub}>
              Locking live API exchange rate ({currency}) & generating your VIP
              Boarding Pass...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 22,
    paddingHorizontal: 14,
  },
  cardContainer: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: COLORS.cardDark,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.28)',
    padding: 18,
    ...SHADOWS.card,
  },
  topBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  titleBlock: {
    flex: 1,
    minWidth: 250,
  },
  kickerText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
  },
  apiStatusCard: {
    backgroundColor: 'rgba(7, 23, 14, 0.85)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    gap: 8,
  },
  apiPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.emeraldLight,
  },
  apiStatusText: {
    color: COLORS.textMutedLight,
    fontSize: 11,
  },
  apiStatusBold: {
    color: COLORS.white,
    fontWeight: '800',
  },
  currencyPillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  currChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  currChipActive: {
    backgroundColor: COLORS.gold,
  },
  currChipText: {
    color: COLORS.textMutedLight,
    fontSize: 11,
    fontWeight: '700',
  },
  currChipTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  radarBanner: {
    backgroundColor: 'rgba(7, 23, 14, 0.92)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.3)',
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  radarEndpoint: {
    minWidth: 105,
  },
  radarEndpointRight: {
    alignItems: 'flex-end',
  },
  endpointLabel: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  endpointCode: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
  },
  endpointCity: {
    color: COLORS.textMutedLight,
    fontSize: 11,
  },
  radarTrackCenter: {
    flex: 1,
    minWidth: 180,
    alignItems: 'center',
  },
  trackMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  trackMetricItem: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '700',
  },
  radarLineWrap: {
    width: '90%',
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  originDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
  },
  dashedTrackLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(212, 184, 66, 0.35)',
    marginHorizontal: 6,
  },
  flyingPlaneBadge: {
    position: 'absolute',
    left: '46%',
  },
  flyingPlaneEmoji: {
    fontSize: 16,
  },
  destDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.emeraldLight,
  },
  weatherChip: {
    marginTop: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  weatherChipText: {
    color: COLORS.emeraldLight,
    fontSize: 10,
    fontWeight: '700',
  },
  quickRoutesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
    marginBottom: 16,
  },
  quickRoutesLabel: {
    color: COLORS.textMutedLight,
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  quickRouteChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  quickRouteChipText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
  },
  formGrid: {
    gap: 12,
    marginBottom: 20,
  },
  routeInputsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 10,
    zIndex: 30,
  },
  twoColRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inputCol: {
    flex: 1,
    minWidth: 230,
  },
  fieldLabel: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(7, 23, 14, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  promoInputValid: {
    borderColor: COLORS.emeraldLight,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  swapBtn: {
    alignSelf: 'center',
    marginTop: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapBtnIcon: {
    color: COLORS.primaryDark,
    fontSize: 18,
    fontWeight: '900',
  },
  dropdownBox: {
    marginTop: 6,
    backgroundColor: '#081d11',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
    padding: 8,
    ...SHADOWS.card,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  dropdownHeaderTitle: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
  },
  dropdownClose: {
    color: COLORS.textMutedLight,
    fontSize: 10,
    fontWeight: '700',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownCityText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  dropdownAirportSub: {
    color: COLORS.textMutedLight,
    fontSize: 10,
  },
  countryPill: {
    color: COLORS.goldLight,
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: 'rgba(212, 184, 66, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  presetChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  miniPresetChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  miniPresetChipActive: {
    backgroundColor: 'rgba(212, 184, 66, 0.2)',
    borderColor: COLORS.gold,
  },
  miniPresetText: {
    color: COLORS.textMutedLight,
    fontSize: 10,
    fontWeight: '600',
  },
  miniPresetTextActive: {
    color: COLORS.goldLight,
    fontWeight: '800',
  },
  paxSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  paxChip: {
    minWidth: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(7, 23, 14, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paxChipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  paxChipText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  paxChipTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  baggageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  baggageChip: {
    flex: 1,
    minWidth: 85,
    backgroundColor: 'rgba(7, 23, 14, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  baggageChipActive: {
    backgroundColor: 'rgba(212, 184, 66, 0.18)',
    borderColor: COLORS.gold,
  },
  baggageTitle: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  baggageTitleActive: {
    color: COLORS.goldLight,
  },
  baggageSub: {
    color: COLORS.textMutedLight,
    fontSize: 9,
  },
  promoLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applyPromoLink: {
    color: COLORS.emeraldLight,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  submitBtnCol: {
    justifyContent: 'flex-end',
  },
  mainBookSubmitBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.goldGlow,
  },
  mainBookSubmitText: {
    color: COLORS.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },
  liveOffersHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  liveOffersTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  syncSpinnerText: {
    color: COLORS.goldLight,
    fontSize: 11,
    fontWeight: '600',
  },
  offersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  offerCard: {
    flexGrow: 1,
    flexBasis: 245,
    backgroundColor: 'rgba(7, 23, 14, 0.88)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
    justifyContent: 'space-between',
  },
  offerCardSelected: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(21, 61, 37, 0.92)',
  },
  offerCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  offerBadgePill: {
    backgroundColor: 'rgba(212, 184, 66, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  offerBadgeText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  offerDepTime: {
    color: COLORS.textMutedLight,
    fontSize: 11,
    fontWeight: '600',
  },
  offerAircraftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  offerMiniPlane: {
    width: 44,
    height: 30,
  },
  offerTierName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  offerAircraftModel: {
    color: COLORS.goldLight,
    fontSize: 11,
    marginTop: 2,
  },
  offerFeaturesList: {
    gap: 4,
    marginBottom: 12,
  },
  offerFeatureItem: {
    color: COLORS.textMutedLight,
    fontSize: 11,
  },
  offerPriceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  pricingTypeLabel: {
    color: COLORS.textMutedLight,
    fontSize: 10,
  },
  offerTotalPrice: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: '900',
  },
  perPersonSub: {
    color: COLORS.emeraldLight,
    fontSize: 10,
    fontWeight: '600',
  },
  bookTierBtn: {
    backgroundColor: 'rgba(212, 184, 66, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  bookTierBtnSelected: {
    backgroundColor: COLORS.gold,
  },
  bookTierBtnText: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: '800',
  },
  bookTierBtnTextSelected: {
    color: COLORS.primaryDark,
  },
  boardingPassCard: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.gold,
    ...SHADOWS.card,
  },
  bpHeader: {
    backgroundColor: COLORS.primaryGreen,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  bpVerifiedTag: {
    color: COLORS.emeraldLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  bpHeaderTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },
  bpHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bpShareBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  bpShareBtnText: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  bpCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpCloseBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  bpBody: {
    padding: 16,
  },
  bpRouteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexWrap: 'wrap',
    gap: 10,
  },
  bpCityCol: {
    minWidth: 95,
  },
  bpCityColRight: {
    alignItems: 'flex-end',
  },
  bpIataCode: {
    color: COLORS.primaryGreen,
    fontSize: 28,
    fontWeight: '900',
  },
  bpCityName: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '800',
  },
  bpAirportName: {
    color: COLORS.textMutedDark,
    fontSize: 10,
  },
  bpFlightGraphic: {
    flex: 1,
    minWidth: 140,
    alignItems: 'center',
  },
  bpDurationText: {
    color: COLORS.textMutedDark,
    fontSize: 11,
    fontWeight: '700',
  },
  bpPlaneLine: {
    marginVertical: 4,
  },
  bpPlaneEmoji: {
    fontSize: 20,
  },
  bpAircraftPill: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bpAircraftPillText: {
    color: COLORS.primaryGreen,
    fontSize: 10,
    fontWeight: '800',
  },
  bpDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  bpDetailCell: {
    flexBasis: '30%',
    minWidth: 130,
    flexGrow: 1,
  },
  bpDetailLabel: {
    color: COLORS.textMutedDark,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  bpDetailValue: {
    color: COLORS.textDark,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  bpStubFooter: {
    paddingTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  bpPnrLabel: {
    color: COLORS.textMutedDark,
    fontSize: 9,
    fontWeight: '800',
  },
  bpPnrValue: {
    color: COLORS.primaryGreen,
    fontSize: 20,
    fontWeight: '900',
  },
  bpPriceValue: {
    color: COLORS.goldMuted,
    fontSize: 20,
    fontWeight: '900',
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 34,
  },
  barcodeBar: {
    height: '100%',
    backgroundColor: COLORS.primaryDark,
  },
  disclaimerText: {
    color: COLORS.textMutedLight,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
  },
  animModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 18, 11, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  animModalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: COLORS.cardDark,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  animTrackRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  animEndpointBadge: {
    backgroundColor: 'rgba(212, 184, 66, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  animEndpointText: {
    color: COLORS.goldLight,
    fontSize: 13,
    fontWeight: '900',
  },
  animSkyCorridor: {
    flex: 1,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  animModalJet: {
    width: 120,
    height: 55,
  },
  animModalTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  animModalSub: {
    color: COLORS.textMutedLight,
    fontSize: 12,
    textAlign: 'center',
  },
});
