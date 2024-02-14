<script lang="ts">
    import { onMount } from 'svelte';
    import CollapsibleSection from './CollapsibleSection.svelte'
    import Medal from './Medal.svelte'
    import axios, {isCancel, AxiosError, type AxiosResponse} from 'axios';
    import {achievements} from "../../src/testingenv";

    let localAchievements = achievements;
    let medal = Medal

    onMount(() =>{



        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            // switch incase we ever need to add specific types that should be handled different
            switch (message.type) {
                case(message.type == "testAchievement"):{
                    console.log(message.value)
                }
                case "updateAchievement":{
                    console.log("Sidebar webview recieved message about achievement id: " + message.value);
                    //logic to find the achievement and update it to finished, etc etc
                    localAchievements[+message.value].completed=true;
                    console.log(localAchievements[0]);
                }
            }
            //console.log("Recieved Message in webview, value is: " + message.value);
        });

        

    })

    function test(id:number){
        console.log(achievements[0]);
        try {
            tsvscode.postMessage({
                type:"testAchievement",
                tag:"test",
                value:id.toString()
            });
        } catch (error) {
            
        }
        //console.log("test");
    }








</script>

<style>
    div {
        color:#fff;
    }

    .difficultyRank{
        color: rgb(81, 255, 0);
        overflow: hidden;
    }

    .tryButton{
        height: 15px;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border:1px solid black;
    }

    .button-div{
        margin:5px;
        height: 100%;
        display: flex;
        align-self: flex-start;
        overflow: hidden;
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
        max-height: 50px;
        width: 100%;
        overflow: hidden;
        white-space: wrap;
        text-overflow: ellipsis;
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
        height:28px;
        width:23px;
        margin-right: 2px;
        border:1px solid #fff;
        justify-content: center;
        align-items: center;
        display: flex;
        border-radius: 5px;

    }
    .title{
        width:90%;
        font-size: 2vh;
        overflow: hidden;
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

<div class="wrapper">
    <div class="header">
        <button >Manage</button>
    </div>
    
    <CollapsibleSection headerText={'Achievements'}>
        {#each localAchievements as achievement}
        <div class="content">
            <div class="top-row">
                <div class="icon"><svelte:component this={medal} /></div>
                <h2 class="title">{achievement.title}</h2>
                <div class="button-div">
                    <button class="tryButton" on:click={() => test(achievement.id)}>!</button>
                </div>
                <h2 class="difficultyRank">{achievement.difficultyRating}</h2>
            </div>
            <div class="middle-row">
                <h4 class="description">{achievement.description}</h4>
                <div class="check-box"></div>
            </div>
            <div class="bottom-row">
                {#if achievement.completed}
                    <div class="progress-container">
                        <div class="progress" style="width: 100%">Completed</div>
                    </div>
                {:else}
                    <div class="progress-container">
                        <div class="progress" style="width: 0%"></div>
                    </div>
                {/if}

            </div>
        </div>
        {/each}

    </CollapsibleSection>
</div>