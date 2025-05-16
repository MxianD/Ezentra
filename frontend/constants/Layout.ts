import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Default breakpoints
const breakpoints = {
  smallPhone: 320,
  phone: 375,
  tablet: 768,
  desktop: 1024,
};

export default {
  window: {
    width,
    height,
  },
  breakpoints,
  isSmallPhone: width < breakpoints.phone,
  isPhone: width >= breakpoints.phone && width < breakpoints.tablet,
  isTablet: width >= breakpoints.tablet && width < breakpoints.desktop,
  isDesktop: width >= breakpoints.desktop,
  // Scale utilities for responsive sizing
  scale: (size: number) => width / 375 * size,
  // Padding and margin sizing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  // Helper for determining appropriate layout
  getResponsiveLayout: () => {
    if (width < breakpoints.tablet) {
      return 'column';
    }
    return 'row';
  },
  // Helper for font size adjustments
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  // Helper for border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
}; 