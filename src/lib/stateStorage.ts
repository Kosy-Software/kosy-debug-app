import { DebuggerState } from './debuggerState';

const SEARCHPARAMSKEY = "url";
const LOCALSTORAGEKEY = "state";

//Provides methods to store the state on the client
export function storeState (state: DebuggerState) {
    //Fall-back for easier development :)
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(state));

    //Sets search params representing the state
    let searchParams = new URLSearchParams(window.location.search);
    searchParams.set(SEARCHPARAMSKEY, state["app-url"]);
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
    if (window.history.pushState) {
        //Sets the state url onto the scope
        window.history.pushState({ path: newurl }, '', newurl);
    } else {
        //Fallback for older browsers
        window.location.href = newurl;
    }
}

export function retrieveState (): DebuggerState {
    let searchParams = new URLSearchParams(window.location.search);
    let urlFromSearchParams = searchParams.get(SEARCHPARAMSKEY);
    if (urlFromSearchParams) {
        return { "app-url": urlFromSearchParams };
    } else {
        return JSON.parse(localStorage.getItem(LOCALSTORAGEKEY) ?? "{}");
    }
}