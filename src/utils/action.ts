type dataType = {
    sender: string,
    receiver: string,
    message: string,
    timestamps: string,
    type: 'text' | 'image',
    image?: File | null
}

export const saveMessage = async (token: string, data: dataType) => {
    try {
        const formData = new FormData();
        
        // Append fields to the FormData object
        formData.append("sender", data.sender);
        formData.append("receiver", data.receiver);
        formData.append("message", data.message);
        formData.append("timestamps", data.timestamps);
        formData.append("type", data.type);
    
        if (data.image) {
            formData.append("image", data.image);
        }

        // Send the request with FormData
        fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/message/add_message`, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((result) => console.log("Message saved!", result))
        .catch((err) => console.error("Error:", err.message));
    } catch (err: any) {
        console.log("Error:", err.message);
    }
};


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
        return data.messages;
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

export const updateData = async (token: string, userId: string, updatedData: object) => {
    try {
        const url = `${import.meta.env.VITE_APP_BACKEND_URL}/api/user/update_user_details/${userId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Failed to update user data');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
    }
};
