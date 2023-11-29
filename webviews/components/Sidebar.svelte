<script lang="ts">
    import { onMount } from 'svelte';
    import CollapsibleSection from './CollapsibleSection.svelte'
    import Medal from './Medal.svelte'
    import axios, {isCancel, AxiosError, type AxiosResponse} from 'axios';
    import {achievementTags,
        getNumberOfCommits,
    getNumberOfRepos,
    getNumberOfReposUsingLanguage,
    getNumberOfFollowers,
    getUserCollaboratorNumber,
    getUserFollowage,
    getUserForkedNumber,
    getNumberOfIssuesCreated,
    getNumberOfCompletedIssues,
    getNumberOfPullRequestsClosed} from './ScriptsRepository.svelte'



    let medal = Medal
    let validatedToken = false;
    let invalidTokenRecieved = false;
    let loggedOut = false;
    let tokenInput = "";
    let oldLoginName = "";
    let tagMap = new Map();

    onMount(() =>{
        //Setting up the in webview key value store for runtime use
        achievementTags.forEach(element => {
            tagMap.set(element, 0);
        });


        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            // switch incase we ever need to add specific types that should be handled different
            switch (message.type) {
                case 'at_token':
                    tokenInput = message.value;
                    validateToken("code");
                    break;
                case 'login_name':
                    oldLoginName = message.value;
                    break;
            }
            console.log("Recieved Message in webview, value is: " + message.value);
            tagMap.set(event.type,Number(message.value));
            console.log(tagMap.get(event.type) + " is the tag");
        });

        
        tsvscode.postMessage({
            type: "updateRuntimeStore",
            tag:"",
            value:Array.from(tagMap.keys())
        });

    })

    function calcPercentage(x:number, y:number, fixed = 2) {
        if(x==0 || y==0){return 0}
        const percent = (x / y) * 100
        return percent.toFixed(fixed) ;
    }

    async function logOutUser(){
        await tsvscode.postMessage({
                            type:'deleteData',
                            tag: '',
                            value:"at_token"
                        });
                        loggedOut = true;
                        validatedToken=false;
    }

    function validateToken(source:string) {
        if(source=="button"){
            loggedOut=false;
        }
        if(!validatedToken){
            const instance = axios.create({
                baseURL: "https://api.github.com/user",
                headers: {"Authorization":'Bearer '+ tokenInput}
            })
             const response = instance.get("https://api.github.com/user").then(async (response: AxiosResponse<{login:string}>) => {
                console.log(response.data);

                if(response.status === 200){
                    if(oldLoginName != response.data.login && oldLoginName != ""){
                        await tsvscode.postMessage({
                            type:'resetStorage',
                            tag: '',
                            value:Array.from(tagMap.keys())
                        });

                        tagMap.clear();

                        achievementTags.forEach(element => {
                            tagMap.set(element, 0);
                        });

                        oldLoginName = response.data.login;
                    }


                    await tsvscode.postMessage({
                        type:'saveData',
                        tag: 'at_token',
                        value:tokenInput
                    });

                    await tsvscode.postMessage({
                        type:'saveData',
                        tag: 'login_name',
                        value:response.data.login
                    });
                    invalidTokenRecieved = false;
                    validatedToken = true;
                }
                
            
            }).catch((error) => {
                console.log("Token was not valid" + error);
                tokenInput = "";
                invalidTokenRecieved = true;
                validatedToken = false;
            
            });
        }
    }

    function checkIfValidTokenExists(){
        try {
            tsvscode.postMessage({
                type:"retrieveData",
                tag:"at_token",
                value:""
            });
            tsvscode.postMessage({
                type:"retrieveData",
                tag:"login_name",
                value:""
            });
        } catch (error) {
            console.log("Error while fetching token " + error);
        }
    }
</script>

<style>
    div {
        color:#fff;
    }

    .separator{
        height:2px;
        width:100%;
    }
    .wrapper{
        display: flex;
        padding: 5px;
        flex-direction: column;
    }
    .content{
        border:1px solid #AF997B;
        background-color:rgb(71, 64, 64);
        border-radius: 5px;
        width: 95%;
        margin:5px auto;
        display: flex;
        flex-direction: column;;
    }
    .description{
        color: #868686;
    }
    .top-row{
        display: inline-flex;
        flex:1;
        margin-top: 5px;
        margin-left: 5px;
        margin-right: 5px;
    }
    .middle-row{
        display: inline-flex;
        flex:2;
        margin: 5px;
    }
    .bottom-row{
        display: inline-flex;
        flex:3;
        width:95%;
        margin-bottom: 5px;
        margin-left: 5px;
        margin-right: 5px;
    }
    .icon{
        width:10%;
        margin-right: 2px;
        border:1px solid #fff;
        justify-content: center;
        align-items: center;
        display: flex;
        border-radius: 5px;

    }
    .title{
        width:90%;
    }
    .progress-container {
      height: 3px;
      background-color: #ddd;
      border-radius: 5px;
      width:100%;
    }
    .progress {
      height: 3px;
      border-radius: 2px;
      background-color: turquoise;
      color: #fff;
      font-size: 10px;
      text-align: center;
      line-height: 3px;
    }

    .error-message{
        font-size: 8px;
        border:1px solid #fff;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        color: red;
        margin: 10px;
        padding: 2px;
    }
    .buttons{
        margin:5px;
    }
