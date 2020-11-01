import React, {MouseEvent } from 'react'
import {useState, useEffect, createContext} from "react";

const urlGet = "http://13.74.31.101/api/points";
const urlPost = "http://13.74.31.101/api/points";
const token = "YHGgktp8DkUpMsmjmJfsOTJ3PUAxJOBk";
const BowlingContext = createContext({
    Points: [],
    IsSuccess:false,
});
const BowlingProvider = (props: { children: React.ReactNode; }) => {
    const [Points, setPoints] = useState([]);
    const [Token, setToken] = useState("");
    const [Results,setResults] = useState([]);
    const [IsSuccess,setIsSuccess] = useState(false);
    const fetchPoints = async () => {
        const fetchData = await fetch(urlGet, {
            method: "GET",
            headers: {
                'authorization': `token ${token}`
            }
        });
        const points = await fetchData.json();
        console.log(points)

        setToken(points.token);
        setPoints(points.points);
    }
    // eslint-disable-next-line
    const PostResult = async (data) => {
        let response ={
            token: Token,
            points:data
        }
        const PostData = await fetch(urlPost, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
        });

        return PostData.json();

    }
    const scoreCalculator = (scores) =>{
        let calcScores:number[] = [];
        let accumulator:number =0;
        let counnt = 1;
        scores.map((frame, index) =>{
            console.log(scores.length, frame, index+1)
            let subtotal = 0;
            console.log("sub", subtotal)
           if (frame[0] === 10){
               //strike
               subtotal += frame[0];
               subtotal += scores[index+1] ? scores[index+1][0] : 0;
               subtotal += scores[index+1] ? scores[index+1][1] : 0;
               console.log("strike!", subtotal,frame ,index);
               if(scores[index+1] !== undefined && scores[index+2] !== undefined && scores[index+1][0] ===10){
                   //Barney Rubble aka double
                   subtotal += scores[index+2][0] !== 10 ? scores[index+2][0] : 0 ;
               }

               if(scores.length === index+1){
                   //bonus frame but inside frame 10
                   console.log("bonus round", subtotal, index+1);
                   if(frame[1]===10){
                   subtotal += frame[1] === 10 ? frame[1] : 0;

                   }
               }
               if(scores[index+1] !== undefined && scores[index+2] !== undefined){
                   //turkey
                   if(scores[index+1][0] === 10 && scores[index+2][0] === 10){
                   subtotal += scores[index+2][0] ? 10 : 0;
                   console.log("turkey score", subtotal)
                   }
               }

           }else if (frame[0] !== 10 && (frame[0] + frame[1]) ===10){
               //spare
               console.log("spare!", subtotal);
               subtotal += frame[0] + frame[1];
               subtotal += scores[index+1] ? scores[index+1][0] : 0;

           }else{
               subtotal += frame[0] + frame[1];

           }

          accumulator += subtotal;

        if(11 !== index+1){
            // push bonus round
            calcScores.push(accumulator);
        }
        })

        console.log(calcScores)
        // @ts-ignore
        setResults(calcScores);
        return accumulator;
    }
    const CalculateResults = () => {
        let total = 0;
        let next = 0;
        let arrmock = [[10,0],[10,0],[6,4],[2,0]]
        let arr = [...Points];
            total = scoreCalculator(arr);
            console.log(total);

        return total;

    }


useEffect(()=>{
        if(Token !== ""){
            PostResult(Results).then((e)=>{
                setIsSuccess(e.success);
                console.log(e);
            });
        }
    },[Results]);
    useEffect(() => {
        fetchPoints().then(e => {
       })
    }, []);
    useEffect(() => {

        CalculateResults()
    }, [Points])
    return (


        <BowlingContext.Provider value={{
            'Points': Points,
            'IsSuccess':IsSuccess,


        }}>
            {props.children}
        </BowlingContext.Provider>
    )
}
const BowlingConsumer = BowlingContext.Consumer
export {BowlingProvider, BowlingConsumer, BowlingContext}
