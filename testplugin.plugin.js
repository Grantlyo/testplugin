/**
 * @name testplugin
 * @author Grant
 * @description Highlights messages containing a specified substring in the current channel.
 * @version 1.0.0
 * @source https://github.com/grantlyo/testplugin
 */

module.exports = class MessageHighlighter {
    constructor() {
        this.substring = "tree"; // Default substring to highlight
        this.highlightColor = "rgba(255, 215, 0, 0.3)"; // Highlight color (gold with transparency)
    }

    getName() { return "MessageHighlighter"; }
    getDescription() { return "Highlights messages containing a specified substring in the current channel."; }
    getVersion() { return "1.0.0"; }
    getAuthor() { return "YourName"; }

    start() {
        this.applyHighlighting();
        this.observer = new MutationObserver(this.handleMutations.bind(this));
        this.observer.observe(document.querySelector(".messages-wrapper"), { childList: true, subtree: true });
    }

    stop() {
        this.observer.disconnect();
        this.removeHighlighting();
    }

    applyHighlighting() {
        const messages = document.querySelectorAll(".message-content");
        messages.forEach(message => {
            if (message.textContent.includes(this.substring)) {
                this.highlightMessage(message);
            }
        });
    }

    removeHighlighting() {
        const highlightedMessages = document.querySelectorAll(".message-highlighted");
        highlightedMessages.forEach(message => {
            message.style.backgroundColor = "";
            message.classList.remove("message-highlighted");
        });
    }

    highlightMessage(message) {
        message.style.backgroundColor = this.highlightColor;
        message.classList.add("message-highlighted");
    }

    handleMutations(mutations) {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.querySelector && node.querySelector(".message-content")) {
                    const message = node.querySelector(".message-content");
                    if (message.textContent.includes(this.substring)) {
                        this.highlightMessage(message);
                    }
                }
            });
        });
    }

    getSettingsPanel() {
        return `
            <div>
                <label for="substring">Substring to Highlight:</label>
                <input id="substring" type="text" value="${this.substring}" />
                <button onclick="updateSubstring()">Update</button>
            </div>
            <script>
                function updateSubstring() {
                    const substring = document.getElementById("substring").value;
                    BdApi.getPlugin("MessageHighlighter").substring = substring;
                    BdApi.getPlugin("MessageHighlighter").applyHighlighting();
                }
            </script>
        `;
    }
};
