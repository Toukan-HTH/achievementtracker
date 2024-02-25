<script lang="ts">
    import { onMount } from 'svelte';
    import AceEditor from "./AceEditor.svelte";
    import {achievements} from "../../src/testingenv";

    let _achievementID = 0;
    let text:string = "";
    let title = "";
    let creator = "";
    let description = "";
    let difficultyRating = 0;

    
    onMount(() =>{



        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent
            // switch incase we ever need to add specific types that should be handled different
            switch (message.type) {
                case"loadPanel":{
                    _achievementID=message.value
                    text = achievements.filter((achievement) => achievement.id==_achievementID)[0].signature;
                    title = achievements.filter((achievement) => achievement.id==_achievementID)[0].title;
                    creator = achievements.filter((achievement) => achievement.id==_achievementID)[0].creator;
                    description = achievements.filter((achievement) => achievement.id==_achievementID)[0].description;
                    difficultyRating = achievements.filter((achievement) => achievement.id==_achievementID)[0].difficultyRating;
                }
            }
            //console.log("Recieved Message in webview, value is: " + message.value);
        });



})

function submit(){
    //console.log(text);
    tsvscode.postMessage({
                type:"testAchievement",
                tag:_achievementID.toString(),
                value:text
            });
}

function onChange (newValue:string) {
    text = newValue;
}


</script>


<style>
    .top-bar{
        display:flex;
        width:100%;
        font-size: 24px;
        justify-content: center;
        color: white;
    }
    .middle-bar{
        margin-top: 20px;
        width:100%;
        border: 1px solid aliceblue;
        margin-bottom:50px;
        font-size: 12px;
    }
</style>

<div class="top-bar">
    <h2>{title}</h2>
</div>
<div class="middle-bar">
    <h1>Description:</h1>
    <h2>{description}</h2>
</div>

<div class="editor-div">
    <AceEditor
    on:selectionChange={(obj) => console.log("1" + obj.detail)}
    on:paste={(obj) => console.log("2" + obj.detail)}
    on:input={(obj) => {onChange(obj.detail.toString())}}
    on:focus={() => console.log('focus')}
    on:documentChange={(obj) => {onChange(obj.toString())}}
    on:cut={() => console.log('cut')}
    on:cursorChange={() => console.log('cursor change')}
    on:copy={() => console.log('copy')}
    on:init={(editor) => console.log("4" + editor.detail)}
    on:commandKey={(obj) => console.log("5" + obj.detail)}
    on:changeMode={(obj) => console.log(`change mode : ${obj.detail}`)}
    on:blur={() => console.log('blur')}
    width='100%'
    height='500px'
    lang="json"
    theme="chrome"
    value={text} />
</div>

<div class="bottom-bar">
    <button on:click={submit}>Submit</button>
    <h2>creator: {creator}</h2>

</div>





