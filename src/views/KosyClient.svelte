<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { KosyClient, KosyClientEvent } from "../lib/lib";

    export let hostClientUuid: string;
    export let clientUuidSwitchingSeat: string;
    export let client: KosyClient;

    const dispatch = createEventDispatcher<KosyClientEvent<any, any, any>>();

    let onDelete = () => {
        dispatch("delete", { clientUuid: client.info.clientUuid });
    };

    let onSwitchSeat = () => {
        dispatch("switch-seat", { clientUuid: client.info.clientUuid });
    };

    let onMakeHost = () => {
        dispatch("make-host", { clientUuid: client.info.clientUuid });
    }
</script>

<div class="client" class:host={ client.info.clientUuid === hostClientUuid }>
    <slot></slot>
    <div class="client-footer clearfix">
        <div style="float:left" class="client-info">
            {#if client.info.clientUuid === hostClientUuid}
                <span class="client-info-host">Host: </span>
            {/if}
            <span class="client-info-name">{client.info.clientName}</span>
            <br/>
            <span class="client-info-location">
                {#if client.info.seatNumber >= 0}
                    Seat: {client.info.seatNumber + 1}
                {:else}
                    Unknown seat: {JSON.stringify(client.info)}
                {/if}
            </span>
        </div>
        <div style="float: right" class="rounded-buttons">
            <button class="btn-switch" class:switching={ clientUuidSwitchingSeat === client.info.clientUuid } on:click={onSwitchSeat}>
                <span>Switch seat</span>
                <i class="icon-switch"></i>
            </button>
            {#if client.info.clientUuid !== hostClientUuid}
                <button class="btn-switch" on:click={onMakeHost}>
                    <span>Make host</span>
                </button>
            {/if}
            <button class="btn-remove" on:click={onDelete}>
                <span>Remove from table</span>
                <i class="icon-trash"></i>
            </button>
        </div>
    </div>
</div>