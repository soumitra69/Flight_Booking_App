import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { HERO_FEATURES } from '../data/siteData';
import { ASSETS } from '../data/assets';
import { COLORS, SHADOWS } from '../theme/theme';

export default function HeroSkyLanding({ landingTriggerKey, onBookNowPress }) {
  const [flightState, setFlightState] = useState('descending'); // 'descending' | 'touchdown' | 'landed' | 'takeoff'
  const [altitude, setAltitude] = useState(35000);
  const [speedKts, setSpeedKts] = useState(510);
  const [animCycle, setAnimCycle] = useState(0);

  // React Native Animated Values for 60fps Sky-to-Runway descent
  const planeProgress = useRef(new Animated.Value(0)).current;
  const cloudDrift = useRef(new Animated.Value(0)).current;
  const smokeScale = useRef(new Animated.Value(0)).current;
  const smokeOpacity = useRef(new Animated.Value(0)).current;
  const runwayPulse = useRef(new Animated.Value(0.4)).current;

  // Continuous ambient cloud drift & runway approach light pulse
  useEffect(() => {
    const cloudLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudDrift, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloudDrift, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(runwayPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(runwayPulse, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    cloudLoop.start();
    pulseLoop.start();
    return () => {
      cloudLoop.stop();
      pulseLoop.stop();
    };
  }, [cloudDrift, runwayPulse]);

  const triggerSkyLanding = () => {
    setAnimCycle((c) => c + 1);
    setFlightState('descending');
    setAltitude(35000);
    setSpeedKts(510);
  };

  const triggerTakeoffAndLand = () => {
    setFlightState('takeoff');
    setAltitude(12400);
    setSpeedKts(295);

    Animated.timing(planeProgress, {
      toValue: -0.35,
      duration: 1600,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      triggerSkyLanding();
    });
  };

  useEffect(() => {
    if (landingTriggerKey > 0) {
      triggerSkyLanding();
    }
  }, [landingTriggerKey]);

  // Execute full Sky Descent -> Touchdown Smoke -> VIP Runway Rollout
  useEffect(() => {
    planeProgress.setValue(0);
    smokeScale.setValue(0.3);
    smokeOpacity.setValue(0);

    Animated.timing(planeProgress, {
      toValue: 1,
      duration: 3600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const startTime = Date.now();
    const duration = 3600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAlt = Math.max(0, Math.round(35000 * (1 - easeOut)));
      const currentSpeed =
        progress < 0.75
          ? Math.round(510 - 350 * (progress / 0.75))
          : Math.max(0, Math.round(160 * (1 - (progress - 0.75) / 0.25)));

      setAltitude(currentAlt);
      setSpeedKts(currentSpeed);

      if (progress >= 0.7 && progress < 0.96) {
        setFlightState((prev) => {
          if (prev !== 'touchdown') {
            // Trigger tire touchdown smoke puff animation
            Animated.parallel([
              Animated.timing(smokeScale, {
                toValue: 1.5,
                duration: 750,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(smokeOpacity, {
                  toValue: 0.85,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(smokeOpacity, {
                  toValue: 0,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ]),
            ]).start();
          }
          return 'touchdown';
        });
      } else if (progress >= 0.96) {
        setFlightState('landed');
        setAltitude(0);
        setSpeedKts(0);
        clearInterval(interval);
      }
    }, 55);

    return () => clearInterval(interval);
  }, [animCycle]);

  // Interpolate airplane position, scale & pitch from 35,000ft sky down to runway
  const jetTranslateY = planeProgress.interpolate({
    inputRange: [-0.35, 0, 0.72, 1],
    outputRange: [-135, -125, -8, 0],
  });

  const jetTranslateX = planeProgress.interpolate({
    inputRange: [-0.35, 0, 0.72, 1],
    outputRange: [95, -90, -10, 0],
  });

  const jetScale = planeProgress.interpolate({
    inputRange: [-0.35, 0, 0.72, 1],
    outputRange: [0.42, 0.38, 0.94, 1],
  });

  const shadowScale = planeProgress.interpolate({
    inputRange: [-0.35, 0, 0.72, 1],
    outputRange: [0.2, 0.22, 0.88, 1],
  });

  const shadowOpacity = planeProgress.interpolate({
    inputRange: [-0.35, 0, 0.72, 1],
    outputRange: [0.05, 0.08, 0.45, 0.65],
  });

  const contrailOpacity = planeProgress.interpolate({
    inputRange: [-0.35, 0, 0.65, 0.85, 1],
    outputRange: [0.7, 0.85, 0.65, 0, 0],
  });

  const cloudTranslateX = cloudDrift.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 18],
  });

  const getStatusConfig = () => {
    switch (flightState) {
      case 'descending':
        return {
          icon: '🛬',
          text: 'DESCENDING FROM SKY',
          color: COLORS.gold,
          bg: 'rgba(212, 184, 66, 0.18)',
        };
      case 'touchdown':
        return {
          icon: '💨',
          text: 'TOUCHDOWN ON RUNWAY',
          color: '#38bdf8',
          bg: 'rgba(56, 189, 248, 0.2)',
        };
      case 'takeoff':
        return {
          icon: '🛫',
          text: 'CLIMBING TO SKY',
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.2)',
        };
      default:
        return {
          icon: '✅',
          text: 'LANDED AT VIP TERMINAL',
          color: COLORS.emeraldLight,
          bg: 'rgba(16, 185, 129, 0.2)',
        };
    }
  };

  const statusCfg = getStatusConfig();

  return (
    <View style={styles.heroWrapper}>
      {/* Sky Banner Section */}
      <View style={styles.skyBanner}>
        {/* Animated Sky Clouds & Stars */}
        <Animated.View
          style={[
            styles.cloudLayer,
            { transform: [{ translateX: cloudTranslateX }] },
          ]}
          pointerEvents="none"
        >
          <View style={[styles.cloudPill, styles.cloud1]} />
          <View style={[styles.cloudPill, styles.cloud2]} />
          <View style={[styles.cloudPill, styles.cloud3]} />
        </Animated.View>

        {/* Live Flight Telemetry HUD */}
        <View style={styles.telemetryHud}>
          <View style={[styles.hudStatusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={styles.hudStatusIcon}>{statusCfg.icon}</Text>
            <Text style={[styles.hudStatusText, { color: statusCfg.color }]}>
              {statusCfg.text}
            </Text>
          </View>

          <View style={styles.hudMetricsRow}>
            <Text style={styles.hudMetricLabel}>
              ALT: <Text style={styles.hudMetricValue}>{altitude.toLocaleString()} FT</Text>
            </Text>
            <Text style={styles.hudSep}>|</Text>
            <Text style={styles.hudMetricLabel}>
              SPD: <Text style={styles.hudMetricValue}>{speedKts} KTS</Text>
            </Text>
            <Text style={styles.hudSep}>|</Text>
            <Text style={styles.hudMetricLabel}>
              RWY: <Text style={styles.hudMetricValue}>09L / VIP</Text>
            </Text>
          </View>
        </View>

        {/* Hero Headlines */}
        <Text style={styles.heroTagline}>SAVE TIME AND FLY WITH COMFORT</Text>
        <Text style={styles.heroTitle}>Luxury Jet Flights</Text>
        <Text style={styles.heroSubtitle}>
          Watch our flagship jet descend from 35,000 ft & book instant private
          charters with live multi-currency API ticket rates.
        </Text>

        {/* Interactive Flight Action Buttons */}
        <View style={styles.heroBtnGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={onBookNowPress}
          >
            <Text style={styles.primaryBtnText}>🎟️ Book Flight Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={triggerSkyLanding}
          >
            <Text style={styles.secondaryBtnText}>🛬 Replay Sky Landing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineBtn}
            activeOpacity={0.85}
            onPress={triggerTakeoffAndLand}
          >
            <Text style={styles.outlineBtnText}>🛫 Takeoff & Land</Text>
          </TouchableOpacity>
        </View>

        {/* Animated Runway & Descending Flagship Aircraft Stage */}
        <View style={styles.runwayStage}>
          {/* Perspective Runway Strip */}
          <View style={styles.runwayStrip}>
            <View style={styles.runwayCenterlineRow}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} style={styles.runwayDash} />
              ))}
            </View>

            {/* Pulsing Approach Edge Lights */}
            <Animated.View
              style={[styles.runwayLightsRow, { opacity: runwayPulse }]}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.runwayLightDot,
                    i % 2 === 0 ? styles.lightGold : styles.lightGreen,
                  ]}
                />
              ))}
            </Animated.View>
          </View>

          {/* Animated Descending Flagship Jet */}
          <Animated.View
            style={[
              styles.animatedJetContainer,
              {
                transform: [
                  { translateX: jetTranslateX },
                  { translateY: jetTranslateY },
                  { scale: jetScale },
                ],
              },
            ]}
          >
            {/* Wing Contrails while in Sky */}
            <Animated.View
              style={[styles.wingContrailLeft, { opacity: contrailOpacity }]}
            />
            <Animated.View
              style={[styles.wingContrailRight, { opacity: contrailOpacity }]}
            />

            {/* Tire Touchdown Smoke Puffs */}
            <Animated.View
              style={[
                styles.touchdownSmoke,
                {
                  opacity: smokeOpacity,
                  transform: [{ scale: smokeScale }],
                },
              ]}
            >
              <View style={styles.smokePuff} />
              <View style={[styles.smokePuff, styles.smokePuffRight]} />
            </Animated.View>

            <Image
              source={ASSETS.jetHero}
              style={styles.jetHeroImage}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Dynamic Runway Shadow */}
          <Animated.View
            style={[
              styles.runwayShadow,
              {
                opacity: shadowOpacity,
                transform: [{ scaleX: shadowScale }],
              },
            ]}
          />
        </View>
      </View>

      {/* 4 Luxury Aviation Feature Cards */}
      <View style={styles.featuresGrid}>
        {HERO_FEATURES.map((feat) => (
          <View key={feat.id} style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Image
                source={feat.icon}
                style={styles.featureIconImg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureCardTitle}>{feat.title}</Text>
              <Text style={styles.featureCardSub}>{feat.subtitle}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    backgroundColor: COLORS.primaryBg,
    paddingBottom: 18,
  },
  skyBanner: {
    paddingTop: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cloudLayer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    height: 150,
  },
  cloudPill: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 50,
  },
  cloud1: {
    width: 140,
    height: 36,
    top: 10,
    left: '8%',
  },
  cloud2: {
    width: 190,
    height: 44,
    top: 48,
    right: '6%',
  },
  cloud3: {
    width: 120,
    height: 30,
    top: 95,
    left: '25%',
  },
  telemetryHud: {
    backgroundColor: 'rgba(7, 23, 14, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.38)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 14,
    maxWidth: 520,
    width: '100%',
    ...SHADOWS.soft,
  },
  hudStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  hudStatusIcon: {
    fontSize: 12,
  },
  hudStatusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  hudMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  hudMetricLabel: {
    color: COLORS.textMutedLight,
    fontSize: 11,
    fontWeight: '600',
  },
  hudMetricValue: {
    color: COLORS.white,
    fontWeight: '800',
  },
  hudSep: {
    color: 'rgba(212, 184, 66, 0.4)',
    fontSize: 11,
  },
  heroTagline: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: COLORS.textMutedLight,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 540,
    marginBottom: 18,
  },
  heroBtnGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
  },
  primaryBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 24,
    ...SHADOWS.goldGlow,
  },
  primaryBtnText: {
    color: COLORS.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  secondaryBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  outlineBtn: {
    backgroundColor: 'rgba(212, 184, 66, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  outlineBtnText: {
    color: COLORS.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },
  runwayStage: {
    width: '100%',
    maxWidth: 760,
    height: 220,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    marginTop: 6,
    marginBottom: 10,
  },
  runwayStrip: {
    position: 'absolute',
    bottom: 8,
    width: '94%',
    height: 58,
    backgroundColor: '#07150d',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  runwayCenterlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '88%',
  },
  runwayDash: {
    width: 24,
    height: 3,
    backgroundColor: 'rgba(212, 184, 66, 0.55)',
    borderRadius: 2,
  },
  runwayLightsRow: {
    position: 'absolute',
    bottom: 7,
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  runwayLightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lightGold: {
    backgroundColor: COLORS.gold,
  },
  lightGreen: {
    backgroundColor: COLORS.emeraldLight,
  },
  animatedJetContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginBottom: 18,
  },
  jetHeroImage: {
    width: '95%',
    maxWidth: 580,
    height: 155,
  },
  wingContrailLeft: {
    position: 'absolute',
    top: 40,
    left: '8%',
    width: 75,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 2,
  },
  wingContrailRight: {
    position: 'absolute',
    top: 40,
    right: '8%',
    width: 75,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 2,
  },
  touchdownSmoke: {
    position: 'absolute',
    bottom: 6,
    flexDirection: 'row',
    gap: 50,
    zIndex: 12,
  },
  smokePuff: {
    width: 38,
    height: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(235, 240, 238, 0.72)',
  },
  smokePuffRight: {
    width: 42,
  },
  runwayShadow: {
    width: '62%',
    maxWidth: 360,
    height: 14,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    position: 'absolute',
    bottom: 14,
    zIndex: 4,
  },
  featuresGrid: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  featureCard: {
    flexGrow: 1,
    flexBasis: 240,
    backgroundColor: COLORS.cardDark,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 66, 0.22)',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(212, 184, 66, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconImg: {
    width: 22,
    height: 22,
  },
  featureTextCol: {
    flex: 1,
  },
  featureCardTitle: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  featureCardSub: {
    color: COLORS.textMutedLight,
    fontSize: 11,
    lineHeight: 15,
  },
});
