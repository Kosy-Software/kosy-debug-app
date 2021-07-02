<script lang="ts">
    import { getContext } from "svelte";
    import { storeState } from "../lib/stateStorage";

    export let appUrl: string;

    let { close } = getContext("simple-modal");
    let confirmSetup = () => {
        storeState({ "app-url": appUrl });
        close();
    }

    let cancelSetup = () => {
        close();
    }
</script>

<div class="change-app-url">
    <label for="app-url">App URL</label>
    <input name="app-url" class="full-width rounded-input" placeholder="https://my.awesome.integration.com" bind:value={appUrl} />
    <span class="gutter"></span>
    <div class="centered">
        <button id="confirm" class="btn-primary btn-rounded" on:click={confirmSetup}>Change app URL</button>
    </div>
    <div class="centered">
        <button id="cancel" class="btn-secondary" on:click={cancelSetup}>Cancel</button>
    </div>
</div>