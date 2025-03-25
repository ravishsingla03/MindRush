import React, { useState, useEffect } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WaitingScreen from "./routes/WaitingScreen/waitingScreen";
import HomeScreen from "./routes/HomeScreen/homeScreen";
import QuizScreen from "./routes/QuizScreen/QuizScreen";
const router = createBrowserRouter([
    {
        path: "/waiting",
        element: <WaitingScreen></WaitingScreen>
    },
    {
        path: "/",
        element: <HomeScreen></HomeScreen>
    },
    {
        path:"/quiz",
        element: <QuizScreen></QuizScreen>
    }
]);


function App(){
   return (
    <RouterProvider router={router} />
   );
    
};

export default App;
