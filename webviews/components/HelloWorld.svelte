<script lang="ts">
    import { onMount } from 'svelte';
    import AceEditor from "./AceEditor.svelte";
    import "brace/mode/json";
    import "brace/theme/chrome";
    let _achievementID = 0;
    let text = "";
    
    onMount(() =>{



        window.addEventListener('message', event => {

            const message = event.data; // The JSON data our extension sent
            // switch incase we ever need to add specific types that should be handled different
            switch (message.type) {
                case"loadPanel":{
                    _achievementID=message.value
                    
                }
            }
            //console.log("Recieved Message in webview, value is: " + message.value);
        });



})

function submit(){
    tsvscode.postMessage({
                type:"testAchievement",
                tag:_achievementID.toString(),
                value:text
            });
}


</script>

<h2>{_achievementID}</h2>

<div>
<AceEditor
  on:selectionChange={(obj) => console.log(obj.detail)}
  on:paste={(obj) => console.log(obj.detail)}
  on:input={(obj) => console.log(obj.detail)}
  on:focus={() => console.log('focus')}
  on:documentChange={(obj) => console.log(`document change : ${obj.detail}`)}
  on:cut={() => console.log('cut')}
  on:cursorChange={() => console.log('cursor change')}
  on:copy={() => console.log('copy')}
  on:init={(editor) => console.log(editor.detail)}
  on:commandKey={(obj) => console.log(obj.detail)}
  on:changeMode={(obj) => console.log(`change mode : ${obj.detail}`)}
  on:blur={() => console.log('blur')}
  width='100%'
  height='300px'
  lang="json"
  theme="chrome"
  value={text} />
</div>

<button on:click={submit}>Submit</button>
