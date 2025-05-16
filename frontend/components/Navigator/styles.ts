import { StyleSheet, Platform, StatusBar, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Web Navigation Styles
  father: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logo: {
    marginRight: 16,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  DAO_name: {
    marginRight: 32,
  },
  DAO_name_text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  navLink: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  activeNavLink: {
    backgroundColor: "rgba(120, 52, 230, 0.1)",
  },
  navLinkText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  activeNavLinkText: {
    color: "#7834E6",
    fontWeight: "600",
  },
  market: {
    marginRight: 16,
  },
  deploy: {
    marginRight: 16,
  },
  user: {
    marginLeft: "auto",
  },
  
  // Mobile Navigation Styles
  mobileTabBarContainer: {
    display: Platform.OS === 'web' ? 'none' : 'flex',
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 15,
    zIndex: 1000,
    height: Platform.OS === 'android' ? 70 : 85,
  },
  mobileTabBar: {
    flexDirection: "row",
    backgroundColor: "#000000",
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 10 : 0,
    height: '100%',
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabBarText: {
    fontSize: 12,
    marginTop: 4,
    color: "#9ca3af",
  },
  activeTabBarText: {
    color: "#7834E6",
    fontWeight: "600",
  },
});

export default styles; 