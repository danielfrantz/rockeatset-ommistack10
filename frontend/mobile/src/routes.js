import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import Profile from "./pages/Profile";

const Stack = createStackNavigator();

function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Main" 
                    component={Main} 
                    options={{
                        title: 'DevRadar',
                        headerTitleAlign: "center",
                        headerStyle: {
                            backgroundColor: '#7D40E7',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
                <Stack.Screen name="Profile" component={Profile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;