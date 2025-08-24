import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { ParamListBase, RouteProp } from '@react-navigation/native';

export type RootDrawerParamList = {
    Home: undefined;
    Features: undefined;
    Pricing: undefined;
    'Saved URLs': undefined;
};

export type DrawerNavigationProps<T extends keyof RootDrawerParamList> = {
    navigation: DrawerNavigationProp<RootDrawerParamList, T>;
    route: RouteProp<RootDrawerParamList, T>;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootDrawerParamList {}
    }
}