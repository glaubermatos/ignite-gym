import { useTheme, Box } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { useAuth } from '@hooks/useAuth';
import { Loading } from '@components/Loading';

export function Routes() {
    const { user, isLoadingStorageUserData } = useAuth()

    console.log(user)

    const isAutenticated = user.id

    const { colors } = useTheme()

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[700];

    if (isLoadingStorageUserData) {
        return <Loading />
    }

    return (
        <Box flex={1} bg="gray.700">
            <NavigationContainer theme={theme}>
                { isAutenticated ? <AppRoutes /> : <AuthRoutes />}
            </NavigationContainer>
        </Box>
    );
}