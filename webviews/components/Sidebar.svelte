<script lang="ts">
    import CollapsibleSection from './CollapsibleSection.svelte'
    import Medal from './Medal.svelte'
    let medal = Medal
    let validatedToken = false;
    let tokenInput = "";
    function validateToken() {
        if(!validatedToken){
            validatedToken = true;
        }
    }
</script>

<style>
    div {
        color:#fff;
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
</style>


{#if validatedToken}
    <div class="wrapper">
        <CollapsibleSection headerText={'Personal'} >
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
                        <div class="progress" style="width: 60%">300/500</div>
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
        <CollapsibleSection headerText={'Social'} >
            <div class="content">
                    Look at all this fun content
            </div>
        </CollapsibleSection>
        <CollapsibleSection headerText={'Knowledge'} >
            <div class="content">
                    Look at all this fun content
            </div>
        </CollapsibleSection>
    </div>
    {:else}
    <div>
        <input type="text" bind:value={tokenInput}>
        <button on:click={validateToken}>Submit Token</button>

    </div>
{/if}