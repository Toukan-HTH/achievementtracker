<script lang="ts">
    import { onMount } from 'svelte';
    import {achievements} from "../../src/testingenv";
    import Medal from './Medal.svelte'
    import AceEditor from './AceEditor.svelte';
    import {HttpClient} from '../../src/HttpClient'
    let httpClient = new HttpClient();
    let localAchievements: any[] = [];
    let medal = Medal
    let localAchievementsSubscriptions : number[] = [];
    let localCollectionsSubscriptions : number[]= [];
    let localHardCodedCollections: any[] =  [];


    let generationFunction = "";
    let validationFunction = "";
    let compareFunction = "";
    let difficultyRating = 0;
    let description = "";
    let title = "";
    let creator = "";
    let signature = "";

    async function oninit(){
        localHardCodedCollections = await httpClient.getAllCollections();
        localAchievements = await httpClient.getAllAchievements();
        const subs = await httpClient.getAllSubbed();
        localAchievementsSubscriptions= subs.data[0].achievement_subs;
        localCollectionsSubscriptions = subs.data[0].collection_subs;
    }
    
    onMount(() =>{
        oninit();
        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent
            // switch incase we ever need to add specific types that should be handled different
            switch (message.type) {
                case"loadPanel":{
                    console.log("[ManagePage.svelte] test");
                }



            }
            //console.log("Recieved Message in webview, value is: " + message.value);
        });



})

async function testhttp(){
    console.log("were in the svelte component");
    try {
            tsvscode.postMessage({
                type:"testStorage",
                tag:"Manager",
                value:"0"
            });
        } catch (error) {
            console.log(error);
        }
}

function sanityCheck(array:number[],id:number){
    let s = false;
    array.forEach(element => {
        //console.log("Checking, " + element + " versuse: " + id);
        if(element == id){
            //console.log("WE FOUND A MATCH")
            s = true;
        }
    })
    //console.log("returning... " + s);
    return s;
}

    async function handleAchievementUnsubscribement(id:number){
    localAchievementsSubscriptions = localAchievementsSubscriptions.filter(element => element!= id) // handle the webview local version

    await httpClient.updateSubs(localAchievementsSubscriptions,localCollectionsSubscriptions);

}


    async function handleAchievementSubscription(id:number){
    localAchievementsSubscriptions = [...localAchievementsSubscriptions, id];

    await httpClient.updateSubs(localAchievementsSubscriptions,localCollectionsSubscriptions);
}

function handleCollectionUnsubscribement(id:number){
    localCollectionsSubscriptions = localCollectionsSubscriptions.filter(element => element!= id); // handsle the webview local version
    localHardCodedCollections.filter( element => element.id == id)[0].achievement_ids.forEach((element: number) => {
        handleAchievementUnsubscribement(element);
    });
}

function handleCollectionSubscription(id:number){
    
    localCollectionsSubscriptions = [...localCollectionsSubscriptions, id];
    localHardCodedCollections.filter( element => element.id == id)[0].achievement_ids.forEach((element: number) => {
        handleAchievementSubscription(element);
    });

}




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
    align-items: center;
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

 .collection-details{
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
    {#if sanityCheck(localAchievementsSubscriptions,achievement.id)} 
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
            <button class="sub-button subscribed-button" on:click={() => {console.log("Removing" + achievement.id); handleAchievementUnsubscribement(achievement.id)}}><span class="button-span"></span></button>
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
            <button class="sub-button" on:click={() => {handleAchievementSubscription(achievement.id) }}>+</button>
        </div>
    </div>
    {/if}
    {/each}
  
</div>

<div class="collections-div">
    <h2 class="titles">Collections</h2>
    {#each localHardCodedCollections as collection}
    {#if sanityCheck(localCollectionsSubscriptions,collection.id)}
        <div class="content">
            <div class="collection-details">
                <div class="top-row">
                    <h2 class="title">{collection.title}</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">
                        {collection.description}
                    </h4>
                </div>
            </div>
            <div class="sub-button-div">
                <button class="sub-button subscribed-button" on:click={() => {handleCollectionUnsubscribement(collection.id)}}><span class="button-span"></span></button>
            </div>
        </div>
        {:else}
        <div class="content">
            <div class="collection-details">
                <div class="top-row">
                    <h2 class="title">{collection.title}</h2>
                </div>
                <div class="middle-row">
                    <h4 class="description">
                        {collection.description}
                    </h4>
                </div>
            </div>
            <div class="sub-button-div" >
                <button class="sub-button" on:click={() => {handleCollectionSubscription(collection.id) }}>+</button>
            </div>
        </div>
        {/if}
    {/each}
    

</div>
<div class="create-achievement-div">
    <h2 class="titles">Achievment Creation</h2>
    <h3 class="titles">Generation Function</h3>
    <input style="width:80%;" type="text" bind:value={generationFunction}>
    <h3 class="titles">Validation Function</h3>
    <input style="width:80%;" type="text" bind:value={validationFunction}>
    <h3 class="titles">Compare Function</h3>
    <input style="width:80%;" type="text" bind:value={compareFunction}>
    <h3 class="titles">Difficulty Rating</h3>
    <input style="width:80%;" type="text" bind:value={difficultyRating}>
    <h3 class="titles">Description</h3>
    <input style="width:80%;" type="text" bind:value={description}>
    <h3 class="titles">Title</h3>
    <input style="width:80%;" type="text" bind:value={title}>
    <h3 class="titles">Creator</h3>
    <input style="width:80%;" type="text" bind:value={creator}>
    <h3 class="titles">Signature</h3>
    <input style="width:80%;" type="text" bind:value={signature}>
    <button style="width: 60px;height:30px;">Submit</button>
</div>
</div>