<script lang="ts">
    import { onMount } from 'svelte';
    let _achievementID = 0;
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


</script>

<h2>{_achievementID}</h2>
