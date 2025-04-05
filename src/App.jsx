import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WaitingScreen from "./routes/WaitingScreen/waitingScreen";
import HomeScreen from "./routes/HomeScreen/homeScreen";
import QuizScreen from "./routes/QuizScreen/QuizScreen";
import ResultsScreen from "./routes/resultsScreen/ResultsScreen";
import { SocketManager } from "./Components/SocketManger";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen></HomeScreen>
    },
    {
        path: "/waiting",
        element: 
        (

                <WaitingScreen />

        )
    },
    {
        path:"/quiz",
        element: (

                <QuizScreen />
            
        )
    },{
        path:"/results",
        element: <ResultsScreen />
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
