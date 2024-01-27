<script lang="ts" context="module">
    import axios, { type AxiosInstance, type AxiosResponse } from "axios";
    import { arrayBuffer, json } from "stream/consumers";
    import * as fs from 'fs';
    import type { ExecException } from 'child_process';















    export const achievementTags = [
        "500_commits",
        "create_repo"
    ];
    async function getAllRepos(instance: AxiosInstance){
        let Repos: string[] = []
        await instance.get("https://api.github.com/user/repos").then(async (response) => {
                response.data.forEach((element: {name:string}) => {
                    Repos.push(element.name);
                });
            }).catch((err) => {
            })
        return Repos;
    };

    async function getAllCommitShas(instance:AxiosInstance,repoName:string,user:string){
        let commitShas: string[] = [];
        const commitsPerRepo = await instance.get("https://api.github.com/repos/"+user+ "/" + repoName + "/commits").then(async (response) => {
                    if(response.status==200){
                        response.data.forEach((element: {sha:string,committer:{login:string}}) => {
                        if(element.committer.login==user){
                            commitShas.push(element.sha);
                        }
                    });
                    }}).catch((error) => {
                    //TODO find a way to handle 404 errors , ie when no commits are connected to a repo, maybe a check for >0 commits before?
                    //console.clear(); 
                });
        return commitShas;
    }


    function getNumberOfCommittedLines(instance:AxiosInstance,repoNames:string[], user:string, upperLimit:number){
        let localHoldValue = 0;
        let commitNumbers:number[] = [];


        var bar = new Promise<number>(async (resolve, reject) => {


            for (let index = 0; index < repoNames.length; index++) {
                var commitShas =  await getAllCommitShas(instance,repoNames[index],user);

                for (let y = 0; y < commitShas.length; y++) {
                    const commitedLinesPerSha =  await instance.get("https://api.github.com/repos/"+user+ "/" + repoNames[index] + "/commits/"+commitShas[y]).then(async(response:AxiosResponse<{committer:{login:string},stats:{additions:number}}>)=>{
                    if(response.data.committer.login==user){
                        commitNumbers.push(response.data.stats.additions);
                        localHoldValue += response.data.stats.additions;
                        if(localHoldValue>=upperLimit){
                            resolve(upperLimit);
                        }
                    }
                    }).catch((error) => {

                    })
                
                }
                if(index+1 == repoNames.length){
                    resolve(commitNumbers.reduce((accumulator, currentValue) => { return accumulator + currentValue},0));
                }
                
            }});


        bar.then(() => {

        });
        return bar;
    }

    function getNumberOfRepositories(repos:string[], upperLimit:number){
        let localHoldValue = 0
        var bar = new Promise<number>(async (resolve, reject) => {
            repos.forEach(() => {
                localHoldValue++;
                if(localHoldValue>=upperLimit){
                    resolve(upperLimit);
                }
            });
            // every repo should have been counted by this point, return the total number of repos counted
            resolve(localHoldValue);
        })
        return bar;
    }

    function calculateNumberOfReposUsingLanguage(repos:string[], upperLimit:number, language:string, token:string, user:string, instance:AxiosInstance){
        let localHoldValue = 0;
        let localRepoCounter = 0;
        var bar = new Promise<boolean>(async (resolve,reject) => {
            repos.forEach(async (element) => {
                // find out if repo with name x uses language y
                const languageListPerRepo =  await instance.get("https://api.github.com/repos/"+user+ "/" + element + "/languages").then(async(response)=>{
                        if(response.status==200){
                            const arr = [...new Map(Object.entries(response.data))];
                            arr.forEach(element => {
                                if(element[0].toString().toLowerCase()==language.toLowerCase()){
                                    console.log(element[0] + " is the value were testing against " + language);
                                    localHoldValue++;
                                    if(localHoldValue>=upperLimit){
                                        resolve(true);
                                    }
                                }
                            })
                        }
                    }).catch((error) => {

                    })
                    // we finished 1 repo, check if its the last one and if we have not resolved yet, return false
                    localRepoCounter++;
                    console.log(localRepoCounter+ "is the current iteration, the total length is: "+ repos.length);
                    if(localRepoCounter>=repos.length){
                        resolve(false);
                    }
            })
        })
        return bar;
    }

    export async function getNumberOfCommits(token:string , upperLimit:number, user:string){
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        let repoNames: string[] = await getAllRepos(instance);

        //let commitShas: string[] = await getAllCommitShas(instance, repoNames, user);

        let numbersOfCommittedLines = await getNumberOfCommittedLines(instance,repoNames,user,upperLimit);


         return numbersOfCommittedLines;
    }


    export async function getNumberOfRepos(token:string, upperLimit:number){
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        let repoNames: string[] = await getAllRepos(instance);
        return getNumberOfRepositories(repoNames,upperLimit);
    }

    export async function getNumberOfReposUsingLanguage(token:string, upperLimit:number, language:string, user:string){
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        let repoNames: string[] = await getAllRepos(instance);
        return calculateNumberOfReposUsingLanguage(repoNames,upperLimit,language,token,user,instance);
    }

    export async function getNumberOfFollowers(token:string, upperLimit:number, user:string) {
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        var bar = new Promise<number>(async (resolve,reject) => {
            // find out if repo with name x uses language y
            const languageListPerRepo =  await instance.get("https://api.github.com/users/"+user).then(async(response:AxiosResponse<{followers:number}>)=>{
                    if(response.status==200){
                        if(response.data.followers>=upperLimit){
                            resolve(upperLimit);
                        }else{
                            resolve(response.data.followers);
                        }
                    }
                }).catch((error) => {

                })
        })
        return bar;
    }

    export async function getUserCollaboratorNumber(token:string, upperLimit:number) {
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        var bar = new Promise<number>(async (resolve,reject) => {
            // find out if repo with name x uses language y
            const languageListPerRepo =  await instance.get("https://api.github.com/user/repos?affiliation=collaborator").then(async(response:AxiosResponse<[{id:number}]>)=>{
                    if(response.status==200){
                        if(response.data.length>=upperLimit){
                            resolve(upperLimit);
                        }else{
                            resolve(response.data.length);
                        }
                    }else{
                        resolve(0);
                    }
                }).catch((error) => {
                    resolve(0);
                })
        })
        return bar;
    }

    export async function getUserFollowage(token:string, upperLimit:number, user:string) {
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        var bar = new Promise<number>(async (resolve,reject) => {
            // find out if repo with name x uses language y
            const languageListPerRepo =  await instance.get("https://api.github.com/users/" + user + "/following").then(async(response:AxiosResponse<[]>)=>{
                    if(response.status==200){
                        if(response.data.length>=upperLimit){
                            resolve(upperLimit);
                        }else{
                            resolve(response.data.length);
                        }
                    }else{
                        resolve(0);
                    }
                }).catch((error) => {
                    resolve(0);
                })
        })
        return bar;
    }


    export async function getUserForkedNumber(token:string, upperLimit:number, user:string) {
        let localHoldValue = 0;
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        var bar = new Promise<number>(async (resolve,reject) => {
            // find out if repo with name x uses language y
            const languageListPerRepo =  await instance.get("https://api.github.com/users/" + user + "/repos").then(async(response:AxiosResponse<[{forks:number}]>)=>{
                    if(response.status==200){
                        response.data.forEach(element => {
                            localHoldValue += element.forks;
                            if(localHoldValue>=upperLimit){
                                resolve(upperLimit);
                            }
                            if(element === response.data[response.data.length-1]){
                                resolve(localHoldValue);
                            }
                        });
                    }else{
                        resolve(0);
                    }
                }).catch((error) => {
                    resolve(0);
                })
        })
        return bar;
    }

    export async function getNumberOfIssuesCreated(token:string, upperLimit:number) {
        let localHoldValue = 0;
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        var bar = new Promise<number>(async (resolve,reject) => {
            // find out if repo with name x uses language y
            const languageListPerRepo =  await instance.get("https://api.github.com/issues?state=all").then(async(response:AxiosResponse<[{state:string}]>)=>{
                    if(response.status==200){
                        response.data.forEach(element => {
                            localHoldValue += 1;
                            if(localHoldValue>=upperLimit){
                                resolve(upperLimit);
                            }
                            if(element === response.data[response.data.length-1]){
                                resolve(localHoldValue);
                            }
                        });
                    }else{
                        resolve(0);
                    }
                }).catch((error) => {
                    resolve(0);
                })
        })
        return bar;
    }

    export async function getNumberOfCompletedIssues(token:string, upperLimit:number, login:string) {
        let localHoldValue = 0;
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        var bar = new Promise<number>(async (resolve,reject) => {
            // find out if repo with name x uses language y
            const languageListPerRepo =  await instance.get("https://api.github.com/issues?state=closed").then(async(response:AxiosResponse<[{state:string,assignee:{login:string}}]>)=>{
                    if(response.status==200){
                        response.data.forEach(element => {
                            if(element.state=="closed" && element.assignee.login==login){
                                localHoldValue++;
                            }
                            if(localHoldValue>=upperLimit){
                                resolve(upperLimit);
                            }
                            if(element === response.data[response.data.length-1]){
                                resolve(localHoldValue);
                            }
                        });
                    }else{
                        resolve(0);
                    }
                }).catch((error) => {
                    resolve(0);
                })
        })
        return bar;
    }

    export async function getNumberOfPullRequestsClosed(token:string, upperLimit:number, login:string) {
        const instance = axios.create({
                headers: {"Authorization":'Bearer '+ token}
            });
        var bar = new Promise<number>(async (resolve,reject) => {
            // find out if repo with name x uses language y
            const languageListPerRepo =  await instance.get("https://api.github.com/search/issues?q=author:"+login+"+type:pr+is:closed").then(async(response:AxiosResponse<{total_count:number}>)=>{
                    if(response.status==200){
                        if(response.data.total_count>=upperLimit){
                            resolve(upperLimit);
                        }else{
                            resolve(response.data.total_count);
                        }
                    }else{
                        resolve(0);
                    }
                }).catch((error) => {
                    resolve(0);
                })
        })
        return bar;        
    }
</script>