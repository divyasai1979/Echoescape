const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    let currentRoom = 0;

    const rooms = [
      {
        description: "You are in a dark room. A glowing wall reads: 'Say the magic word to light the path.'",
        answer: "illuminate",
        bg: "#000000",
        color: "#ffeb3b"
      },
      {
        description: "The room brightens. You see a door that responds to chemistry. Say five chemical elements that start with 'F'.",
        answer: ["f1", "f2", "f3", "f4", "f5"],
        count: 0,
        found: [],
        bg: "#102027",
        color: "#00e5ff"
      },
      {
        description: "You enter a maze. Say directions like 'go left', 'turn right', 'backtrack'. Find the correct direction to proceed.",
        answer: "turn right",
        bg: "#263238",
        color: "#80cbc4"
      },
      {
        description: "A mirror shimmers and asks: 'What do you fear the most?' Answer truthfully...",
        answer: "spiders",
        bg: "#1a237e",
        color: "#c5cae9"
      },
      {
        description: "Final room: Whisper the secret word to escape. (Try saying it softly)",
        answer: "freedom",
        bg: "#004d40",
        color: "#b2dfdb"
      }
    ];

    function startGame() {
      document.querySelector('button').style.display = 'none';
      nextRoom();
    }

    function nextRoom() {
      if (currentRoom >= rooms.length) {
        document.getElementById("room-description").innerText = "🎉 You Escaped! Well done, brave soul.";
        document.body.style.backgroundColor = "#2e7d32";
        document.body.style.color = "#fff";
        return;
      }

      const room = rooms[currentRoom];
      document.getElementById("room-description").innerText = room.description;
      document.getElementById("room-description").classList.add("fade");
      document.body.style.backgroundColor = room.bg;
      document.body.style.color = room.color;
      listen();
    }

    function listen() {
      recognition.start();
      document.getElementById("output").innerText = "Listening...";

      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        document.getElementById("output").innerText = `You said: "${transcript}"`;

        const room = rooms[currentRoom];

        if (Array.isArray(room.answer)) {
          let matched = false;
          for (let item of room.answer) {
            if (transcript.includes(item) && !room.found.includes(item)) {
              room.found.push(item);
              room.count++;
              matched = true;
            }
          }

          if (matched) {
            document.getElementById("output").innerText += `\n✅ Found: ${room.found.join(", ")} (${room.count}/5)`;
          } else {
            document.getElementById("output").innerText += "\n❌ No new elements found.";
          }

          if (room.count >= 5) {
            currentRoom++;
            setTimeout(nextRoom, 1000);
          } else {
            setTimeout(listen, 1000);
          }

        } else if (transcript.includes(room.answer)) {
          currentRoom++;
          setTimeout(nextRoom, 1000);
        } else {
          document.getElementById("output").innerText += "\nIncorrect. Try again.";
          setTimeout(listen, 1000);
        }
      };

      recognition.onerror = function(event) {
        document.getElementById("output").innerText = "Error: " + event.error;
        setTimeout(listen, 1000);
      };
    }