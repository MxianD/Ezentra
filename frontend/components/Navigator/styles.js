import { StyleSheet } from "react-native";

export default StyleSheet.create({
  father: {
    flexDirection: "row",
    alignItems: "center",
    width: "98%",
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: "rgba(31, 32, 32, 0.5)",
  },

  logo: {
    minWidth: "10%",
  },

  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  DAO_name: {
    marginLeft: 10,
  },

  DAO_name_text: {
    fontSize: 22,
    color: "white",
  },

  navLink: {
    fontSize: 18,
    color: "white",
    marginLeft: 20,
  },

  market: {
    marginLeft: "30%",
  },

  deploy: {
    marginLeft: 20,
  },

  user: {
    marginLeft: 20,
  },

  connectWalletButton: {
    marginLeft: "auto",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(31, 32, 32, 0.7)",
    borderRadius: 5,
  },

  connectedState: {
    marginLeft: "auto",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(86, 86, 86, 0.5)",
    borderRadius: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
