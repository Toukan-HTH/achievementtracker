<script lang="ts" context="module">
    import axios, { type AxiosInstance, type AxiosResponse } from "axios";
    import { arrayBuffer, json } from "stream/consumers";

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
</script>