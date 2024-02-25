<script lang="ts">
    import { onMount } from 'svelte';



    
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

</style>

<div class="wrapper">
    <h1>Hello!</h1>
</div>