</style>


{#if validatedToken}
    <div class="wrapper">

        <div class="buttons">
            <button on:click={logOutUser}>Logout</button>
        </div>
        
        <CollapsibleSection headerText={'Personal'}>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Commit 500 lines</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Commit 500 lines of code to your github account</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfCommits(tokenInput , 500, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,500)}%">{value}/500</div>
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Commit 5000 lines</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Commit 5000 lines of code to your github account</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfCommits(tokenInput , 5000, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,5000)}%">{value}/5000</div>
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Commit 50 000 lines</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Commit 50 000 lines of code to your github account</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfCommits(tokenInput , 50000, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,50000)}%">{value}/50000</div>
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Commit 500 000 lines</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Commit 500 000 lines of code to your github account</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfCommits(tokenInput , 500000, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,500000)}%">{value}/500000</div>
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Create a reposotiry</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Create your very first github repository!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfRepos(tokenInput , 1)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,1)}%">{value}/1</div>
                        {/await}
                      </div>
                </div>
            </div>


            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Create a issue</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Create your very first github issue!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfIssuesCreated(tokenInput , 1)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,1)}%">{value}/1</div>
                        {/await}
                      </div>
                </div>
            </div>


            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Close 5 issues</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Have atleast 5 issues that was assigned to you be closed as completed</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfCompletedIssues(tokenInput , 5, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,5)}%">{value}/5</div>
                        {/await}
                      </div>
                </div>
            </div>


            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Have a pull request you created be closed</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Have a pull request you created be resolved as such it gets tagged as closed</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfPullRequestsClosed(tokenInput , 1, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,1)}%">{value}/1</div>
                        {/await}
                      </div>
                </div>
            </div>


        </CollapsibleSection>
        <div class="separator"></div>


        <CollapsibleSection headerText={'Social'} >
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Obtain 5 followers on GitHub!</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Have 5 people follow you on github, making them able to better keep up to date with your progress!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfFollowers(tokenInput , 5, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,5)}%">{value}/5</div>
                        {/await}
                      </div>
                </div>
            </div>


            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Collaborate on a repository!</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Be listed as a collaborator on atleast 1 repository</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getUserCollaboratorNumber(tokenInput , 1)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,1)}%">{value}/1</div>
                        {/await}
                      </div>
                </div>
            </div>


            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Collaborate on 5 Repositories!</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Be listed as a collaborator on atleast 5 Repositories</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getUserCollaboratorNumber(tokenInput , 5)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,5)}%">{value}/5</div>
                        {/await}
                      </div>
                </div>
            </div>

            
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Follow atleast 3 people</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Follow atleast 3 users on github to keep yourself up to date with the users contributions</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getUserFollowage(tokenInput , 3, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,3)}%">{value}/3</div>
                        {/await}
                      </div>
                </div>
            </div>


            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Fork atleast 1 repository</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Fork a repository so that you can make your own changes on a existing codebase!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getUserForkedNumber(tokenInput , 1, oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value} 
                            <div class="progress" style="width: {calcPercentage(value,1)}%">{value}/1</div>
                        {/await}
                      </div>
                </div>
            </div>
        </CollapsibleSection>


        <div class="separator"></div>
        <CollapsibleSection headerText={'Knowledge'} >
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write Javascript</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use javascript!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "JavaScript", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write C</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use C!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "C", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write C++</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use C++!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "C++", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write C#</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use C#!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "C#", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write Go</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use Go!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "Go", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write Java</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use Java!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "Java", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write PHP</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use PHP!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "PHP", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write Python</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use Python!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "Python", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write Ruby</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use Ruby!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "Ruby", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write Scala</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use Scala!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "Scala", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write Swift</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use Swift!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "Swift", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
            <div class="content">
                <div class="top-row">
                    <div class="icon"><svelte:component this={medal} /></div>
                    <h2 class="title">Write TypeScript</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Use TypeScript!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        {#await getNumberOfReposUsingLanguage(tokenInput , 1, "TypeScript", oldLoginName)}
                        <div class="progress" style="width: 0%">Fetching...</div>
                        {:then value}
                        {#if value}
                            <div class="progress" style="width: 100%">Completed</div>
                        {:else}
                            <div class="progress" style="width: 0%">Incomplete</div>
                        {/if}
                        {/await}
                      </div>
                </div>
            </div>
        </CollapsibleSection>
    </div>
    {:else}
    {void checkIfValidTokenExists() ?? ""}
        <div>
            <input type="text" bind:value={tokenInput}>
            <button on:click={() => validateToken("button")}>Submit Token</button>
        </div>
    {#if invalidTokenRecieved && !loggedOut}
        <div class="error-message">
            <h2>No valid token found, please log in</h2>
        </div>
    {/if}
{/if}