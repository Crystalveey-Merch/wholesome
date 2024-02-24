useEffect(() => {
  const fetchChatsAndMessages = async () => {
    try {
      const chatsRef = collection(db, "chats");
      const chatSnapshot = await getDocs(chatsRef);
      const groupedChatsObj = {};

      for (const chatDoc of chatSnapshot.docs) {
        const chatId = chatDoc.data().chatId;
        const messagesQuery = query(
          collectionGroup(db, "messages"),
          where("chatId", "==", chatId)
        );
        const messagesSnapshot = await getDocs(messagesQuery);

        const groupedMessages = messagesSnapshot.docs.map((messageDoc) => ({
          id: messageDoc.id,
          ...messageDoc.data(),
        }));

        groupedChatsObj[chatId] = {
          chatData: chatDoc.data(),
          messages: groupedMessages,
        };
      }

      setAllChats(groupedChatsObj);
    } catch (error) {
      console.error("Error fetching chats and messages:", error);
      setAllChats({});
    }
  };

  fetchChatsAndMessages();

  // Subscribe to new chats
  const unsubscribe = onSnapshot(collection(db, "chats"), () => {
    fetchChatsAndMessages();
  });

  return () => {
    unsubscribe(); // Unsubscribe when component unmounts
  };
}, []);

useEffect(() => {
  const fetchChatsAndMessages = async () => {
    try {
      const chatsRef = collection(db, "chats");
      const chatSnapshot = await getDocs(chatsRef);

      const groupedChatsObj = {};

      for (const chatDoc of chatSnapshot.docs) {
        const chatId = chatDoc.data().chatId;
        // console.log(chatDoc.data().chatId
        // );

        const chatQuery = query(chatsRef, where("chatId", "==", chatId));

        const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
          let chatDocRef;
          if (snapshot.empty) {
            return;
          } else {
            chatDocRef = snapshot.docs[0].ref;
            const messagesRef = collection(chatDocRef, "messages");

            const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
              const groupedMessages = [];
              snapshot.forEach((messageDoc) => {
                groupedMessages.push({
                  id: messageDoc.id,
                  ...messageDoc.data(),
                });
              });

              groupedChatsObj[chatId] = {
                chatData: chatDoc.data(),
                messages: groupedMessages,
              };
              setAllChats(groupedChatsObj);
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setAllChats([]);
    }
  };

  fetchChatsAndMessages();
}, []);

useEffect(() => {
  const fetchChatsAndMessages = async () => {
    try {
      const chatsRef = collection(db, "chats");
      const chatSnapshot = await getDocs(chatsRef);

      const groupedChatsObj = {};

      for (const chatDoc of chatSnapshot.docs) {
        const chatId = chatDoc.data().chatId;
        // console.log(chatDoc.data().chatId
        // );

        const messagesRef = collection(db, "chats", chatId, "messages");
        const queryMessages = query(messagesRef, where("chatId", "==", chatId));
        const messagesSnapshot = await getDocs(queryMessages);

        const groupedMessages = [];

        messagesSnapshot.forEach((messageDoc) => {
          groupedMessages.push({
            id: messageDoc.id,
            ...messageDoc.data(),
          });
        });

        groupedChatsObj[chatId] = {
          chatData: chatDoc.data(),
          messages: groupedMessages,
        };
      }

      const groupedChatsArray = Object.values(groupedChatsObj);
      setAllChats(groupedChatsArray);
    } catch (error) {
      console.error("Error fetching and grouping chats and messages:", error);
    }
  };

  fetchChatsAndMessages();

  // Subscribe to new chats
  const unsubscribe = onSnapshot(collection(db, "chats"), () => {
    fetchChatsAndMessages();
  });

  return () => {
    unsubscribe(); // Unsubscribe when component unmounts
  };
}, []);



useEffect(() => {
  const fetchChatsAndMessages = async () => {
    try {
      const chatsRef = collection(db, "chats");
      const chatSnapshot = await getDocs(chatsRef);

      const groupedChatsObj = {};

      for (const chatDoc of chatSnapshot.docs) {
        const chatId = chatDoc.data().chatId;
        const chatDocId = chatDoc.id;
        // console.log(chatDoc.data().chatId
        // );

        const chatQuery = query(chatsRef, where("chatId", "==", chatId));

        onSnapshot(chatQuery, (snapshot) => {
          let chatDocRef;
          if (snapshot.empty) {
            return;
          } else {
            chatDocRef = snapshot.docs[0].ref;
            const messagesRef = collection(chatDocRef, "messages");

            onSnapshot(messagesRef, (snapshot) => {
              const groupedMessages = [];
              snapshot.forEach((messageDoc) => {
                groupedMessages.push({
                  id: messageDoc.id,
                  ...messageDoc.data(),
                });
              });

              groupedChatsObj[chatDocId] = {
                chatId,
                chatData: chatDoc.data(),
                messages: groupedMessages,
              };
              setAllChats(groupedChatsObj);
            });
          }
        });
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setAllChats([]);
    }
  };

  fetchChatsAndMessages();
}, []);