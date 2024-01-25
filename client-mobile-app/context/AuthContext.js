import React, { createContext, useState } from 'react'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    let [isSignedIn, setIsSignedIn] = useState(false)

    return (
        <AuthContext.Provider value={{
            isSignedIn,
            setIsSignedIn
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider