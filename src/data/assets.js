import jetHeroImg from '../../assets/jet_hero.png';
import logoImg from '../../assets/logo.png';
import planeImg from '../../assets/plane.png';
import planeFillImg from '../../assets/plane_fill.png';
import aboutCabinImg from '../../assets/about_cabin.png';
import featureBoardingImg from '../../assets/feature_boarding.png';
import featureCabinImg from '../../assets/feature_cabin.png';
import featureShapeImg from '../../assets/feature_shape.png';
import destParisImg from '../../assets/dest_paris.png';
import destDubaiImg from '../../assets/dest_dubai.png';
import destZurichImg from '../../assets/dest_zurich.png';
import specialOfferImg from '../../assets/special_offer.png';
import avatarImg from '../../assets/avatar.png';
import passionImg from '../../assets/passion.png';
import worldMapImg from '../../assets/world_map.png';
import starImg from '../../assets/star.png';
import heroBgImg from '../../assets/hero_bg.png';

/**
 * Converts an imported asset into a format compatible with both
 * React Native Metro bundler (number/object) and React Native Web / Vite ({ uri }).
 */
export function asImageSource(asset) {
  if (!asset) return undefined;
  if (typeof asset === 'string') {
    return { uri: asset };
  }
  return asset;
}

export const ASSETS = {
  jetHero: asImageSource(jetHeroImg),
  logo: asImageSource(logoImg),
  plane: asImageSource(planeImg),
  planeFill: asImageSource(planeFillImg),
  aboutCabin: asImageSource(aboutCabinImg),
  featureBoarding: asImageSource(featureBoardingImg),
  featureCabin: asImageSource(featureCabinImg),
  featureShape: asImageSource(featureShapeImg),
  destParis: asImageSource(destParisImg),
  destDubai: asImageSource(destDubaiImg),
  destZurich: asImageSource(destZurichImg),
  specialOffer: asImageSource(specialOfferImg),
  avatar: asImageSource(avatarImg),
  passion: asImageSource(passionImg),
  worldMap: asImageSource(worldMapImg),
  star: asImageSource(starImg),
  heroBg: asImageSource(heroBgImg),
};
