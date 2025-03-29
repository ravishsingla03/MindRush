import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WaitingScreen from "./routes/WaitingScreen/waitingScreen";
import HomeScreen from "./routes/HomeScreen/homeScreen";
import QuizScreen from "./routes/QuizScreen/QuizScreen";
import { SocketManager } from "./Components/SocketManger";
import ProtectedRoute from "./Components/protectRoute";
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen></HomeScreen>
    },
    {
        path: "/waiting",
        element: 
        (
            <ProtectedRoute>
                <WaitingScreen />
            </ProtectedRoute>
        )
    },
    {
        path:"/quiz",
        element: (
            <ProtectedRoute>
                <QuizScreen />
            </ProtectedRoute>
        )
    }
]);


function App(){
   return (
       <>
       <SocketManager />
        <RouterProvider router={router} />
       </>
   );
    
};

export default App;
