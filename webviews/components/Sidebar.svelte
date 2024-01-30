<script lang="ts">
    import { onMount } from 'svelte';
    import CollapsibleSection from './CollapsibleSection.svelte'
    import Medal from './Medal.svelte'
    import axios, {isCancel, AxiosError, type AxiosResponse} from 'axios';




    let medal = Medal

    onMount(() =>{



        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent

            // switch incase we ever need to add specific types that should be handled different
            switch (message.type) {
                case(message.type == "testAchievement"):{
                    console.log(message.value)
                }
            }
            //console.log("Recieved Message in webview, value is: " + message.value);
        });

        

    })

    function test(){
        try {
            tsvscode.postMessage({
                type:"testAchievement",
                tag:"test_1",
                value:`
                    export function dynamicMethod() {
                        console.log("Hello from dynamic method!");
                        return 8;
                    }
                    `
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

<div class="wrapper">
    <div class="header">
        <button on:click={test}>Manage</button>
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
                    <div class="progress" style="width: 0%">Fetching...</div>
                    </div>
            </div>
        </div>
    </CollapsibleSection>
</div>