import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute({ children }) {
    const { loading, isAuthenticated } = useAuth

    if (loading) {
        return <div>Carregando...</div>
    }

    if(!isAuthenticated){
        return <Navigate to="/" replace />;
    }

    return children;
}