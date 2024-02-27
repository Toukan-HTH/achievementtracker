<script lang="ts">
    import { onMount } from 'svelte';
    import {achievements} from "../../src/testingenv";
    import Medal from './Medal.svelte'

    let localAchievements = achievements;
    let medal = Medal
    let localAchievementsSubscriptions = [0,1];

    
    onMount(() =>{



        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent
            // switch incase we ever need to add specific types that should be handled different
            switch (message.type) {
                case"loadPanel":{

                }
            }
            //console.log("Recieved Message in webview, value is: " + message.value);
        });



})






</script>


<style>
 .wrapper{
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
 }

 .achievements-div{
    display: flex;
    flex-direction: column;
    width: calc(100%/3);
    height: 90%;
    border: 3px solid #404754;
    margin:15px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
 }

 .collections-div{
    display: flex;
    flex-direction: column;
    width: calc(100%/3);
    height: 90%;
    border: 3px solid #404754;
    margin:15px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
 }

 .create-achievement-div{
    display: flex;
    flex-direction: column;
    width: calc(100%/3);
    height: 90%;
    border: 3px solid #404754;
    margin:15px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
 }

 .content{
    display: flex;
    flex-direction: row;
    padding: 5px;
    border: 1px solid whitesmoke;
    margin: 5px;
    box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
 }
 .difficultyRank{
        color: rgb(81, 255, 0);
        overflow: hidden;
 }

 .title{
        width:90%;
        font-size: 2vh;
        overflow: hidden;
    }

.titles{
    display: flex;
    width: 100%;
    justify-content: center;
}
 .description{
        color: #868686;
        max-height: 50px;
        width: 100%;
        overflow: hidden;
        white-space: wrap;
        text-overflow: ellipsis;
}
 .achievement-details{
    display: flex;
    flex-direction: column;
    width: 90%;
 }

 .top-row{
    display: flex;
    flex-direction: row;
 }

 

 .sub-button-div{
    display: flex;
    justify-content: center;
    width:10%;
    height: 100%;
    align-items: center;
    
 }

 .sub-button{
    height:25px;
    width: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
 }

 .subscribed-button{
    background-color: #069C56;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

 }

 .subscribed-button:hover {
    background-color: #D3212C;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    transition: 0.5s; 
 }

 .subscribed-button:hover .button-span::after{
    content: "\2717";
    display: flex;
    justify-content: center;

 }

 .subscribed-button:hover .button-span::before{
    display: none;
    content: "\2717";

 }


 .subscribed-button .button-span::before{
    content : "\2713";

 }



</style>

<div class="wrapper">
<div class="achievements-div">
    <h2 class="titles">Achievments</h2>
    {#each localAchievements as achievement}

    {#if localAchievementsSubscriptions.includes(achievement.id)} 
    <div class="content">
        <div class="achievement-details">
            <div class="top-row">
                <div class="icon"><svelte:component this={medal} /></div>
                <h2 class="title">{achievement.title}</h2>
                <h2 class="difficultyRank">{achievement.difficultyRating}</h2>
            </div>
            <div class="middle-row">
                <h4 class="description">{achievement.description}</h4>
            </div>
        </div>
        <div class="sub-button-div">
            <button class="sub-button subscribed-button" on:click={() => {localAchievementsSubscriptions = localAchievementsSubscriptions.filter(element => element!= achievement.id)}}><span class="button-span"></span></button>
        </div>
    </div>
    {:else}
    <div class="content">
        <div class="achievement-details">
            <div class="top-row">
                <div class="icon"><svelte:component this={medal} /></div>
                <h2 class="title">{achievement.title}</h2>
                <h2 class="difficultyRank">{achievement.difficultyRating}</h2>
            </div>
            <div class="middle-row">
                <h4 class="description">{achievement.description}</h4>
            </div>
        </div>

        <div class="sub-button-div" >
            <button class="sub-button" on:click={() => {localAchievementsSubscriptions = [...localAchievementsSubscriptions, achievement.id] }}>+</button>
        </div>
    </div>
    {/if}
    {/each}
  
</div>

<div class="collections-div">
    <h2 class="titles">Collections</h2>

</div>
<div class="create-achievement-div">
    <h2 class="titles">Achievment Creation</h2>

</div>
</div>