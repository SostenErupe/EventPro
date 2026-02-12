import { createContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { 
                user: action.payload.user,
                token: action.payload.token,
                authIsReady: true
            };
        case 'LOGOUT':
            return {
                user: null,
                token: null,
                authIsReady: true
            };
        case 'AUTH_READY':
            return {
                ...state,
                authIsReady: true
            };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: null,
        authIsReady: false
    });

    useEffect(() => {
        const initializeAuth = () => {
            // First check sessionStorage (for current tab session)
            let user = JSON.parse(sessionStorage.getItem('user'));
            let token = sessionStorage.getItem('token');

            // If sessionStorage is empty, check localStorage as fallback
            if (!user || !token) {
                user = JSON.parse(localStorage.getItem('user'));
                token = localStorage.getItem('token');
                
                // If we found data in localStorage, restore to sessionStorage
                if (user && token) {
                    sessionStorage.setItem('user', JSON.stringify(user));
                    sessionStorage.setItem('token', token);
                }
            }

            if (!user || !token) {
                dispatch({ type: 'AUTH_READY' });
                return;
            }

            try {
                // Client-side token validation only
                const decoded = jwtDecode(token);                
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    throw new Error('Token expired');
                }

                dispatch({
                    type: 'LOGIN',
                    payload: { user, token }
                });
            } catch (error) {
                console.error('Auth initialization error:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token');
            } finally {
                dispatch({ type: 'AUTH_READY' });
            }
        };

        initializeAuth();
    }, []);

    // Debug logging
    useEffect(() => {
        console.log('Current auth state:', {
            user: state.user,
            token: state.token ? '***' + state.token.slice(-4) : null,
            authIsReady: state.authIsReady
        });
    }, [state]);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};