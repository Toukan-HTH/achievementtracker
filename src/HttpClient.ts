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


    async getAllSubbed(){
        return await (await axios.get('http:/localhost:5000/subs'));
    }

    async updateSubs(achievements:Number[],collections:Number[]){
        axios.put('http:/localhost:5000/subs/0',{achievement_subs:achievements.map(Number),collection_subs:collections.map(Number)});
    }

    async updateAchievement(id:number){
        axios.patch("http:/localhost:5000/achievements?id=1", {"test":true});
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