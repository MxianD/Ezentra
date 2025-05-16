export type RootStackParamList = {
  Home: undefined;
  Ranking: undefined;
  Profile: undefined;
};

declare global { 
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default {};