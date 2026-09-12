const apologies = {

    /*
    ==========================================
    1. LISTEN
    ==========================================
    */

    listen: {

        emoji: "🥺",

        title: "I Should Have Listened",

        message:
            "You were trying to tell me something, and I didn't really listen.\n\nInstead, I immediately responded with my own point of view.\n\nI realize now that sometimes you don't need me to explain why something has to be done.\n\nYou just need me to stop, listen, and understand what you're trying to say.\n\nI'm sorry I didn't do that.\n\nI Love You SHITAL ❤️"

    },


    /*
    ==========================================
    2. DISMISSED
    ==========================================
    */

    dismissed: {

        emoji: "😔",

        title: "I Dismissed You",

        message:
            "When you complained about it, I said, \"Everyone has to do this.\"\n\nI know I probably meant it differently in my head, but I understand how it must have sounded to you.\n\nLike your concern wasn't important.\n\nLike you were supposed to simply accept it because everyone else does.\n\nI should have understood what you were actually trying to tell me instead of dismissing it with that one sentence.\n\nI'm sorry.\n\nI Love You SHITAL ❤️"

    },


    /*
    ==========================================
    3. LESSON
    ==========================================
    */

    lesson: {

        emoji: "🫂",

        title: "It Wasn't a Lesson for You",

        message:
            "I know you feel like this whole thing was a learning or a slap for you.\n\nBut honestly, I don't want you to take it that way.\n\nYou weren't wrong for saying what bothered you.\n\nAnd maybe the bigger lesson here wasn't for you at all.\n\nMaybe it was for me.\n\nTo listen when you tell me something instead of immediately trying to justify it or saying, \"Everyone has to do this.\"\n\nI should have understood you better.\n\nI Love You SHITAL ❤️"

    },


    /*
    ==========================================
    4. UNDERSTAND
    ==========================================
    */

    understand: {

        emoji: "🥹",

        title: "I Get It Now",

        message:
            "I've thought about what you said.\n\nAnd I think I understand why this affected you the way it did.\n\nIt wasn't simply about having to do something.\n\nIt was about you telling me how you felt about it, and me not really hearing you.\n\nI was too busy trying to explain my side.\n\nI should have taken a moment and understood yours first.\n\nI'm sorry I didn't.\n\nI Love You SHITAL ❤️"

    },


    /*
    ==========================================
    5. HEART
    ==========================================
    */

    heart: {

        emoji: "❤️",

        title: "Maybe the Learning Was for Me",

        message:
            "You said this felt like a learning and a slap for you.\n\nBut if I'm being honest, I think I learned something too.\n\nWhen someone I care about tells me that something is bothering them, I shouldn't make them feel like their feelings are invalid just because \"everyone has to do it.\"\n\nI should listen.\n\nI should understand.\n\nAnd only then should I talk.\n\nSo yes... maybe there was a lesson here.\n\nBut I think it was one I needed to learn.\n\nI'm really sorry 😔\n\nI Love You SHITAL ❤️"

    }

};



/*
==========================================
SCREEN ELEMENTS
==========================================
*/

const homeScreen =
    document.getElementById("homeScreen");


const resultScreen =
    document.getElementById("resultScreen");


const acceptedScreen =
    document.getElementById("acceptedScreen");


const rejectedScreen =
    document.getElementById("rejectedScreen");



/*
==========================================
SELECTED CARD
==========================================
*/

let selectedType = null;



/*
==========================================
SEND RESPONSE TO BACKEND
==========================================
*/

async function sendApologyResponse(response) {

    /*
    ------------------------------------------
    Make sure a card was selected
    ------------------------------------------
    */

    if (!selectedType) {

        console.error(
            "No apology card selected."
        );

        return;

    }


    /*
    ------------------------------------------
    Get selected apology
    ------------------------------------------
    */

    const apology =
        apologies[selectedType];


    /*
    ------------------------------------------
    Send response to FastAPI
    ------------------------------------------
    */

    try {

        const result = await fetch(
            "/api/apology-response",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    card_type:
                        selectedType,

                    card_title:
                        apology.title,

                    response:
                        response

                })

            }
        );


        /*
        --------------------------------------
        Check backend response
        --------------------------------------
        */

        if (!result.ok) {

            console.error(
                "Failed to send apology response."
            );

            return;

        }


        const data =
            await result.json();


        console.log(
            "Apology response sent:",
            data
        );


    } catch (error) {

        /*
        --------------------------------------
        Network/backend error
        --------------------------------------
        */

        console.error(
            "Error sending apology response:",
            error
        );

    }

}



