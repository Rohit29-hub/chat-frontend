type dataType = {
    sender: string,
    receiver: string,
    message: string
    timestamps: string,
}

export const saveMessage = (token: string, data: dataType) => {
    try {
        fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/message/add_message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                sender: data.sender,
                message: data.message,
                receiver: data.receiver,
                timestamps: data.timestamps
            })
        }).then((data) => data.json())
            .then(() => console.log("message saved !"))
            .catch((err) => console.error(err.message))
    } catch (err: any) {
        console.log(err.message);
    }
}


export const getMessage = async (token: string, userId: string, myId: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/message/getMessage/${userId}/${myId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        const data = await response.json();
        const parsedMessages = data.messages_data.map((messageString: string) => JSON.parse(messageString))
        return parsedMessages;
    } catch (err) {
        console.log(err);
    }
}

export const getData = async (token: string, userId?: string) => {
    try {
        const url = userId ? `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/get_user_details/${userId}` : `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/get_user_details`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })

        const data = await response.json();
        return data.body;
    } catch (err) {
        console.log(err);
    }
}