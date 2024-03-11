import axios, {AxiosInstance, AxiosResponse } from "axios";




export class HttpClient{
    constructor(){
    }

    async getAllAchievements(){
        return await axios.get('http:/localhost:5000/achievements').then((response) => {
            console.log("[HttpClient.ts] fetching all achievements...");
            if (response.status == 200) {
                return response.data;

            } else {
                return null;

            }
        });
    }


    async getAllCollections(){
        return await axios.get('http:/localhost:5000/collections').then((response) => {
            console.log("[HttpClient.ts] fetching all collections...");
            if (response.status == 200) {
                return response.data;

            } else {
                return null;

            }
        });
    }


    
}