/*
==========================================
SHOW SCREEN
==========================================
*/

function showScreen(screen) {

    /*
    ------------------------------------------
    Hide all screens
    ------------------------------------------
    */

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });


    /*
    ------------------------------------------
    Show selected screen
    ------------------------------------------
    */

    screen.classList.add(
        "active"
    );


    /*
    ------------------------------------------
    Scroll to top
    ------------------------------------------
    */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



/*
==========================================
SELECT APOLOGY CARD
==========================================
*/

document
    .querySelectorAll(".apology-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                /*
                ------------------------------
                Store selected card
                ------------------------------
                */

                selectedType =
                    card.dataset.type;


                /*
                ------------------------------
                Get apology content
                ------------------------------
                */

                const apology =
                    apologies[selectedType];


                /*
                ------------------------------
                Set emoji
                ------------------------------
                */

                document.getElementById(
                    "resultEmoji"
                ).textContent =
                    apology.emoji;


                /*
                ------------------------------
                Set title
                ------------------------------
                */

                document.getElementById(
                    "resultTitle"
                ).textContent =
                    apology.title;


                /*
                ------------------------------
                Set message
                ------------------------------
                */

                document.getElementById(
                    "resultMessage"
                ).textContent =
                    apology.message;


                /*
                ------------------------------
                Show apology card
                ------------------------------
                */

                showScreen(
                    resultScreen
                );

            }
        );

    });



/*
==========================================
YES — APOLOGY ACCEPTED
==========================================
*/

document
    .getElementById("yesButton")
    .addEventListener(
        "click",
        async () => {

            /*
            ----------------------------------
            Send YES to backend/email
            ----------------------------------
            */

            await sendApologyResponse(
                "YES"
            );


            /*
            ----------------------------------
            Show accepted screen
            ----------------------------------
            */

            showScreen(
                acceptedScreen
            );


            /*
            ----------------------------------
            Start heart animation
            ----------------------------------
            */

            createHearts();

        }
    );



/*
==========================================
NO — NOT YET
==========================================
*/

document
    .getElementById("noButton")
    .addEventListener(
        "click",
        async () => {

            /*
            ----------------------------------
            Send NO to backend/email
            ----------------------------------
            */

            await sendApologyResponse(
                "NO"
            );


            /*
            ----------------------------------
            Show rejected screen
            ----------------------------------
            */

            showScreen(
                rejectedScreen
            );

        }
    );



/*
==========================================
BACK BUTTON
==========================================
*/

document
    .getElementById("backButton")
    .addEventListener(
        "click",
        () => {

            showScreen(
                homeScreen
            );

        }
    );



/*
==========================================
TRY ANOTHER CARD
==========================================
*/

document
    .getElementById("tryAgainButton")
    .addEventListener(
        "click",
        () => {

            showScreen(
                homeScreen
            );

        }
    );



/*
==========================================
HEART ANIMATION
==========================================
*/

function createHearts() {

    /*
    ------------------------------------------
    Heart emojis
    ------------------------------------------
    */

    const hearts = [

        "❤️",
        "💕",
        "💗",
        "💖",
        "🫶",
        "🥹"

    ];


    /*
    ------------------------------------------
    Create 25 hearts
    ------------------------------------------
    */

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const heart =
            document.createElement(
                "div"
            );


        /*
        --------------------------------------
        Add CSS class
        --------------------------------------
        */

        heart.className =
            "floating-heart";


        /*
        --------------------------------------
        Random emoji
        --------------------------------------
        */

        heart.textContent =
            hearts[
                Math.floor(
                    Math.random() *
                    hearts.length
                )
            ];


        /*
        --------------------------------------
        Random horizontal position
        --------------------------------------
        */

        heart.style.left =
            Math.random() * 100 +
            "vw";


        /*
        --------------------------------------
        Random animation delay
        --------------------------------------
        */

        heart.style.animationDelay =
            Math.random() * 1.5 +
            "s";


        /*
        --------------------------------------
        Random size
        --------------------------------------
        */

        heart.style.fontSize =
            (
                18 +
                Math.random() * 25
            ) +
            "px";


        /*
        --------------------------------------
        Add to page
        --------------------------------------
        */

        document.body.appendChild(
            heart
        );


        /*
        --------------------------------------
        Remove after animation
        --------------------------------------
        */

        setTimeout(
            () => {

                heart.remove();

            },
            4500
        );

    }

}