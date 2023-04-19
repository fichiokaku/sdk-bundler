import { attach, initializeWsProxy } from "@polyflow/sdk";

window.addEventListener("DOMContentLoaded", () => {
    initializeWsProxy();
});

window.addEventListener("load", () => {
    attach("API_KEY");
});
