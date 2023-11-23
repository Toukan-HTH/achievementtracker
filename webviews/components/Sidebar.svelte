<script lang="ts">
    import { onMount } from 'svelte';
    import CollapsibleSection from './CollapsibleSection.svelte'
    import Medal from './Medal.svelte'
    import axios, {isCancel, AxiosError, type AxiosResponse} from 'axios';
    import {achievementTags,getNumberOfCommits} from './ScriptsRepository.svelte'



    let medal = Medal
    let validatedToken = false;
    let invalidTokenRecieved = false;
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
                    validateToken();
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
        const percent = (x / y) * 100
        return percent.toFixed(fixed) ;
    }

    async function logOutUser(){
        await tsvscode.postMessage({
                            type:'deleteData',
                            tag: '',
                            value:"at_token"
                        });
                        validatedToken=false;
    }

    function validateToken() {
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
                    <h2 class="title">Create a reposotiry</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">Create your very first github repository!</h4>
                    <div class="check-box"></div>
                </div>
                <div class="bottom-row">
                    <div class="progress-container">
                        <div class="progress" style="width: 0%">0/1</div>
                      </div>
                </div>
            </div>
        </CollapsibleSection>
        <div class="separator"></div>
        <CollapsibleSection headerText={'Social'} >
            <div class="content">
                    Look at all this fun content
            </div>
        </CollapsibleSection>
        <div class="separator"></div>
        <CollapsibleSection headerText={'Knowledge'} >
            <div class="content">
                    Look at all this fun content
            </div>
        </CollapsibleSection>
    </div>
    {:else}
    {void checkIfValidTokenExists() ?? ""}
        <div>
            <input type="text" bind:value={tokenInput}>
            <button on:click={validateToken}>Submit Token</button>
        </div>
    {#if invalidTokenRecieved}
        <div class="error-message">
            <h2>The Token is not valid or has expired, please try again</h2>
        </div>
    {/if}
{/if}